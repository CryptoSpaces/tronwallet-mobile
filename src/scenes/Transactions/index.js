import React, { Component } from 'react'
import {
  FlatList,
  RefreshControl,
  Image,
  ActivityIndicator
} from 'react-native'

import * as Utils from '../../components/Utils'
import { Spacing, Colors } from '../../components/DesignSystem'
import Client from '../../services/client'
import TransferCard from './Transfer'
import ParticipateCard from './Participate'
import VoteCard from './Vote'
import FreezeCard from './Freeze'
import Default from './Default'
import NavigationHeader from '../../components/Navigation/NavigationHeader'

import getTransactionStore from '../../store/transactions'

const POOLING_TIME = 30000

class TransactionsScene extends Component {
  static navigationOptions = () => {
    return {
      header: <NavigationHeader title='My Transactions' />
    }
  }

  state = {
    refreshing: true,
    transactions: []
  }

  async componentDidMount () {
    const store = await getTransactionStore()
    this.setState({
      transactions: this.getSortedTransactionList(store),
      refreshing: false
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

  updateData = async () => {
    try {
      this.setState({ refreshing: true })
      const response = await Client.getTransactionList()
      const store = await getTransactionStore()
      store.write(() =>
        response.map(item => {
          const transaction = {
            id: item.hash,
            type: item.type,
            contractData: item.contractData,
            ownerAddress: item.ownerAddress,
            timestamp: item.timestamp
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
          store.create('Transaction', transaction, true)
        })
      )
      const transactions = this.getSortedTransactionList(store)
      this.setState({
        refreshing: false,
        transactions
      })
    } catch (err) {
      console.error(err)
    }
  }

  renderCard = item => {
    switch (item.type) {
      case 'Transfer':
        return <TransferCard item={item} />
      case 'Freeze':
        return <FreezeCard item={item} />
      case 'Vote':
        return <VoteCard item={item} />
      case 'Participate':
        return <ParticipateCard item={item} />
      default:
        return <Default item={item} />
    }
  }

  renderListEmptyComponent = () => <Utils.Container />

  render () {
    const { transactions, refreshing } = this.state

    if (transactions.length === 0) {
      return (
        <Utils.View
          style={{ backgroundColor: Colors.background }}
          flex={1}
          justify='center'
          align='center'
        >
          <Image
            source={require('../../assets/empty.png')}
            resizeMode='contain'
            style={{ width: '60%' }}
          />
          <Utils.VerticalSpacer size='medium' />
          {refreshing ? (
            <ActivityIndicator size='small' color='#ffffff' />
          ) : (
            <Utils.Text secondary font='light' size='small'>
              No transactions found.
            </Utils.Text>
          )}
        </Utils.View>
      )
    }

    return (
      <Utils.Container>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.updateData}
            />
          }
          contentContainerStyle={{ padding: Spacing.medium }}
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => this.renderCard(item)}
          ItemSeparatorComponent={() => <Utils.VerticalSpacer size='medium' />}
          ListEmptyComponent={this.renderListEmptyComponent}
        />
      </Utils.Container>
    )
  }
}

export default TransactionsScene
