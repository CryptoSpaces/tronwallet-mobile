import React, { Component } from 'react'
import { SafeAreaView, FlatList, StyleSheet, RefreshControl, Image } from 'react-native'

import * as Utils from '../../components/Utils'
import { Spacing, Colors } from './../../components/DesignSystem'
import Client from '../../src/services/client'
import LoadingScene from '../../components/LoadingScene'
import TransferCard from './Transfer'
import ParticipateCard from './Participate'
import VoteCard from './Vote'
import FreezeCard from './Freeze'
import Default from './Default'

// const firstLetterCapitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

class TransactionsScene extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <SafeAreaView style={{ backgroundColor: 'black' }}>
          <Utils.Header>
            <Utils.TitleWrapper>
              <Utils.Title>My Transactions</Utils.Title>
            </Utils.TitleWrapper>
          </Utils.Header>
        </SafeAreaView>
      )
    }
  }

  state = {
    firstLoading: true,
    transactions: []
  }

  componentDidMount () {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this.loadData()
    })
  }

  componentWillUnmount () {
    this._navListener.remove()
  }

  loadData = async () => {
    this.setState({ refreshing: true })
    try {
      const transactions = await Client.getTransactionList()
      this.setState({ firstLoading: false, refreshing: false, transactions })
    } catch (error) {
      this.setState({ firstLoading: false, refreshing: false })
    }
  }

  renderCard = (item, index) => {
    switch (item.type) {
      case 'Transfer': return <TransferCard item={item} />
      case 'Freeze': return <FreezeCard item={item} />
      case 'Vote': return <VoteCard item={item} />
      case 'Participate': return <ParticipateCard item={item} />
      default: return <Default item={item} />
    }
  }

  renderListEmptyComponent = () => <Utils.Container />

  render () {
    const { firstLoading, refreshing, transactions } = this.state

    if (firstLoading) {
      return <LoadingScene />
    }

    if (transactions.length === 0) {
      return (
        <Utils.View style={{ backgroundColor: Colors.background }} flex={1} justify='center' align='center'>
          <Image
            source={require('../../assets/empty.png')}
            resizeMode='contain'
            style={{ width: '60%' }}
          />
          <Utils.VerticalSpacer size='medium' />
          <Utils.Text secondary font='light' size='small'>No transactions found.</Utils.Text>
        </Utils.View>
      )
    }

    return <Utils.Container>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.loadData}
          />
        }
        contentContainerStyle={styles.list}
        data={transactions}
        keyExtractor={item => item.hash || item.transactionHash}
        renderItem={({ item, index }) => this.renderCard(item, index)}
        ItemSeparatorComponent={() => <Utils.VerticalSpacer size='medium' />}
        ListEmptyComponent={this.renderListEmptyComponent}
      />
    </Utils.Container>
  }
}

const styles = StyleSheet.create({
  list: {
    padding: Spacing.medium
  }
})
export default TransactionsScene
