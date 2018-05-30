import React, { Component } from 'react'
import { LineChart } from 'react-native-svg-charts'
import { tint } from 'polished'
import { FlatList, Image } from 'react-native'
import axios from 'axios'

import Gradient from '../../components/Gradient'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import Header from '../../components/Header'
import Client from '../../src/services/client'
import LoadingScene from '../../components/LoadingScene'
import ButtonGradient from '../../components/ButtonGradient'
import formatAmount from '../../utils/formatnumber'

class BalanceScene extends Component {
  state = {
    loading: true,
    error: null,
    assetBalance: [],
    trxBalance: 0,
    trxPrice: 0
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
      const assetBalance = balances.filter(b => b.name !== 'TRX')
      const { data: { data } } = await axios.get(
        'https://api.coinmarketcap.com/v2/ticker/1958'
      )

      this.setState({
        trxBalance: trxBalance.balance,
        assetBalance,
        loading: false,
        trxPrice: data.quotes.USD.price
      })
    } catch (error) {
      this.setState({ error: error.message, loading: false })
    }
  }

  renderTokens = ({ item }) => {
    const { assetBalance } = this.state
    if (!assetBalance.length) return

    return (
      <Utils.Row align='center' justify='space-between'>
        <Utils.Label color={tint(0.9, Colors.background)}>
          <Utils.Text>{item.name}</Utils.Text>
        </Utils.Label>
        <Utils.Text>{`${formatAmount(item.balance)}`}</Utils.Text>
      </Utils.Row>
    )
  }

  render () {
    const { navigation } = this.props
    const { assetBalance, trxBalance, loading, trxPrice, error } = this.state

    if (loading) return <LoadingScene />

    return (
      <Utils.Container>
        <Utils.StatusBar />
          <Utils.VerticalSpacer size='large' />
          <Utils.Row justify='center'>
          <Utils.View align='center'>
            <Image
              source={require('../../assets/tron-logo-small.png')}
              resizeMode='contain'
              style={{ height: 60 }}
            />
            <Utils.VerticalSpacer size='medium' />
            <Utils.Text secondary>BALANCE</Utils.Text>
            <Utils.Text size='medium'>{formatAmount(trxBalance)} TRX</Utils.Text>
          </Utils.View>             
          </Utils.Row>     
        <Utils.Content>
          <Utils.Content>
            <LineChart
              style={{ height: 30 }}
              data={[
                50,
                10,
                40,
                95,
                -4,
                -24,
                85,
                91,
                35,
                53,
                -53,
                24,
                50,
                -20,
                -80
              ]}
              svg={{ stroke: 'url(#gradient)', strokeWidth: 3 }}
              animate
            >
              <Gradient />
            </LineChart>
          </Utils.Content>
          <Utils.Text size='small' secondary>
            TRX PRICE: $ {trxPrice}
          </Utils.Text>
          <Utils.VerticalSpacer size='medium' />
          {assetBalance.length ? (
            <FlatList
              data={assetBalance}
              renderItem={this.renderTokens}
              keyExtractor={item => item.name}
              ItemSeparatorComponent={() => (
                <Utils.VerticalSpacer size='large' />
              )}
              scrollEnabled={false}
            />
          ) : (
            <Utils.View align='center'>
              <Utils.VerticalSpacer size='big' />
              <Utils.VerticalSpacer size='big' />
              <Image
                source={require('../../assets/empty.png')}
                resizeMode='contain'
                style={{ height: 90 }}
              />
              <Utils.VerticalSpacer size='large' />
              <Utils.Text size='xsmall' secondary onPress={() => navigation.navigate('Tokens')}>
                CLICK HERE TO PARTICIPATE ON TRON TOKENS
              </Utils.Text>
            </Utils.View>
          )}
          <Utils.Error>{error}</Utils.Error>
        </Utils.Content>
      </Utils.Container>
    )
  }
}

export default BalanceScene
