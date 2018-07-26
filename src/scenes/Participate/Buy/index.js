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

const padKeys = [1, 5, 10, 25, 50, 100, 500, 1000]

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
      this.setState({ trxBalance: balances[0].balance, totalRemaining: balances[0].balance })
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

  _incrementVoteCount = quant => {
    const { price } = this.props.navigation.state.params.item
    const { amountToBuy, totalRemaining } = this.state

    const amountToPay = (price / ONE_TRX) * quant

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
      const amountToPay = amountToBuy * (price / ONE_TRX)
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

  _formatTrxValue = (value) => Number.isInteger(value) ? value : value.toFixed(2)

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
            <TrxValueText>({this._formatTrxValue(amountToPay)} TRX)</TrxValueText>
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
              {padKeys.map((voteKey) => {
                return (
                  <Utils.NumKeyWrapper key={voteKey} flexBasis={25}>
                    <Utils.NumKey onPress={() => this._incrementVoteCount(voteKey)}>
                      <Utils.Text font='regular' primary>+{voteKey}</Utils.Text>
                    </Utils.NumKey>
                  </Utils.NumKeyWrapper>
                )
              })}
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
                disabled={totalRemaining <= 0}
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
