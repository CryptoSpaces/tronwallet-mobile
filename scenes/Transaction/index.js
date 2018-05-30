import React, { Component } from 'react'
import { ActivityIndicator, NetInfo } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Utils from '../../components/Utils'
import { Colors, FontSize } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'
import Client from '../../src/services/client'
import Header from '../../components/Header'
import LoadingScene from '../../components/LoadingScene'
import moment from 'moment'

const firstLetterCapitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

class TransactionScene extends Component {
  state = {
    loadingData: true,
    loadingSubmit: false,
    transactionData: null,
    signedTransaction: null,
    success: null,
    submitError: null,
    submitted: false,
    isConnected: null
  }

  async componentDidMount () {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this._loadData()
    })
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._connectionEventListenner
    )
    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({ isConnected })
    })
  }

  componentWillUnmount () {
    this._navListener.remove()
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange
    )
  }

  _connectionEventListenner = isConnected => {
    this.setState({ isConnected }, () => {
      if (isConnected) {
        this._loadData()
      }
    })
  }

  _loadData = async () => {
    const { navigation } = this.props
    const { isConnected } = this.state

    this.setState({ loadingData: true }, () => {
      if (!isConnected) {
        this.setState({ loadingData: false })
      }
    })

    const signedTransaction = navigation.state.params.tx

    try {
      const transactionData = await Client.getTransactionDetails(
        signedTransaction
      )
      this.setState({ transactionData, signedTransaction })
    } catch (error) {
      this.setState({ submitError: error.message })
    } finally {
      this.setState({ loadingData: false })
    }
  }

  submitTransaction = async () => {
    const { signedTransaction } = this.state
    this.setState({ loadingSubmit: true })
    let error = null
    try {
      const { success, code } = await Client.submitTransaction(
        signedTransaction
      )
      if (!success) error = code

      this.setState({
        loadingSubmit: false,
        success,
        submitted: true,
        submitError: error
      })
    } catch (error) {
      this.setState({
        loadingSubmit: false,
        submitted: true,
        submitError: error.message
      })
    }
  }

  renderContracts = () => {
    const { transactionData } = this.state
    if (!transactionData) return

    const { contracts } = transactionData
    const contractsElements = []
    for (const ctr in contracts[0]) {
      if (ctr === 'amount') {
        contractsElements.push(
          <Utils.Row
            key={ctr}
            style={{ justifyContent: 'space-between', marginVertical: 5 }}
          >
            <Utils.Text secondary size='small'>
              {firstLetterCapitalize(ctr)}
            </Utils.Text>
            <Utils.Text size='xsmall'>{contracts[0][ctr] / 1000000}</Utils.Text>
          </Utils.Row>
        )
      } else if (ctr === 'votes') {
        const totalVotes = contracts[0][ctr].reduce((prev, curr) => {
          return prev + curr.voteCount
        }, 0)
        contractsElements.push(
          <Utils.Row
            key={'votes'}
            style={{ justifyContent: 'space-between', marginVertical: 5 }}
          >
            <Utils.Text secondary size='small'>
              TotalVotes
            </Utils.Text>
            <Utils.Text size='xsmall'>{totalVotes}</Utils.Text>
          </Utils.Row>
        )
      } else {
        contractsElements.push(
          <Utils.Row
            key={ctr}
            style={{ justifyContent: 'space-between', marginVertical: 5 }}
          >
            <Utils.Text secondary size='small'>
              {firstLetterCapitalize(ctr)}
            </Utils.Text>
            <Utils.Text size='xsmall'>{contracts[0][ctr]}</Utils.Text>
          </Utils.Row>
        )
      }
    }
    contractsElements.push(
      <Utils.Row
        style={{ justifyContent: 'space-between', marginVertical: 5 }}
        key={'timestamp'}
      >
        <Utils.Text secondary size='small'>
          Time
        </Utils.Text>
        <Utils.Text size='xsmall'>
          {moment(transactionData.timestamp).format('MM/DD/YYYY HH:MM:SS')}
        </Utils.Text>
      </Utils.Row>
    )

    return <Utils.Content>{contractsElements}</Utils.Content>
  }

  renderSubmitionView = () => {
    const { loadingSubmit, submitted, success } = this.state
    if (!submitted) {
      return (
        <Utils.Content align='center' justify='center'>
          {loadingSubmit ? (
            <ActivityIndicator size='small' color={Colors.yellow} />
          ) : (
            <ButtonGradient
              text='Submit Transaction'
              onPress={this.submitTransaction}
            />
          )}
        </Utils.Content>
      )
    }
    if (success) {
      return (
        <Utils.Content align='center' justify='center'>
          <Ionicons
            style={{ marginVertical: 5 }}
            name='md-checkmark-circle-outline'
            size={FontSize['large']}
            color={Colors.green}
          />
          <Utils.Text success size='small'>
            Transaction submitted to network !
          </Utils.Text>
        </Utils.Content>
      )
    }
  }

  renderRetryConnection = () => (
    <Utils.Content align='center' justify='center'>
      <Utils.Text size='small'>
        It seems that you are disconnected Reconnect to the internet before
        proceduring with the transaction
      </Utils.Text>
      <Utils.VerticalSpacer size='large' />
      <ButtonGradient text='Try again' onPress={this._loadData} />
    </Utils.Content>
  )

  render () {
    const { submitError, loadingData, isConnected } = this.state

    if (loadingData) return <LoadingScene />

    return (
      <Utils.Container>
        <Utils.StatusBar transparent />
        <Header
          onLeftPress={() => this.props.navigation.navigate('Home')}
          leftIcon={
            <Ionicons name='ios-close' color={Colors.primaryText} size={40} />
          }
        >
          <Utils.View align='center'>
            <Utils.Text size='medium'>Transaction Details</Utils.Text>
          </Utils.View>
        </Header>
        {!isConnected && this.renderRetryConnection()}
        {isConnected && this.renderContracts()}
        {isConnected && this.renderSubmitionView()}
        <Utils.Content align='center' justify='center'>
          {submitError && (
            <Utils.Error>Transaction Failed: {submitError}</Utils.Error>
          )}
        </Utils.Content>
      </Utils.Container>
    )
  }
}
export default TransactionScene
