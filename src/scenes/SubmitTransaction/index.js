import React, { Component } from 'react'
import { ActivityIndicator, NetInfo, ScrollView } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import moment from 'moment'
import { NavigationActions } from 'react-navigation'
import { Answers } from 'react-native-fabric'
// Design
import * as Utils from '../../components/Utils'
import { Colors, FontSize } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'
import DetailRow from './detailRow'
import LoadingScene from '../../components/LoadingScene'
import NavigationHeader from '../../components/Navigation/Header'

// Service
import Client from '../../services/client'
import buildTransactionDetails, { translateError } from './detailMap'
import getTransactionStore from '../../store/transactions'
import { withContext } from '../../store/context'

const CLOSE_SCREEN_TIME = 5000
const ANSWERS_TRANSACTIONS = ['Transfer', 'Vote', 'Participate', 'Freeze']

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
    this.props.navigation.setParams({ 'onClose': this._navigateNext })
    this._navListener = this.props.navigation.addListener('didFocus', this._loadData)
  }

  componentWillUnmount () {
    this._navListener.remove()
    if (this.closeTransactionDetails) clearTimeout(this.closeTransactionDetails)
  }

  _loadData = async () => {
    const { navigation } = this.props

    this.setState({ loadingData: true })

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
    const { navigation } = this.props
    const navigateToHome = NavigationActions.navigate({ routeName: 'Transactions' })
    navigation.dispatch(navigateToHome)
  }

  _getTokenNameFromTx = (type, token) => {
    switch (type) {
      case 1:
        return 'TRX'
      case 9:
        return token
      default:
        return null
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
        tokenName: this._getTokenNameFromTx(contracts[0].contractTypeId, contracts[0].token)
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
        this.closeTransactionDetails = setTimeout(this._navigateNext, CLOSE_SCREEN_TIME)
      }

      this.setState({
        loadingSubmit: false,
        success,
        submitted: true,
        submitError: null
      })
    } catch (error) {
      this.setState({
        loadingSubmit: false,
        submitted: true,
        submitError: translateError(error.message)
      })
      store.write(() => {
        const lastTransaction = store.objectForPrimaryKey('Transaction', hash)
        store.delete(lastTransaction)
      })
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
          onClose={this.props.navigation.getParam('onClose')}
          onBack={() => this.props.navigation.goBack()}
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
