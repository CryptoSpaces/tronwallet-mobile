import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Utils from '../../components/Utils'
import { Colors, FontSize } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'
import Client from '../../src/services/client'
import Header from '../../components/Header'
import moment from 'moment'

class TransactionScene extends Component {
  state = {
    loadingData: true,
    loadingSubmit: false,
    transactionData: null,
    signedTransaction: null,
    success: null,
    submitError: null
  }
  componentDidMount () {
    this.loadData()
  }

  loadData = async () => {
    const { navigation } = this.props
    const signedTransaction = navigation.state.params.tx
    try {
      const transactionData = await Client.getTransactionDetails(signedTransaction)
      this.setState({ transactionData, signedTransaction })
    } catch (error) {
      console.log(error.message)
      alert('Something wrong getting transaction details')
    } finally {
      this.setState({ loadingData: false })
    }
  }

  submitTransaction = async () => {
    const { signedTransaction } = this.state
    this.setState({ loadingSubmit: true })
    try {
      const { success, code } = await Client.submitTransaction(signedTransaction)
      this.setState({ loadingSubmit: false, success, submitError: !success && code })
    } catch (error) {
      this.setState({ loadingSubmit: false, submitError: error.message })
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
          <Utils.Row key={ctr} style={{ justifyContent: 'space-between', marginVertical: 5 }}>
            <Utils.Text secondary size='small'>{ctr}</Utils.Text>
            <Utils.Text size='xsmall'>{contracts[0][ctr] / 1000000}</Utils.Text>
          </Utils.Row>
        )
      } else if (ctr === 'votes') {
        const totalVotes = contracts[0][ctr].reduce((prev, curr) => {
          return (prev + curr.voteCount)
        }, 0)
        contractsElements.push(
          <Utils.Row key={'votes'} style={{ justifyContent: 'space-between', marginVertical: 5 }}>
            <Utils.Text secondary size='small'>TotalVotes</Utils.Text>
            <Utils.Text size='xsmall'>{totalVotes}</Utils.Text>
          </Utils.Row>
        )
      } else {
        contractsElements.push(
          <Utils.Row key={ctr} style={{ justifyContent: 'space-between', marginVertical: 5 }}>
            <Utils.Text secondary size='small'>{ctr}</Utils.Text>
            <Utils.Text size='xsmall'>{contracts[0][ctr]}</Utils.Text>
          </Utils.Row>
        )
      }
    }
    contractsElements.push(
      <Utils.Row style={{ justifyContent: 'space-between', marginVertical: 5 }} key={'timestamp'} >
        <Utils.Text secondary size='small'>Time</Utils.Text>
        <Utils.Text size='xsmall'>{moment(transactionData.timestamp).format('MM/DD/YYYY HH:MM:SS')}</Utils.Text>
      </Utils.Row >)
    return contractsElements
  }

  renderBeforeSubmit = () => {
    const { loadingSubmit } = this.state
    return (
      <Utils.Content align='center' justify='center'>
        {loadingSubmit ? <ActivityIndicator size='small' color={Colors.yellow} />
          : <ButtonGradient text='Submit Transaction' onPress={this.submitTransaction} />}
      </Utils.Content>
    )
  }
  renderSuccess = () => (
    <Utils.Content align='center' justify='center'>
      <Ionicons style={{ marginVertical: 5 }} name='md-checkmark-circle-outline' size={FontSize['large']} color={Colors.green} />
      <Utils.Text success size='small'>Transaction submitted to network !</Utils.Text>
    </Utils.Content>
  )

  render () {
    const { success, submitError, loadingData } = this.state

    if (loadingData) {
      return (<Utils.Container>
        <Utils.Content>
          <ActivityIndicator size='large' color={Colors.yellow} />
        </Utils.Content>
      </Utils.Container>)
    }
    return (
      <Utils.Container>
        <Utils.StatusBar transparent />
        <Header
          onLeftPress={() => this.props.navigation.navigate('Balance')}
          leftIcon={<Ionicons name='ios-close' color={Colors.primaryText} size={40} />}
        >
          <Utils.View align='center'>
            <Utils.Text size='medium'>Transaction Details</Utils.Text>
          </Utils.View>
        </Header>
        <Utils.Content>
          {this.renderContracts()}
        </Utils.Content>
        {success ? this.renderSuccess() : this.renderBeforeSubmit()}
        <Utils.Content align='center' justify='center'>
          {submitError && <Utils.Error>{submitError}</Utils.Error>}
        </Utils.Content>
      </Utils.Container>
    )
  }
}
export default TransactionScene
