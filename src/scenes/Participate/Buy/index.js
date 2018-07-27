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

// Design
import OptionBuy from '../../../components/Vote/InOutOption'

// Utils
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
      <ButtonGradient disabled={amountToBuy === 0} onPress={() => this._submit()} text='CONFIRM' />
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
    const amountToPay = this._fixNumber(amountToBuy * (item.price / ONE_TRX))

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
        participateAmount: amountToPay
      }

      const data = await Client.getParticipateTransaction(this.props.context.pin, participatePayload)

      this._openTransactionDetails(data)
    } catch (err) {
      if (err.message === 'INSUFFICIENT_BALANCE') {
        Alert.alert('Not enough funds (TRX) to participate.')
      } else if (err.message === 'INSUFFICIENT_TRX') {
        Alert.alert(`You need to buy at least one TRX worth of ${item.name}.`, `Currently you are buying only ${amountToPay}.`)
      } else {
        Alert.alert('Warning', 'Woops something went wrong. Try again later, If the error persist try to update the network settings.')
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
          tx: transactionSigned
        })
      })
    } catch (error) {
      Alert.alert('Error getting transaction.')
    }
  }

  render () {
    const { item } = this.props.navigation.state.params
    const { name, price, description } = item
    const { totalRemaining, amountToBuy, notEnoughTrxBalance } = this.state
    const amountToPay = (price / ONE_TRX) * amountToBuy
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <ScrollView>
          <BuyContainer>
            <WhiteBuyText>AMOUNT TO BUY</WhiteBuyText>
            <VerticalSpacer size={4} />
            <AmountText>
              {formatNumber(amountToBuy)} {name}
            </AmountText>
            <TrxValueText>({formatNumber(amountToPay)} TRX)</TrxValueText>
            {notEnoughTrxBalance && (
              <React.Fragment>
                <VerticalSpacer size={4} />
                <WhiteBuyText>
                  You don't have enough TRX to buy that many {name}.
                </WhiteBuyText>
                <VerticalSpacer size={4} />
              </React.Fragment>
            )}
            <BuyText>BALANCE: {formatNumber(totalRemaining)} TRX</BuyText>
            <VerticalSpacer size={7} />
            <BuyText>PRICE PER TOKEN: {price / ONE_TRX} TRX</BuyText>
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
                title='Clear'
                disabled={amountToBuy === 0}
                onPress={this._clearVoteCount}
              />
              <OptionBuy
                title='All in'
                disabled={totalRemaining === 0}
                onPress={this._allinVoteCount}
              />
            </Utils.Row>
          </MarginFixer>
          <VerticalSpacer size={1} />
          <BuyContainer>
            {this._renderConfirmButtom()}
            <VerticalSpacer size={23} />
            <BuyText>TOKEN DESCRIPTION</BuyText>
            <VerticalSpacer size={17} />
            <BuyText>{description}</BuyText>
            <VerticalSpacer size={17} />
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('TokenInfo', { item }) }}>
              <MoreInfoButton>
                <ButtonText>MORE INFO</ButtonText>
              </MoreInfoButton>
            </TouchableOpacity>
          </BuyContainer>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
export default withContext(BuyScene)
