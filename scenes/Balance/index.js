import React, { Component } from 'react'
import { Ionicons, Feather } from '@expo/vector-icons'
import { LineChart } from 'react-native-svg-charts'
import { tint } from 'polished'
import { FlatList, ActivityIndicator } from 'react-native'

import Gradient from '../../components/Gradient'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import Header from '../../components/Header'
import Client from '../../src/services/client'

import formatAmount from '../../utils/formatnumber'

class BalanceScene extends Component {
  state = {
    balances: [],
    loading: false,
    error: null,
    trxBalance: 0
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
    this.setState({ loading: true })
    try {
      const balances = await Client.getBalances()
      const trxBalance = balances.find(b => b.name === 'TRX')
      this.setState({ trxBalance: trxBalance.balance, balances, loading: false })
    } catch (error) {
      this.setState({ error: error.message, loading: false })
    }
  }

  renderTokens = ({ item }) => {
    const { balances } = this.state
    if (!balances.length) return

    return (<Utils.Row align='center' justify='space-between'>
      <Utils.Label color={tint(0.9, Colors.background)}>
        <Utils.Text>{item.name}</Utils.Text>
      </Utils.Label>
      <Utils.Text>{`${formatAmount(item.balance)}`}</Utils.Text>
    </Utils.Row>)
  }

  render () {
    const { balances, trxBalance, loading } = this.state

    if (loading) {
      return <Utils.View style={{ backgroundColor: Colors.background }} flex={1} justify='center' align='center'>
        <ActivityIndicator size='large' color={Colors.primaryText} />
      </Utils.View>
    }
    return (
      <Utils.Container>
        <Utils.StatusBar />
        <Header
          onLeftPress={() => { }}
          leftIcon={<Ionicons name='ios-menu' color={Colors.primaryText} size={24} />}
          onRightPress={() => this.props.navigation.navigate('Send')}
          rightIcon={<Feather name='plus' color={Colors.primaryText} size={24} />}
        >
          <Utils.View align='center'>
            <Utils.Text size='xsmall' secondary>BALANCE</Utils.Text>
            <Utils.Text size='medium'>{formatAmount(trxBalance)} TRX</Utils.Text>
          </Utils.View>
        </Header>
        <Utils.Content>
          <Utils.Content>
            <LineChart
              style={{ height: 30 }}
              data={[50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]}
              svg={{ stroke: 'url(#gradient)', strokeWidth: 3 }}
              animate
            >
              <Gradient />
            </LineChart>
          </Utils.Content>
          <Utils.VerticalSpacer size='medium' />
          <FlatList
            data={balances}
            renderItem={this.renderTokens}
            keyExtractor={item => item.name}
            ItemSeparatorComponent={() => <Utils.VerticalSpacer size='large' />}
            scrollEnabled={false}
          />
        </Utils.Content>
      </Utils.Container>
    )
  }
}

export default BalanceScene
