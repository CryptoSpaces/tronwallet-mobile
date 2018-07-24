import React, { Component } from 'react'

import {
  FlatList,
  RefreshControl,
  Image,
  ActivityIndicator
} from 'react-native'

import { Answers } from 'react-native-fabric'
import * as Utils from '../../components/Utils'
import { Spacing, Colors } from '../../components/DesignSystem'
import NavigationHeader from '../../components/Navigation/Header'
import TransferCard from './Transfer'
import ParticipateCard from './Participate'
import CreateCard from './Create'
import VoteCard from './Vote'
import FreezeCard from './Freeze'
import UnfreezeCard from './Unfreeze'
import Default from './Default'

import Client from '../../services/client'
import getTransactionStore from '../../store/transactions'
import { withContext } from '../../store/context'

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
              transferFromAddress: item.contractData.toAddress
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

  renderCard = item => {
    switch (item.type) {
      case 'Transfer':
        return <TransferCard item={item} onPress={() => this._navigateToDetails(item)} />
      case 'Freeze':
        return <FreezeCard item={item} onPress={() => this._navigateToDetails(item)} />
      case 'Unfreeze':
        return <UnfreezeCard item={item} onPress={() => this._navigateToDetails(item)} />
      case 'Vote':
        return <VoteCard item={item} onPress={() => this._navigateToDetails(item)} />
      case 'Participate':
        return <ParticipateCard item={item} onPress={() => this._navigateToDetails(item)} />
      case 'Create':
        return <CreateCard item={item} onPress={() => this._navigateToDetails(item)} />
      default:
        return <Default item={item} onPress={() => this._navigateToDetails(item)} />
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
              onRefresh={this._onRefresh}
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

export default withContext(TransactionsScene)
