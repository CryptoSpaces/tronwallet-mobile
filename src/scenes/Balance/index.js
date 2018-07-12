import React, { Component } from 'react'
import moment from 'moment'
import axios from 'axios'
import Config from 'react-native-config'
import { LineChart } from 'react-native-svg-charts'
import {
  FlatList,
  Image,
  ScrollView,
  View,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native'
import { Motion, spring, presets } from 'react-motion'
import Client from '../../services/client'
import Gradient from '../../components/Gradient'
import { formatNumber } from '../../utils/numberUtils'
import ButtonGradient from '../../components/ButtonGradient'
import FadeIn from '../../components/Animations/FadeIn'
import GrowIn from '../../components/Animations/GrowIn'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import TokenItem from './TokenItem'

import getBalanceStore from '../../store/balance'
import getAssetsStore from '../../store/assets'
import { Context } from '../../store/context'
import { getUserSecrets } from '../../utils/secretsUtils'

const PRICE_PRECISION = 4
const LINE_CHART_HEIGHT = 40
const LAST_DAY = Math.round(new Date().getTime() / 1000) - 24 * 3600
const POOLING_TIME = 30000

class BalanceScene extends Component {
  state = {
    error: null,
    assetBalance: [],
    assetList: [],
    trxHistory: [],
    trxBalance: 0,
    refreshing: false,
    loadingData: true,
    seedConfirmed: true
  }

  async componentDidMount () {
    try {
      const assetList = await this._getAssetsFromStore()
      const assetBalance = await this._getBalancesFromStore()
      const data = await getUserSecrets()
      this.setState({ assetList, assetBalance, seedConfirmed: data.confirmed })
    } catch (err) {
      this.setState({ error: 'An error occured while loading data.' })
    } finally {
      this._loadData()
    }
    this._navListener = this.props.navigation.addListener(
      'didFocus',
      this._loadData
    )
    this._dataListener = setInterval(this._loadData, POOLING_TIME)
  }

  componentWillUnmount () {
    this._navListener.remove()
    clearInterval(this._dataListener)
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true })
    await this._loadData()
    this.setState({ refreshing: false })
  }

  _getBalancesFromStore = async () => {
    const store = await getBalanceStore()
    return store.objects('Balance').map(item => Object.assign({}, item))
  }

  _updateBalancesStore = async balances => {
    const store = await getBalanceStore()
    store.write(() => balances.map(item => store.create('Balance', item, true)))
  }

  _getAssetsFromStore = async () => {
    const store = await getAssetsStore()
    return store
      .objects('Asset')
      .filtered(
        `percentage < 100 AND startTime < ${Date.now()} AND endTime > ${Date.now()}`
      )
      .map(item => Object.assign({}, item))
  }

  _updateAssetsStore = async assets => {
    const store = await getAssetsStore()
    store.write(() => assets.map(item => store.create('Asset', item, true)))
  }

  _loadData = async () => {
    this.setState({loadingData: true})
    try {
      const { updateWalletData } = this.props.context
      const getData = await Promise.all([
        Client.getBalances(),
        Client.getTokenList()
      ])

      const trxHistory = await axios.get(
        `${Config.TRX_HISTORY_API}?fsym=TRX&tsym=USD&fromTs=${LAST_DAY}`
      )
      this.setState({
        trxHistory: trxHistory.data.Data.map(item => item.close)
      })

      await Promise.all([
        this._updateBalancesStore(getData[0]),
        this._updateAssetsStore(getData[1])
      ])
      await updateWalletData()

      const assetBalance = await this._getBalancesFromStore()
      const assetList = await this._getAssetsFromStore()
      const trxBalance = assetBalance.find(item => item.name === 'TRX')

      const { confirmed } = await getUserSecrets()

      this.setState({
        trxBalance: trxBalance.balance || 0,
        assetBalance,
        assetList,
        seedConfirmed: confirmed
      })
    } catch (error) {
      this.setState({ error: error.message })
    } finally {
      this.setState({loadingData: false})
    }
  }

  _navigateToParticipate = token => {
    const { trxBalance, assetList, loadingData } = this.state
    if (token.name !== 'TRX' && trxBalance > 0) {
      const tokenToParticipate = assetList.find(
        asset => asset.name === token.name
      )
      if (!tokenToParticipate) {
        // TODO -Need to understand better the behavior if a token doesn't belong to
        // the participation list but belongs to the user's balance list
        return
      }
      this.props.navigation.navigate('Participate', {
        token: tokenToParticipate,
        trxBalance
      })
    }
    if (trxBalance === 0 && !loadingData) Alert.alert("You don't have TRX to participate to assets.")
  }

  listHeader = text => (
    <Utils.View align='flex-start'>
      <Utils.Text size='xsmall' color={Colors.secondaryText}>
        {text}
      </Utils.Text>
      <Utils.VerticalSpacer />
    </Utils.View>
  )

  tokenSaleHeader = () => (
    <Utils.Row justify='space-between'>
      <Utils.View align='flex-start'>
        <Utils.Text size='xsmall' color={Colors.secondaryText}>
          {'TOKEN SALE'}
        </Utils.Text>
      </Utils.View>
      <Utils.View align='flex-end' marginRight={12}>
        <Utils.Text size='xsmall' color={Colors.secondaryText}>
          {'PRICE PER TOKEN (TRX)'}
        </Utils.Text>
      </Utils.View>
    </Utils.Row>
  )

  renderParticipateButton = item => {
    const now = moment()
    if (
      item.percentage >= 100 ||
      moment(item.startTime).isAfter(now) ||
      moment(item.endTime).isBefore(now)
    ) {
      return (
        <View style={{ justifyContent: 'center', paddingY: 12 }}>
          <Utils.Text color={Colors.red}>FINISHED</Utils.Text>
        </View>
      )
    } else {
      return (
        <ButtonGradient
          size='xsmall'
          onPress={() => this._navigateToParticipate(item)}
          text='Participate'
        />
      )
    }
  }

  emptyListComponent = title => (
    <Utils.View align='center'>
      <Utils.VerticalSpacer size='medium' />
      <Utils.Text size='xsmall' font='light' color={Colors.secondaryText}>
        {title}
      </Utils.Text>
    </Utils.View>
  )

  render () {
    const {
      assetBalance,
      trxBalance,
      error,
      assetList,
      trxHistory
    } = this.state
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
          <Utils.Content>
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
                  <Utils.VerticalSpacer />
                  <Motion
                    defaultStyle={{ balance: 0 }}
                    style={{ balance: spring(trxBalance) }}
                  >
                    {value => (
                      <Utils.Text size='large'>
                        {formatNumber(value.balance.toFixed(0))} TRX
                      </Utils.Text>
                    )}
                  </Motion>
                  <Utils.VerticalSpacer />
                  <Context.Consumer>
                    {({ price }) =>
                      price.value && (
                        <FadeIn name='usd-value'>
                          <Motion
                            defaultStyle={{ price: 0 }}
                            style={{
                              price: spring(
                                trxBalance * price.value,
                                presets.gentle
                              )
                            }}
                          >
                            {value => (
                              <Utils.Text
                                size='small'
                                align='center'
                              >{`${value.price.toFixed(2)} USD`}</Utils.Text>
                            )}
                          </Motion>
                        </FadeIn>
                      )
                    }
                  </Context.Consumer>
                  {!this.state.seedConfirmed && (
                    <React.Fragment>
                      <Utils.VerticalSpacer />
                      <FadeIn name='seed-warning'>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate('SeedCreate')
                          }
                        >
                          <Utils.Text size='xsmall' secondary align='center'>
                            Please, tap here to confim your 12 seed words.
                          </Utils.Text>
                        </TouchableOpacity>
                      </FadeIn>
                      <Utils.VerticalSpacer />
                    </React.Fragment>
                  )}
                </Utils.View>
              </Utils.Row>
            </FadeIn>
            {!!trxHistory.length && (
              <Utils.View paddingX='medium'>
                <GrowIn name='linechart' height={LINE_CHART_HEIGHT}>
                  <LineChart
                    style={{ height: LINE_CHART_HEIGHT }}
                    data={this.state.trxHistory}
                    svg={{ stroke: 'url(#gradient)', strokeWidth: 3 }}
                    animate
                  >
                    <Gradient />
                  </LineChart>
                </GrowIn>
              </Utils.View>
            )}
            <Utils.VerticalSpacer size='big' />
            <Context.Consumer>
              {({ price }) =>
                !price.value && (
                  <FadeIn name='loader'>
                    <ActivityIndicator />
                  </FadeIn>
                )
              }
            </Context.Consumer>
            <Context.Consumer>
              {({ price, freeze }) =>
                price.value &&
                freeze.value && (
                  <FadeIn name='tronprice'>
                    <Utils.Row justify='space-between' marginBottom={24}>
                      <Utils.View
                        flex={1}
                        align='center'
                        padding={6}
                        borderRadius={8}
                        borderColor={Colors.secondaryText}
                        marginRight={4}
                      >
                        <Utils.Text secondary size='xsmall'>
                          TRON POWER
                        </Utils.Text>
                        <Utils.VerticalSpacer />
                        <Motion
                          defaultStyle={{ power: 0 }}
                          style={{
                            power: spring(freeze.value.total, presets.gentle)
                          }}
                        >
                          {value => (
                            <Utils.Text
                              size='small'
                              align='center'
                            >{`${value.power.toFixed(0)}`}</Utils.Text>
                          )}
                        </Motion>
                      </Utils.View>
                      <Utils.View
                        flex={1}
                        align='center'
                        padding={6}
                        borderRadius={8}
                        borderColor={Colors.secondaryText}
                      >
                        <Utils.Text secondary size='xsmall'>
                          TRX PRICE
                        </Utils.Text>
                        <Utils.VerticalSpacer />
                        <Motion
                          defaultStyle={{ price: 0 }}
                          style={{ price: spring(price.value, presets.gentle) }}
                        >
                          {value => (
                            <Utils.Text
                              size='small'
                              align='center'
                            >{`${value.price.toFixed(
                                PRICE_PRECISION
                              )} USD`}</Utils.Text>
                          )}
                        </Motion>
                      </Utils.View>
                      <Utils.View
                        flex={1}
                        align='center'
                        padding={6}
                        borderRadius={8}
                        borderColor={Colors.secondaryText}
                        marginLeft={4}
                      >
                        <Utils.Text secondary size='xsmall'>
                          BANDWIDTH
                        </Utils.Text>
                        <Utils.VerticalSpacer />
                        <Motion
                          defaultStyle={{ bandwidth: 0 }}
                          style={{
                            bandwidth: spring(
                              freeze.value.bandwidth.netRemaining,
                              presets.gentle
                            )
                          }}
                        >
                          {value => (
                            <Utils.Text
                              size='small'
                              align='center'
                            >{`${value.bandwidth.toFixed(0)}`}</Utils.Text>
                          )}
                        </Motion>
                      </Utils.View>
                    </Utils.Row>
                  </FadeIn>
                )
              }
            </Context.Consumer>
            <Utils.VerticalSpacer size='medium' />
            <FlatList
              ListEmptyComponent={this.emptyListComponent(
                'Participate to a token'
              )}
              ListHeaderComponent={this.listHeader('BALANCES')}
              data={assetBalance}
              renderItem={({ item }) => (
                <TokenItem
                  item={item}
                  onPress={() => this._navigateToParticipate(item)}
                />
              )}
              keyExtractor={item => item.name}
              scrollEnabled
            />
            <Utils.VerticalSpacer size='medium' />
            <FlatList
              ListEmptyComponent={this.emptyListComponent(
                'No tokens to Participate'
              )}
              ListHeaderComponent={this.tokenSaleHeader()}
              data={assetList}
              renderItem={({ item }) => (
                <TokenItem
                  item={item}
                  onPress={() => this._navigateToParticipate(item)}
                />
              )}
              keyExtractor={item => item.name}
              scrollEnabled
            />
            <Utils.Error>{error}</Utils.Error>
          </Utils.Content>
        </ScrollView>
      </Utils.Container>
    )
  }
}

export default props => (
  <Context.Consumer>
    {context => <BalanceScene context={context} {...props} />}
  </Context.Consumer>
)
