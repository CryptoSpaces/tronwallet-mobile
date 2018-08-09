import React, { Component } from 'react'

import {
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native'

import { withContext } from '../../../store/context'

// Design
import * as Utils from '../../../components/Utils'
import { Colors } from '../../../components/DesignSystem'
import ButtonGradient from '../../../components/ButtonGradient'
import NavigationHeader from '../../../components/Navigation/Header'
import OptionBuy from '../../../components/Vote/InOutOption'

import {
  BuyText,
  WhiteBuyText,
  BuyContainer,
  VerticalSpacer,
  AmountText,
  MarginFixer,
  MoreInfoButton,
  ButtonText,
  TrxValueText
} from '../Elements'

// Utils
import tl from '../../../utils/i18n'
import getBalanceStore from '../../../store/balance'
import { formatNumber } from '../../../utils/numberUtils'
import Client, { ONE_TRX } from '../../../services/client'
import { signTransaction } from '../../../utils/transactionUtils'

const buyOptions = {
  1: 1,
  5: 5,
  10: 10,
  25: 25,
  50: 50,
  100: 100,
  500: 500,
  1000: 1000,
  '10k': 10000,
  '100k': 100000,
  '500k': 500000,
  '1m': 1000000
}

class BuyScene extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <NavigationHeader
          title={navigation.state.params.item.name}
          onBack={() => navigation.goBack()}
        />
      )
    }
  }

  state = {
    totalRemaining: 0,
    amountToBuy: 0,
    trxBalance: 0,
    notEnoughTrxBalance: false,
    loading: false
  }

  async componentDidMount () {
    const balances = await this._getBalancesFromStore()
    if (balances.length) {
      const currentBalance = this._fixNumber(balances[0].balance)
      this.setState({ trxBalance: currentBalance, totalRemaining: currentBalance })
    }
  }

  _getBalancesFromStore = async () => {
    const store = await getBalanceStore()
    return store
      .objects('Balance')
      .filtered(
        `name = 'TRX'`
      )
      .map(item => Object.assign({}, item))
  }

  _fixNumber = (value) => {
    if (Number.isInteger(value)) return value
    else return value.toFixed(5) > 0 ? value.toFixed(5) : value.toFixed(2)
  }

  _incrementVoteCount = quant => {
    const { price } = this.props.navigation.state.params.item
    const { amountToBuy, totalRemaining } = this.state

    const amountToPay = this._fixNumber((price / ONE_TRX) * quant)

    if (amountToPay > totalRemaining) {
      this.setState({ notEnoughTrxBalance: true })
      return
    }
    this.setState({
      amountToBuy: amountToBuy + quant,
      totalRemaining: totalRemaining - amountToPay,
      notEnoughTrxBalance: false
    })
  }

  _allinVoteCount = () => {
    const { price } = this.props.navigation.state.params.item
    const { trxBalance } = this.state

    const amountToBuy = Math.floor(trxBalance / (price / ONE_TRX))
    if (amountToBuy > 0) {
      const amountToPay = this._fixNumber(amountToBuy * (price / ONE_TRX))
      this.setState({
        amountToBuy: amountToBuy,
        totalRemaining: trxBalance - amountToPay,
        notEnoughTrxBalance: false
      })
    } else {
      this.setState({ notEnoughTrxBalance: true })
    }
  }

  _clearVoteCount = () => {
    this.setState({
      amountToBuy: 0,
      totalRemaining: this.state.trxBalance,
      notEnoughTrxBalance: false
    })
  }

  _renderConfirmButtom = () => {
    const { loading, amountToBuy } = this.state

    if (loading) {
      return <ActivityIndicator color={'#ffffff'} />
    }

    return (
      <ButtonGradient disabled={amountToBuy === 0} onPress={() => this._submit()} text={tl.t('participate.button.confirm')} />
    )
  }

  _renderPadkeys = () => Object.keys(buyOptions).map((buyKey, index) => {
    const { item } = this.props.navigation.state.params
    const totalPossible = this.state.trxBalance * ONE_TRX / item.price
    const totalRemainingToBuy = this.state.totalRemaining * ONE_TRX / item.price
    const isDisabled = buyOptions[buyKey] > totalRemainingToBuy

    if (totalPossible < 10000 && buyOptions[buyKey] >= 10000) return

    return <Utils.NumKeyWrapper disabled={isDisabled} key={buyKey} flexBasis={25}>
      <Utils.NumKey
        disabled={isDisabled}
        onPress={() => this._incrementVoteCount(buyOptions[buyKey])}>
        <Utils.Text font='regular' primary>+{buyKey}</Utils.Text>
      </Utils.NumKey>
    </Utils.NumKeyWrapper>
  })

  _submit = async () => {
    const { item } = this.props.navigation.state.params
    const { trxBalance, amountToBuy } = this.state
    const amountToPay = amountToBuy * (item.price / ONE_TRX)

    try {
      this.setState({ loading: true })
      if (trxBalance < amountToPay) {
        throw new Error('INSUFFICIENT_BALANCE')
      }
      if (amountToPay < 1) {
        throw new Error('INSUFFICIENT_TRX')
      }

      const participatePayload = {
        participateAddress: item.ownerAddress,
        participateToken: item.name,
        participateAmount: this._fixNumber(amountToPay)
      }

      const data = await Client.getParticipateTransaction(this.props.context.pin, participatePayload)
      await this._openTransactionDetails(data)
    } catch (err) {
      if (err.message === 'INSUFFICIENT_BALANCE') {
        Alert.alert(tl.t('participate.error.insufficientBalance'))
      } else if (err.message === 'INSUFFICIENT_TRX') {
        Alert.alert(
          tl.t('participate.error.insufficientTrx.title', { token: item.name }),
          tl.t('participate.error.insufficientTrx.message', { amount: this._fixNumber(amountToPay) })
        )
      } else {
        Alert.alert(tl.t('warning'), tl.t('error.default'))
      }
    } finally {
      this.setState({ loading: false })
    }
  }

  _openTransactionDetails = async transactionUnsigned => {
    try {
      const transactionSigned = await signTransaction(this.props.context.pin, transactionUnsigned)
      this.setState({ loading: false }, () => {
        this.props.navigation.navigate('SubmitTransaction', {
          tx: transactionSigned,
          tokenAmount: this.state.amountToBuy
        })
      })
    } catch (error) {
      Alert.alert(tl.t('error.gettingTransaction'))
    }
  }

  render () {
    const { item } = this.props.navigation.state.params
    const { name, price, description } = item
    const { totalRemaining, amountToBuy, notEnoughTrxBalance } = this.state
    const amountToPay = (price / ONE_TRX) * amountToBuy
    const tokenPrice = price / ONE_TRX
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <ScrollView style={{ paddingBottom: 10 }}>
          <BuyContainer>
            <WhiteBuyText>{tl.t('participate.amountToBuy')}</WhiteBuyText>
            <VerticalSpacer size={4} />
            <AmountText>
              {formatNumber(amountToBuy)}
            </AmountText>
            <TrxValueText>({formatNumber(amountToPay)} TRX)</TrxValueText>
            {notEnoughTrxBalance && (
              <React.Fragment>
                <VerticalSpacer size={4} />
                <WhiteBuyText>
                  {tl.t('participate.warning', { token: name })}
                </WhiteBuyText>
                <VerticalSpacer size={4} />
              </React.Fragment>
            )}
            <Utils.Row>
              <BuyText>{tl.t('balance.title')}:</BuyText>
              <WhiteBuyText> {formatNumber(totalRemaining)} TRX</WhiteBuyText>
            </Utils.Row>
            <VerticalSpacer size={7} />
            <Utils.Row>
              <BuyText>{tl.t('participate.pricePerToken')}:</BuyText>
              <WhiteBuyText> {tokenPrice} TRX</WhiteBuyText>
            </Utils.Row>
            <VerticalSpacer size={13} />
          </BuyContainer>
          <MarginFixer>
            <Utils.Row wrap='wrap'>
              {this._renderPadkeys()}
            </Utils.Row>
          </MarginFixer>
          <VerticalSpacer size={14} />
          <MarginFixer>
            <Utils.Row>
              <OptionBuy
                title={tl.t('clear')}
                disabled={amountToBuy === 0}
                onPress={this._clearVoteCount}
              />
              <OptionBuy
                title={tl.t('allIn')}
                disabled={totalRemaining <= 0 || totalRemaining < tokenPrice}
                onPress={this._allinVoteCount}
              />
            </Utils.Row>
          </MarginFixer>
          <VerticalSpacer size={1} />
          <BuyContainer>
            {this._renderConfirmButtom()}
            <VerticalSpacer size={23} />
            {!!description.length && (
              <React.Fragment>
                <BuyText>{tl.t('participate.tokenDescription')}</BuyText>
                <VerticalSpacer size={17} />
                <BuyText>{description}</BuyText>
                <VerticalSpacer size={17} />
              </React.Fragment>
            )}
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('TokenInfo', { item }) }}>
              <MoreInfoButton>
                <ButtonText>{tl.t('participate.button.moreInfo')}</ButtonText>
              </MoreInfoButton>
            </TouchableOpacity>
          </BuyContainer>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
export default withContext(BuyScene)
