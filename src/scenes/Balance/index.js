import React, { Component } from 'react'
import moment from 'moment'
import axios from 'axios'
import { LineChart } from 'react-native-svg-charts'
import { FlatList, Image, ScrollView, View, ActivityIndicator, RefreshControl } from 'react-native'
import { ListItem } from 'react-native-elements'
import { Motion, spring, presets } from 'react-motion'

import Client from '../../services/client'
import Gradient from '../../components/Gradient'
import formatAmount from '../../utils/formatNumber'
import ButtonGradient from '../../components/ButtonGradient'
import FadeIn from '../../components/Animations/FadeIn'
import GrowIn from '../../components/Animations/GrowIn'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'

import BalanceStore from '../../store/balance'
import AssetsStore from '../../store/assets'

const PRICE_PRECISION = 7

class BalanceScene extends Component {
  state = {
    error: null,
    assetBalance:
      BalanceStore
        .objects('Balance')
        .map(item => Object.assign({}, item)),
    assetList: 
      AssetsStore
        .objects('Asset')
        .filtered(`percentage < 100 AND startTime < ${new Date().getTime()} AND endTime > ${new Date().getTime()}`)
        .map(item => Object.assign({}, item)),
    trxBalance: 0,
    trxPrice: null,
    refreshing: false
  }

  componentDidMount () {
    this.loadData()
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true })
    await this.loadData()
    this.setState({ refreshing: false })
  }

  loadData = async () => {
    try {
      const getData = await Promise.all([
        Client.getBalances(),
        Client.getTokenList(),
        axios.get( 'https://api.coinmarketcap.com/v2/ticker/1958')
      ])
      const balances = getData[0]
      const tokenList = getData[1]
      const { data: { data } } = getData[2]
      await BalanceStore.write(() => balances.map(item => BalanceStore.create('Balance', item, true)))
      await AssetsStore.write(() => tokenList.map(item => AssetsStore.create('Asset', item, true)))
      const assetBalance = BalanceStore
        .objects('Balance')
        .map(item => Object.assign({}, item))
      const assetList = AssetsStore
        .objects('Asset')
        .filtered(`percentage < 100 AND startTime < ${new Date().getTime()} AND endTime > ${new Date().getTime()}`)
        .map(item => Object.assign({}, item))
      this.setState({
        trxPrice: data.quotes.USD.price,
        trxBalance: balances[0].balance,
        assetBalance,
        assetList
      })
    } catch (error) {
      this.setState({ error: error.message })
    }
  }

  navigateToParticipate = token => {
    const { trxBalance } = this.state;
    if (token.name !== 'TRX') {
      this.props.navigation.navigate('Participate', { token, trxBalance })
    }
  }

  listHeader = text => (
    <Utils.View align='flex-start'>
      <Utils.Text size='small' color={Colors.secondaryText}>{text}</Utils.Text>
      <Utils.VerticalSpacer size='medium' />
    </Utils.View>
  )

  renderParticipateButton = item => {
    const now = moment()
    if (item.percentage >= 100 || moment(item.startTime).isAfter(now) || moment(item.endTime).isBefore(now)) {
      return (
        <View style={{ justifyContent: 'center', paddingHorizontal: 12 }}>
          <Utils.Text color={Colors.red}>FINISHED</Utils.Text>
        </View>
      )
    } else {
      return (
        <ButtonGradient
          size='xsmall'
          onPress={() => this.navigateToParticipate(item)}
          text='Participate'
        />
      )
    }
  }

  emptyListComponent = title => (
    <Utils.View align='center'>
      <Utils.VerticalSpacer size='medium' />
      <Utils.Text size='xsmall' font='light' color={Colors.secondaryText}>{title}</Utils.Text>
    </Utils.View>
  )

  renderTokenList = ({ item }) => {
    //console.warn(item)
    return (
      <FadeIn name={item.name}>
        <ListItem
          onPress={() => this.navigateToParticipate(item)}
          disabled={item.name === 'TRX'}
          titleStyle={{ color: Colors.primaryText }}
          containerStyle={{ borderBottomColor: '#191a29', height: 60, marginLeft: -24, justifyContent: 'center' }}
          underlayColor='#191a29'
          title={item.name}
          titleStyle={{ padding: 6, borderRadius: 8, color: 'white' }}
          hideChevron
          badge={{
            value: `${(item.price !== undefined) ? item.price : '0'}`,
            textStyle: { color: Colors.primaryText },
          }}
        />
      </FadeIn>
    )
  }

  render () {
    const { assetBalance, trxBalance, trxPrice, error, assetList } = this.state
    return (
      <Utils.Container>
        <Utils.StatusBar />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <Utils.VerticalSpacer size='large' />
          <FadeIn name='header'>
            <Utils.Row justify='center'>
              <Utils.View align='center'>
                  <Image
                    source={require('../../assets/tron-logo-small.png')}
                    resizeMode='contain'
                    style={{ height: 60 }}
                  />
                <Utils.VerticalSpacer size='medium' />
                <Utils.Text secondary>BALANCE</Utils.Text>
                <Motion defaultStyle={{ balance: 0 }} style={{ balance: spring(trxBalance)}}>
                  {value => <Utils.Text size='medium'>{formatAmount(value.balance.toFixed(0))} TRX</Utils.Text>}
                </Motion>
              </Utils.View>
            </Utils.Row>
          </FadeIn>
          <Utils.Content>
            <Utils.Content>
              <GrowIn name='linechart' height={30}>
                <LineChart
                  style={{ height: 30 }}
                  data={[ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]}
                  svg={{ stroke: 'url(#gradient)', strokeWidth: 3 }}
                  animate
                >
                  <Gradient />
                </LineChart>
              </GrowIn>
            </Utils.Content>
            {trxPrice && (
              <FadeIn name='tronprice'>
                <Motion defaultStyle={{ price: 0 }} style={{ price: spring(trxPrice, presets.gentle)}}>
                  {value => <Utils.Text size='small' align='center'>{`$ ${value.price.toFixed(PRICE_PRECISION)}`}</Utils.Text>}
                </Motion>
              </FadeIn>
            )}
            {!trxPrice && (
              <FadeIn name='loader' didLeave={() => console.warn({ didLoaderLeave: true })}>
                <ActivityIndicator />
              </FadeIn>
            )}
            <Utils.VerticalSpacer size='medium' />
            <FlatList
              ListEmptyComponent={this.emptyListComponent('Participate to a token')}
              ListHeaderComponent={this.listHeader('Balances')}
              data={assetBalance}
              renderItem={this.renderTokenList}
              keyExtractor={item => item.name}
              scrollEnabled
              ListFooterComponent={<Utils.VerticalSpacer size='large' />}
            />
            <FlatList
              ListEmptyComponent={this.emptyListComponent('No tokens to Participate')}
              ListHeaderComponent={this.listHeader('Participate')}
              data={assetList}
              renderItem={this.renderTokenList}
              keyExtractor={item => item.name}
              scrollEnabled
              ListFooterComponent={<Utils.VerticalSpacer size='large' />}
            />
            <Utils.Error>{error}</Utils.Error>
          </Utils.Content>
        </ScrollView>
      </Utils.Container>
    )
  }
}

export default BalanceScene
