import React, { Component } from 'react'
import {
  FlatList,
  RefreshControl
} from 'react-native'
import { Answers } from 'react-native-fabric'

import Transaction from './Transaction'
import { Background } from './elements'
import NavigationHeader from '../../components/Navigation/Header'

import getTransactionStore from '../../store/transactions'
import { withContext } from '../../store/context'
import { updateTransactions } from '../../utils/transactionUtils'

import Empty from './Empty'

const POOLING_TIME = 30000

class TransactionsScene extends Component {
  static navigationOptions = () => ({
    header: <NavigationHeader title='MY TRANSACTIONS' />
  })

  state = {
    refreshing: false,
    finishedLoadingTransactions: false,
    transactions: []
  }

  async componentDidMount () {
    Answers.logContentView('Tab', 'Transactions')
    const store = await getTransactionStore()
    this.setState({
      transactions: this._getSortedTransactionList(store), finishedLoadingTransactions: true
    })
    this.dataSubscription = setInterval(this._updateData, POOLING_TIME)
  }

  componentWillUnmount () {
    this.didFocusSubscription.remove()
    clearInterval(this.dataSubscription)
  }

  _getSortedTransactionList = store =>
    store
      .objects('Transaction')
      .sorted([['timestamp', true]])
      .map(item => Object.assign({}, item))

  _onRefresh = async () => {
    this.setState({ refreshing: true })
    await this._updateData()
    this.setState({ refreshing: false })
  }

  _updateData = async () => {
    try {
      await updateTransactions(this.props.context.pin)
      const store = await getTransactionStore()
      const transactions = this._getSortedTransactionList(store)
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
    const { transactions, refreshing, finishedLoadingTransactions } = this.state
    const publicKey = this.props.context.publicKey

    return (
      !transactions.length && finishedLoadingTransactions ? <Empty refreshing={refreshing} />
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
              renderItem={({ item }) => <Transaction item={item} onPress={() => this._navigateToDetails(item)} publicKey={publicKey.value} />}
            />
          </Background>
        )
    )
  }
}

export default withContext(TransactionsScene)
