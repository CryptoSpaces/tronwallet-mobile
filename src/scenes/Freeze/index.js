import React, { Component } from 'react'
import { Linking, Alert } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

import * as Utils from '../../components/Utils'
import Header from '../../components/Header'
import Input from '../../components/Input'
import Badge from '../../components/Badge'
import ButtonGradient from '../../components/ButtonGradient'
import { Colors } from '../../components/DesignSystem'

import Client from '../../services/client'
import { TronVaultURL } from '../../utils/deeplinkUtils'
import { signTransaction } from '../../utils/transactionUtils'
import { Context } from '../../store/context'
import KeyboardScreen from '../../components/KeyboardScreen'
import getTransactionStore from '../../store/transactions'

class FreezeScene extends Component {
  state = {
    from: '',
    balances: [],
    trxBalance: 0,
    bandwidth: 0,
    total: 0,
    amount: '',
    loading: true,
    unfreezeStatus: {
      msg: '',
      disabled: false
    }
  }

  componentDidMount () {
    this._didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      this.loadData
    )
  }

  componentWillUnmount () {
    this._didFocusSubscription.remove()
  }

  _checkUnfreeze = async () => {
    let unfreezeStatus = {
      msg: 'After a three day period you can unfreeze your TRX',
      disabled: true
    }
    try {
      const transactionStore = await getTransactionStore()
      const lastFreeze = transactionStore.objects('Transaction')
        .sorted([['timestamp', true]])
        .filtered('type == "Freeze"')[0]

      if (lastFreeze.timestamp) {
        const lastFreezeTimePlusThree = moment(lastFreeze.timestamp).add(3, 'days')
        const differenceFromNow = lastFreezeTimePlusThree.diff(moment())
        const duration = moment.duration(differenceFromNow)

        if (duration.asSeconds() > 0) {
          unfreezeStatus.msg = duration.asDays() < 1 ? duration.asHours() < 1
            ? `You can unfreeze your TRX in ${Math.round(duration.asMinutes())} minutes.`
            : `You can unfreeze your TRX in ${Math.round(duration.asHours())} hours.`
            : `You can unfreeze your TRX in ${Math.round(duration.asDays())} days.`
          unfreezeStatus.disabled = true
          return unfreezeStatus
        } else {
          unfreezeStatus.msg = 'You can unfreeze your TRX now.'
          unfreezeStatus.disabled = false
          return unfreezeStatus
        }
      } else {
        return unfreezeStatus
      }
    } catch (error) {
      return unfreezeStatus
    }
  }

  loadData = async () => {
    try {
      const { freeze, publicKey } = this.props.context
      const { balance } = freeze.value.balances.find(b => b.name === 'TRX')
      const total = freeze.value.total || 0
      const unfreezeStatus = await this._checkUnfreeze()
      this.setState({
        from: publicKey.value,
        balances: freeze,
        trxBalance: balance,
        bandwidth: freeze.value.bandwidth.netReimaining,
        loading: false,
        unfreezeStatus,
        total
      })
    } catch (error) {
      this.setState({
        loading: false
      })
    }
  }

  _submitUnfreeze = async () => {
    try {
      const data = await Client.getUnfreezeTransaction()
      this.openTransactionDetails(data)
    } catch (error) {
      Alert.alert('Error while building transaction, try again.')
      this.setState({ error: 'Error getting transaction', loadingSign: false })
    }
  }
  submit = async () => {
    const { amount, trxBalance } = this.state
    const convertedAmount = Number(amount)

    this.setState({ loading: true })
    try {
      if (trxBalance < convertedAmount) { throw new Error('Insufficient TRX balance') }
      if (!Number.isInteger(Number(amount))) { throw new Error('Can only freeze round numbers') }
      await this.freezeToken()
    } catch (error) {
      this.setState({ loading: false })
      Alert.alert(error.message)
    }
  }

  freezeToken = async () => {
    const { amount } = this.state
    const convertedAmount = Number(amount)

    try {
      const data = await Client.getFreezeTransaction(convertedAmount)
      this.openTransactionDetails(data)
    } catch (error) {
      Alert.alert('Error while building transaction, try again.')
      this.setState({ error: 'Error getting transaction' })
    } finally {
      this.setState({ loading: false })
    }
  }

  openTransactionDetails = async transactionUnsigned => {
    try {
      const transactionSigned = await signTransaction(transactionUnsigned)
      this.setState({ loadingSign: false }, () => {
        this.props.navigation.navigate('SubmitTransaction', {
          tx: transactionSigned
        })
      })
    } catch (error) {
      Alert.alert(error.message)
      this.setState({ error: 'Error getting transaction', loadingSign: false })
    }
  }

  openDeepLink = async dataToSend => {
    try {
      const url = `${TronVaultURL}auth/${dataToSend}`
      await Linking.openURL(url)
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false }, () => {
        this.props.navigation.navigate('GetVault')
      })
    }
  }

  _changeFreeze = value => {
    const validation = /^0[0-9]/
    let amount = validation.test(value) ? value.slice(1, value.length) : value

    this.setState({
      amount: amount
    })
  }

  _leftContent = () => (
    <Utils.View marginRight={8} marginLeft={8}>
      <Ionicons name='ios-unlock' size={16} color={Colors.secondaryText} />
    </Utils.View>
  )

  render () {
    const { trxBalance, amount, loading, unfreezeStatus } = this.state
    const { freeze } = this.props.context
    const totalPower = freeze.value ? freeze.value.total : 0

    return (
      <KeyboardScreen>
        <Utils.Container style={{borderColor: Colors.secondaryText, borderTopWidth: 0.5}}>
          <Header>
            <Utils.View align='center'>
              <Utils.VerticalSpacer size='xsmall' />
              <Utils.Text size='xsmall' secondary>
                BALANCE
              </Utils.Text>
              <Utils.VerticalSpacer size='medium' />
              <Utils.Row align='center'>
                <Utils.Text size='huge'>{trxBalance.toFixed(2)}</Utils.Text>
                <Utils.HorizontalSpacer />
                <Badge>TRX</Badge>
              </Utils.Row>
            </Utils.View>
          </Header>
          <Utils.Content paddingTop={8}>
            <Input
              label='FREEZE AMOUNT'
              leftContent={this._leftContent}
              keyboardType='numeric'
              align='right'
              value={amount}
              onChangeText={value => this._changeFreeze(value)}
              onSubmitEditing={this.submit}
              placeholder='0'
            />
            <Utils.VerticalSpacer size='small' />
            <Utils.SummaryInfo>
              {`TRON POWER: ${totalPower + Number(amount)}`}
            </Utils.SummaryInfo>
            <Utils.VerticalSpacer size='medium' />
            <ButtonGradient
              font='bold'
              text='FREEZE'
              onPress={this.submit}
              disabled={loading || totalPower <= 0}
            />
            <Utils.VerticalSpacer size='big' />
            <Utils.View align='center' justify='center'>
              <Utils.SummaryInfo>
                {unfreezeStatus.msg}
              </Utils.SummaryInfo>
              <Utils.VerticalSpacer size='medium' />
              <Utils.LightButton
                paddingY={'medium'}
                paddingX={'large'}
                disabled={unfreezeStatus.disabled}
                onPress={this._submitUnfreeze}>
                <Utils.Text size='xsmall'>UNFREEZE</Utils.Text>
              </Utils.LightButton>
            </Utils.View>
          </Utils.Content>
        </Utils.Container>
      </KeyboardScreen>
    )
  }
}

export default props => (
  <Context.Consumer>
    {context => <FreezeScene context={context} {...props} />}
  </Context.Consumer>
)
