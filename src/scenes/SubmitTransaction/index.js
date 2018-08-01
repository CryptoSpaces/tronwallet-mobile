import React, { Component } from 'react'
import { ActivityIndicator, NetInfo, ScrollView } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import moment from 'moment'
import { NavigationActions, StackActions } from 'react-navigation'
import { Answers } from 'react-native-fabric'
import OneSignal from 'react-native-onesignal'

// Design
import * as Utils from '../../components/Utils'
import { Colors, FontSize } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'
import DetailRow from './detailRow'
import LoadingScene from '../../components/LoadingScene'
import NavigationHeader from '../../components/Navigation/Header'

// Service
import Client from '../../services/client'
import getTransactionStore from '../../store/transactions'
import getBalanceStore from '../../store/balance'
import { withContext } from '../../store/context'
import buildTransactionDetails, { translateError } from './detailMap'

const ANSWERS_TRANSACTIONS = ['Transfer', 'Vote', 'Participate', 'Freeze']
const NOTIFICATION_TRANSACTIONS = ['Transfer', 'Transfer Asset']

class TransactionDetail extends Component {
  state = {
    loadingData: true,
    loadingSubmit: false,
    transactionData: null,
    signedTransaction: null,
    success: null,
    submitError: null,
    submitted: false,
    isConnected: null,
    nowDate: moment().format('MM/DD/YYYY HH:MM:SS')
  }

  componentDidMount () {
    this._navListener = this.props.navigation.addListener('didFocus', this._loadData)
  }

  componentWillUnmount () {
    this._navListener.remove()
    if (this.closeTransactionDetails) clearTimeout(this.closeTransactionDetails)
  }

  _loadData = async () => {
    const { navigation } = this.props

    const signedTransaction = navigation.state.params.tx
    const connection = await NetInfo.getConnectionInfo()
    const isConnected = !(connection.type === 'none')

    this.setState({ isConnected })

    if (!isConnected) {
      this.setState({ loadingData: false })
      return
    }

    try {
      const transactionData = await Client.getTransactionDetails(signedTransaction)
      this.setState({ transactionData, signedTransaction })
    } catch (error) {
      this.setState({ submitError: error.message })
    } finally {
      this.setState({ loadingData: false })
    }
  }

