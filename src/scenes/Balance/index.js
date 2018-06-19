import React, { Component } from 'react'
import moment from 'moment'
import axios from 'axios'
import { LineChart } from 'react-native-svg-charts'
import { FlatList, Image, ScrollView, View, ActivityIndicator } from 'react-native'
import { ListItem } from 'react-native-elements'

import Client from '../../services/client'
import Gradient from '../../components/Gradient'
import formatAmount from '../../utils/formatnumber'
import ButtonGradient from '../../components/ButtonGradient'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'

import BalanceStore from '../../store/balance'
import AssetsStore from '../../store/assets'

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
    trxPrice: null
  }

  async componentDidMount () {
    // await BalanceStore.write(() => {
    //   BalanceStore.delete(BalanceStore.objects('Balance'))
    // })
    // await AssetsStore.write(() => {
    //   AssetsStore.delete(AssetsStore.objects('Asset'))
    // })
    this.loadData()
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
        assetBalance,
        assetList
      })
    } catch (error) {
      this.setState({ error: error.message })
    }
  }

  navigateToParticipate = token => {
    const { trxBalance } = this.state;
    this.props.navigation.navigate('Participate', { token, trxBalance })
  }

  listHeader = text => (
    <Utils.View align='center'>
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
    return (
      <ListItem
        onPress={() => this.navigateToParticipate(item)}
        key={item.name}
        titleStyle={{ color: Colors.primaryText }}
        containerStyle={{ borderBottomColor: Colors.secondaryText, flex: 1, marginHorizontal: 0 }}
        underlayColor='rgba(0,0,0,0.2)'
        title={item.name}
        hideChevron
        badge={{ value: item.balance || 'Participate', textStyle: { color: Colors.primaryText }, containerStyle: { marginTop: -10 } }}
      />
    )
  }

  render () {
    const { assetBalance, trxBalance, trxPrice, error, assetList } = this.state
    return (
      <Utils.Container>
        <Utils.StatusBar />
        <ScrollView>
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
                data={[50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]}
                svg={{ stroke: 'url(#gradient)', strokeWidth: 3 }}
                animate
              >
                <Gradient />
              </LineChart>
            </Utils.Content>
            {
              trxPrice ? (
                <Utils.Text size='xsmall' secondary>{`$ ${trxPrice}`}</Utils.Text>
              ) : (
                <ActivityIndicator />
              )
            }
            <Utils.VerticalSpacer size='medium' />
            <FlatList
              ListEmptyComponent={this.emptyListComponent('Participate to a token')}
              ListHeaderComponent={this.listHeader('My Tokens')}
              data={assetBalance}
              renderItem={this.renderTokenList}
              keyExtractor={item => item.name}
              ItemSeparatorComponent={() => (
                <Utils.VerticalSpacer size='large' />
              )}
              scrollEnabled
              ListFooterComponent={<Utils.VerticalSpacer size='large' />}
            />
            <FlatList
              ListEmptyComponent={this.emptyListComponent('No tokens to Participate')}
              ListHeaderComponent={this.listHeader('Token List')}
              data={assetList}
              renderItem={this.renderTokenList}
              keyExtractor={item => item.name}
              ItemSeparatorComponent={() => <Utils.VerticalSpacer size='large' />}
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
