import React, { Component } from 'react'
import {
  FlatList,
  RefreshControl
} from 'react-native'
import { Answers } from 'react-native-fabric'

import NavigationHeader from '../../components/Navigation/Header'
import Transaction from './Transaction'
import { Background } from './elements'

import Client from '../../services/client'
import getTransactionStore from '../../store/transactions'
import { withContext } from '../../store/context'

import Empty from './Empty'

const POOLING_TIME = 30000

class TransactionsScene extends Component {
  static navigationOptions = () => ({
    header: <NavigationHeader title='MY TRANSACTIONS' />
  })

  state = {
    refreshing: false,
    transactions: []
  }

  async componentDidMount () {
    Answers.logContentView('Tab', 'Transactions')
    const store = await getTransactionStore()
    this.setState({
      transactions: this.getSortedTransactionList(store)
    })
    this.updateData()
    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      this.updateData
    )
    this.dataSubscription = setInterval(this.updateData, POOLING_TIME)
  }

  componentWillUnmount () {
    this.didFocusSubscription.remove()
    clearInterval(this.dataSubscription)
  }

  getSortedTransactionList = store =>
    store
      .objects('Transaction')
      .sorted([['timestamp', true]])
      .map(item => Object.assign({}, item))

  _onRefresh = async () => {
    this.setState({ refreshing: true })
    await this.updateData()
    this.setState({ refreshing: false })
  }

  updateData = async () => {
    try {
      const response = await Client.getTransactionList(this.props.context.pin)
      const store = await getTransactionStore()
      store.write(() =>
        response.map(item => {
          const transaction = {
            id: item.hash,
            type: item.type,
            block: item.block,
            contractData: item.contractData,
            ownerAddress: item.ownerAddress,
            timestamp: item.timestamp,
            confirmed: true
          }
          if (item.type === 'Transfer') {
            transaction.id = item.transactionHash
            transaction.contractData = {
              transferFromAddress: item.transferFromAddress,
              transferToAddress: item.transferToAddress,
              amount: item.amount,
              tokenName: item.tokenName
            }
          }
          if (item.type === 'Create') {
            transaction.contractData = {
              ...transaction.contractData,
              tokenName: item.contractData.name,
              unityValue: item.contractData.trxNum
            }
          }
          if (item.type === 'Participate') {
            transaction.contractData = {
              ...transaction.contractData,
              transferFromAddress: item.contractData.toAddress,
              tokenName: item.contractData.token
            }
          }
          store.create('Transaction', transaction, true)
        })
      )
      const transactions = this.getSortedTransactionList(store)
      this.setState({
        transactions
      })
    } catch (err) {
      console.error(err)
    }
  }

  _navigateToDetails = (item) => {
    this.props.navigation.navigate('TransactionDetails', { item })
  }

  render () {
    const { transactions, refreshing } = this.state

    return (
      !transactions.length ? <Empty refreshing={refreshing} />
        : (
          <Background>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this._onRefresh}
                />
              }
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <Transaction item={item} onPress={() => this._navigateToDetails(item)} />}
            />
          </Background>
        )
    )
  }
}

export default withContext(TransactionsScene)