  _navigateNext = () => {
    // Reset navigation as transaction submition is the last step of a user interaction
    const { submitted } = this.state
    const { navigation } = this.props
    const transaction = this._getTransactionObject()
    const stackToReset = this._getStackToReset(transaction.type)
    if (submitted) {
      const resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: 'App' }),
          NavigationActions.navigate({ routeName: stackToReset })
        ]
      })
      const navigateToHome = NavigationActions.navigate({ routeName: 'Transactions' })
      if (stackToReset) {
        navigation.dispatch(resetAction)
      }
      navigation.dispatch(navigateToHome)
    } else {
      navigation.goBack()
    }
  }

  _getTransactionObject = () => {
    const {
      transactionData: { hash, contracts }
    } = this.state

    const type = Client.getContractType(contracts[0].contractTypeId)
    const transaction = {
      id: hash,
      type,
      contractData: {
        transferFromAddress: contracts[0].from || contracts[0].ownerAddress,
        transferToAddress: contracts[0].to,
        tokenName: type === 'Transfer' ? 'TRX' : contracts[0].token
      },
      ownerAddress: contracts[0].from || contracts[0].ownerAddress,
      timestamp: Date.now(),
      confirmed: false
    }

    switch (type) {
      case 'Freeze':
        transaction.contractData.frozenBalance = contracts[0].frozenBalance
        break
      case 'Vote':
        transaction.contractData.votes = contracts[0].votes
        break
      default:
        transaction.contractData.amount = contracts[0].amount
        break
    }
    return transaction
  }

  _submitTransaction = async () => {
    const {
      signedTransaction,
      transactionData: { hash }
    } = this.state
    this.setState({ loadingSubmit: true, submitError: null })
    const store = await getTransactionStore()
    const transaction = this._getTransactionObject()

    try {
      let success = false
      store.write(() => { store.create('Transaction', transaction, true) })
      const { code } = await Client.broadcastTransaction(signedTransaction)

      if (code === 'SUCCESS') {
        success = true
        if (ANSWERS_TRANSACTIONS.includes(transaction.type)) {
          Answers.logCustom('Transaction Operation', { type: transaction.type })
        }
        if (NOTIFICATION_TRANSACTIONS.includes(transaction.type)) {
          // if the receiver is a tronwallet user we'll find his devices here
          const response = await Client.getDevicesFromPublicKey(transaction.contractData.transferToAddress)
          if (response.data.users.length) {
            const content = {
              'en': `You have received a transaction from ${transaction.contractData.transferFromAddress}`
            }
            response.data.users.map(device => {
              OneSignal.postNotification(content, transaction, device.deviceid)
            })
          }
        }
        await this._updateBalancesStore()
      }

      this.setState({
        success,
        submitError: null
      })
    } catch (error) {
      this.setState({
        submitError: translateError(error.message)
      })
      store.write(() => {
        const lastTransaction = store.objectForPrimaryKey('Transaction', hash)
        store.delete(lastTransaction)
      })
    } finally {
      this.setState({
        loadingSubmit: false,
        submitted: true
      })
    }
  }

  _getStackToReset = (transactionType) => {
    if (transactionType === 'Transfer Asset' || transactionType === 'Transfer' ||
      transactionType === 'Freeze' || transactionType === 'Unfreeze') {
      return 'BalanceScene'
    }
    if (transactionType === 'Participate') {
      return 'ParticipateHome'
    }

    return null
  }

  _updateBalancesStore = async balances => {
    try {
      const balances = await Client.getBalances(this.props.context.pin)
      const store = await getBalanceStore()
      store.write(() => balances.map(item => store.create('Balance', item, true)))
    } catch (error) {
      console.log('Error while updating User balance')
    }
  }

  renderContracts = () => {
    const { transactionData, nowDate } = this.state
    if (!transactionData) return
    const { contracts } = transactionData
    const contractsElements = buildTransactionDetails(contracts)
    contractsElements.push(
      <DetailRow
        key={'TIME'}
        title={'TIME'}
        text={nowDate}
      />
    )
    return <Utils.View paddingX={'medium'} paddingY={'small'}>{contractsElements}</Utils.View>
  }

  renderSubmitButton = () => {
    const { loadingSubmit, success } = this.state
    if (success) {
      return (
        <Utils.Content align='center' justify='center'>
          <Feather
            style={{ marginVertical: 5 }}
            name='check-circle'
            size={FontSize['large']}
            color={Colors.green}
          />
          <Utils.Text success size='small'>
            Transaction submitted to network.
          </Utils.Text>
        </Utils.Content>
      )
    }

    return (
      <Utils.View marginTop={5} paddingX={'medium'}>
        {loadingSubmit ? (
          <ActivityIndicator size='small' color={Colors.primaryText} />
        ) : (
          <ButtonGradient
            text='SUBMIT TRANSACTION'
            onPress={() => this.props.navigation.navigate('Pin', {
              shouldGoBack: true,
              testInput: pin => pin === this.props.context.pin,
              onSuccess: this._submitTransaction
            })}
            font='bold'
          />
        )}
      </Utils.View>
    )
  }

  renderRetryConnection = () => (
    <Utils.Content align='center' justify='center'>
      <Utils.Text size='small'>
        It seems that you are disconnected. Reconnect to the internet before
        proceeding with the transaction.
      </Utils.Text>
      <Utils.VerticalSpacer size='large' />
      <ButtonGradient text='Try again' onPress={this._loadData} size='small' />
    </Utils.Content>
  )

  render () {
    const { submitError, loadingData, isConnected } = this.state

    if (loadingData) return <LoadingScene />

    return (
      <React.Fragment>
        <NavigationHeader
          title='TRANSACTION DETAILS'
          onClose={this._navigateNext}
        />
        <Utils.Container>
          <ScrollView>
            {!isConnected && this.renderRetryConnection()}
            {isConnected && this.renderContracts()}
            {isConnected && this.renderSubmitButton()}
            <Utils.Content align='center' justify='center'>
              {submitError && (
                <Utils.Error>{submitError}</Utils.Error>
              )}
            </Utils.Content>
          </ScrollView>
        </Utils.Container>
      </React.Fragment>
    )
  }
}
export default withContext(TransactionDetail)
