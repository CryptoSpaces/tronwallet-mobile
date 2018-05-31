import React, { Component } from 'react'
import { SafeAreaView, FlatList, StyleSheet, RefreshControl } from 'react-native'

import * as Utils from '../../components/Utils'
import { Spacing } from './../../components/DesignSystem'
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
    const { firstLoading, refreshing } = this.state
    if (firstLoading) {
      return <LoadingScene />
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
        data={this.state.transactions}
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
