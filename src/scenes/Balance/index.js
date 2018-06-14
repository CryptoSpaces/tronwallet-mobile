import React, { Component } from 'react'
import { LineChart } from 'react-native-svg-charts'
import { FlatList, Image, ScrollView, View } from 'react-native'
import moment from 'moment'
import axios from 'axios'
import { ListItem } from 'react-native-elements'

import Gradient from '../../components/Gradient'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import Client from '../../services/client'
import LoadingScene from '../../components/LoadingScene'
import formatAmount from '../../utils/formatnumber'
import ButtonGradient from '../../components/ButtonGradient'

class BalanceScene extends Component {
  state = {
    loading: true,
    error: null,
    assetBalance: [],
    assetList: [],
    trxBalance: 0,
    trxPrice: 0
  }

  componentDidMount () {
    this._navListener = this.props.navigation.addListener('willFocus', () => {
      this.loadData()
    })
  }

  componentWillUnmount () {
    this._navListener.remove()
  }

  loadData = async () => {
    this.setState({ loading: true })
    const now = moment()
    try {
      const getData = await Promise.all([Client.getBalances(), Client.getTokenList()])
      const balances = getData[0]
      const tokenList = getData[1]
      const trxBalance = balances.find(b => b.name === 'TRX')

      const assetBalance = balances.filter(b => b.name !== 'TRX').map(a => {
        let tokenDetail = tokenList.find(t => t.name === a.name)
        if (tokenDetail) return { ...tokenDetail, balance: a.balance }
        else return a
      })
      const assetList = tokenList.filter(t => t.percentage < 100 && moment(t.startTime).isBefore(now) && moment(t.endTime).isAfter(now) && !balances.find(b => t.name === b.name))
      const { data: { data } } = await axios.get(
        'https://api.coinmarketcap.com/v2/ticker/1958'
      )

      this.setState({
        trxBalance: trxBalance.balance,
        assetBalance,
        assetList,
        loading: false,
        trxPrice: data.quotes.USD.price
      })
    } catch (error) {
      this.setState({ error: error.message, loading: false })
    }
  }

  navigateToParticipate = token => this.props.navigation.navigate('Participate', { token })

  listHeader = (text) => (
    <Utils.View align='center'>
      <Utils.Text size='small' color={Colors.secondaryText}>{text}</Utils.Text>
    </Utils.View>
  )

  renderParticipateButton = item => {
    const now = moment()
    if (item.percentage >= 100 || moment(item.startTime).isAfter(now) || moment(item.endTime).isBefore(now)) {
      return <View style={{ justifyContent: 'center', paddingHorizontal: 12 }}>
        <Utils.Text color={Colors.red}>FINISHED</Utils.Text>
      </View>
    } else {
      return <ButtonGradient
        size='xsmall'
        onPress={() => this.navigateToParticipate(item)}
        text='Participate'
      />
    }
  }

  renderTokenList = ({ item }) => {
    const { assetBalance } = this.state
    if (!assetBalance.length) return
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
    const { assetBalance, trxBalance, loading, trxPrice, error, assetList } = this.state

    if (loading) return <LoadingScene />

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
            <Utils.Text size='xsmall' secondary>
              $ {trxPrice}
            </Utils.Text>
            <Utils.VerticalSpacer size='medium' />
            {assetBalance.length
              ? <FlatList
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
              : null}
            {assetList.length
              ? <FlatList
                ListHeaderComponent={this.listHeader('Token List')}
                data={assetList}
                renderItem={this.renderTokenList}
                keyExtractor={item => item.name}
                ItemSeparatorComponent={() => (
                  <Utils.VerticalSpacer size='large' />
                )}
                scrollEnabled
                ListFooterComponent={<Utils.VerticalSpacer size='large' />}
              /> : null}
            <Utils.Error>{error}</Utils.Error>
          </Utils.Content>
        </ScrollView>
      </Utils.Container>
    )
  }
}

export default BalanceScene
