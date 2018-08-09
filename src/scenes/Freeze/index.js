import React, { Component } from 'react'
import { Alert, Keyboard } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import { Answers } from 'react-native-fabric'

import tl from '../../utils/i18n'
import * as Utils from '../../components/Utils'
import Header from '../../components/Header'
import Input from '../../components/Input'
import Badge from '../../components/Badge'
import ButtonGradient from '../../components/ButtonGradient'
import { Colors } from '../../components/DesignSystem'
import KeyboardScreen from '../../components/KeyboardScreen'
import NavigationHeader from '../../components/Navigation/Header'

import Client from '../../services/client'
import { signTransaction } from '../../utils/transactionUtils'
import getTransactionStore from '../../store/transactions'
import { withContext } from '../../store/context'
import { formatNumber } from '../../utils/numberUtils'

class FreezeScene extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <NavigationHeader
          title={tl.t('freeze.title')}
          onBack={() => { navigation.goBack() }}
          noBorder
        />
      )
    }
  }
  state = {
    from: '',
    balances: [],
    trxBalance: 0,
    bandwidth: 0,
    total: 0,
    amount: '',
    loading: true,
    unfreezeStatus: {
      msg: tl.t('freeze.unfreeze.inThreeDays'),
      disabled: false
    }
  }

  componentDidMount () {
    Answers.logContentView('Page', 'Freeze')
    this._didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      this._loadData
    )
  }

  componentWillUnmount () {
    this._didFocusSubscription.remove()
  }

  _checkUnfreeze = async () => {
    let unfreezeStatus = {
      msg: tl.t('freeze.unfreeze.inThreeDays'),
      disabled: false
    }
    try {
      const transactionStore = await getTransactionStore()

      const queryFreeze = transactionStore
        .objects('Transaction')
        .sorted([['timestamp', true]])
        .filtered('type == "Unfreeze" or type == "Freeze"')
      const lastFreeze = queryFreeze.length && queryFreeze[0].type === 'Freeze'
        ? queryFreeze[0] : null

      if (lastFreeze) {
        const lastFreezeTimePlusThree = moment(lastFreeze.timestamp).add(3, 'days')
        const differenceFromNow = lastFreezeTimePlusThree.diff(moment())
        const duration = moment.duration(differenceFromNow)

        if (duration.asSeconds() > 0) {
          unfreezeStatus.msg = duration.asDays() < 1 ? duration.asHours() < 1
            ? tl.t('freeze.unfreeze.inXMinutes', { minutes: Math.round(duration.asMinutes()) })
            : tl.t('freeze.unfreeze.inXHours', { hours: Math.round(duration.asHours()) })
            : tl.t('freeze.unfreeze.inXDays', { days: Math.round(duration.asDays()) })
          unfreezeStatus.disabled = true
          return unfreezeStatus
        } else {
          unfreezeStatus.msg = tl.t('freeze.unfreeze.now')
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

  _loadData = async () => {
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
      console.log(error)
      this.setState({ loading: false })
    }
  }

  _submitUnfreeze = async () => {
    this.setState({loading: true})
    try {
      const data = await Client.getUnfreezeTransaction(this.props.context.pin)
      this._openTransactionDetails(data)
    } catch (error) {
      Alert.alert(tl.t('error.buildingTransaction'))
      this.setState({ loadingSign: false })
    } finally {
      this.setState({loading: false})
    }
  }
  _submit = async () => {
    const { amount, trxBalance } = this.state
    const convertedAmount = Number(amount)

    this.setState({ loading: true })
    try {
      if (convertedAmount <= 0) { throw new Error(tl.t('freeze.error.minimiumAmount')) }
      if (trxBalance < convertedAmount) { throw new Error(tl.t('freeze.error.insufficientAmount')) }
      if (!Number.isInteger(convertedAmount)) { throw new Error(tl.t('freeze.error.roundNumbers')) }
      await this._freezeToken()
    } catch (error) {
      this.setState({ loading: false })
      Alert.alert(tl.t('warning'), error.message)
    }
  }

  _freezeToken = async () => {
    const { amount } = this.state
    const convertedAmount = Number(amount)

    try {
      const data = await Client.getFreezeTransaction(this.props.context.pin, convertedAmount)
      this._openTransactionDetails(data)
    } catch (error) {
      Alert.alert(Alert.alert(tl.t('error.buildingTransaction')))
    } finally {
      this.setState({ loading: false })
    }
  }

  _openTransactionDetails = async (transactionUnsigned) => {
    try {
      const transactionSigned = await signTransaction(this.props.context.pin, transactionUnsigned)
      this.setState({ loadingSign: false }, () => {
        this.props.navigation.navigate('SubmitTransaction', {
          tx: transactionSigned
        })
      })
    } catch (error) {
      Alert.alert(tl.t('error.gettingTransaction'))
      this.setState({ loadingSign: false })
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
    const userTotalPower = freeze.value ? Number(freeze.value.total) : 0
    const newTotalPower = userTotalPower + Number(amount.replace(/,/g, ''))

    return (
      <KeyboardScreen>
        <Utils.Container>
          <Header>
            <Utils.View align='center'>
              <Utils.Text size='xsmall' secondary>
                {tl.t('freeze.balance')}
              </Utils.Text>
              <Utils.VerticalSpacer size='medium' />
              <Utils.Row align='center'>
                <Utils.Text size='large'>{formatNumber(trxBalance)}</Utils.Text>
                <Utils.HorizontalSpacer />
                <Badge>TRX</Badge>
              </Utils.Row>
            </Utils.View>
          </Header>
          <Utils.Content paddingTop={8}>
            <Input
              label={tl.t('freeze.amount')}
              leftContent={this._leftContent}
              keyboardType='numeric'
              align='right'
              value={amount}
              onChangeText={value => this._changeFreeze(value)}
              onSubmitEditing={() => Keyboard.dismiss()}
              placeholder='0'
              type='int'
              numbersOnly
            />
            <Utils.VerticalSpacer size='small' />
            <Utils.SummaryInfo>
              {`${tl.t('tronPower')} ${formatNumber(newTotalPower)}`}
            </Utils.SummaryInfo>
            <Utils.VerticalSpacer size='medium' />
            <ButtonGradient
              font='bold'
              text={tl.t('freeze.title')}
              onPress={this._submit}
              disabled={loading || !(amount > 0 && amount <= trxBalance)}
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
                disabled={unfreezeStatus.disabled || loading || !userTotalPower}
                onPress={this._submitUnfreeze}>
                <Utils.Text size='xsmall'>{tl.t('freeze.unfreeze.title')}</Utils.Text>
              </Utils.LightButton>
            </Utils.View>
          </Utils.Content>
        </Utils.Container>
      </KeyboardScreen>
    )
  }
}

export default withContext(FreezeScene)
