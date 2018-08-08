import React, { Component } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { Answers } from 'react-native-fabric'

import tl from '../../utils/i18n'
import Transaction from './Transaction'
import { Background } from './elements'
import NavigationHeader from '../../components/Navigation/Header'

import getAssetsStore from '../../store/assets'
import getTransactionStore from '../../store/transactions'
import { withContext } from '../../store/context'
import { updateTransactions } from '../../utils/transactionUtils'

import Empty from './Empty'
import { ONE_TRX } from '../../services/client'

const POOLING_TIME = 30000

class TransactionsScene extends Component {
  static navigationOptions = () => ({
    header: <NavigationHeader title={tl.t('transactions.title')} />
  })

  state = {
    loading: true,
    refreshing: false,
    transactions: []
  }

  async componentDidMount () {
    Answers.logContentView('Tab', 'Transactions')
    const transactionStore = await getTransactionStore()
    const cachedTransactions = this._getSortedTransactionList(transactionStore)
    if (!cachedTransactions.length) {
      this.setState({
        transactions: []
      })
    } else {
      const assetStore = await getAssetsStore()
      const updatedTransactions = this._updateParticipateTransactions(cachedTransactions, assetStore)
      this.setState({
        transactions: updatedTransactions,
        loading: false
      })
    }

    this._onRefresh()
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
      const transactionStore = await getTransactionStore()
      const transactions = this._getSortedTransactionList(transactionStore)
      const assetStore = await getAssetsStore()
      const updatedTransactions = this._updateParticipateTransactions(transactions, assetStore)
      this.setState({
        transactions: updatedTransactions,
        loading: false
      })
    } catch (err) {
      console.error(err)
      this.setState({
        loading: false
      })
    }
  }

  _updateParticipateTransactions = (transactions, assetStore) => (
    transactions.map((transaction) => {
      if (transaction.type === 'Participate') {
        const tokenPrice = this._getTokenPriceFromStore(transaction.contractData.tokenName, assetStore)
        return { ...transaction, tokenPrice }
      } else {
        return transaction
      }
    })
  )

  _getTokenPriceFromStore = (tokenName, assetStore) => {
    const filtered = assetStore
      .objects('Asset')
      .filtered(
        `name == '${tokenName}'`
      )
      .map(item => Object.assign({}, item))

    if (filtered.length) {
      return filtered[0].price
    }

    return ONE_TRX
  }

  _navigateToDetails = (item) => {
    this.props.navigation.navigate('TransactionDetails', { item })
  }

  render () {
    const { transactions, loading } = this.state
    const publicKey = this.props.context.publicKey

    return (
      !transactions.length ? <Empty loading={loading} />
        : (
          <Background>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={loading}
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
