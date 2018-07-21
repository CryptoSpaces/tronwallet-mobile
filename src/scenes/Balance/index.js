import React, { Component } from 'react'
import { RefreshControl, ScrollView, AppState } from 'react-native'
import axios from 'axios'
import Config from 'react-native-config'

import NavigationHeader from '../../components/Navigation/Header'
import * as Utils from '../../components/Utils'
import WalletBalances from './WalletBalances'
import BalanceWarning from './BalanceWarning'
import BalanceNavigation from './BalanceNavigation'
import TrxValue from './TrxValue'
import TrxInfo from './TrxInfo'
import LineChart from './TrxLineChart'

import Client from '../../services/client'
import getBalanceStore from '../../store/balance'
import { getUserSecrets } from '../../utils/secretsUtils'
import withContext from '../../utils/hocs/withContext'

const LAST_DAY = Math.round(new Date().getTime() / 1000) - 24 * 3600

class BalanceScene extends Component {
  static navigationOptions = () => {
    return {
      header: <NavigationHeader title='BALANCE' />
    }
  }

  state = {
    refreshing: false,
    error: null,
    seedConfirmed: true,
    seed: [],
    balances: [],
    trxHistory: [],
    trxBalance: 0,
    appState: AppState.currentState
  }

  async componentDidMount () {
    try {
      this._loadData()
    } catch (e) {
      this.setState({error: 'An error occured while loading the data.'})
    }
    this._navListener =
      this.props.navigation.addListener('didFocus', this._loadData)
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentWillUnmount () {
    this._navListener.remove()
    clearInterval(this._dataListener)
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState.match(/inactive|background/) && this.state.appState === 'active') {
      this.props.navigation.navigate('Pin', { testInput: pin => pin === this.props.context.pin })
    }
    this.setState({ appState: nextAppState })
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true })
    await this._loadData()
    this.setState({ refreshing: false })
  }

  _loadData = async () => {
    try {
      const { updateWalletData, onesignalId } = this.props.context
      console.log('LUL', onesignalId)
      const data = await Promise.all([
        Client.getBalances(this.props.context.pin),
        getUserSecrets(this.props.context.pin),
        axios.get(
          `${Config.TRX_HISTORY_API}?fsym=TRX&tsym=USD&fromTs=${LAST_DAY}`
        )
      ])

      await updateWalletData()
      await this._updateBalancesStore(data[0])
      const balances = await this._getBalancesFromStore()
      const { balance } = balances.find(item => item.name === 'TRX')

      this.setState({
        trxHistory: data[2].data.Data.map(item => item.close),
        trxBalance: balance || 0,
        balances: data[0],
        seedConfirmed: data[1].confirmed,
        seed: data[1].mnemonic.split(' ')
      })
    } catch (e) {
      this.setState({ error: e.message })
    }
  }

  _getBalancesFromStore = async () => {
    const store = await getBalanceStore()
    return store.objects('Balance').map(item => Object.assign({}, item))
  }

  _updateBalancesStore = async balances => {
    const store = await getBalanceStore()
    store.write(() => balances.map(item => store.create('Balance', item, true)))
  }

  render () {
    const {
      trxBalance,
      balances,
      trxHistory,
      seed,
      seedConfirmed
    } = this.state

    return (
      <Utils.Container justify='flex-start' align='stretch'>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <TrxValue trxBalance={trxBalance} currency='USD' />
          <Utils.VerticalSpacer size='medium' />
          {!!trxHistory.length && <LineChart chartHistory={trxHistory} />}
          <Utils.VerticalSpacer size='medium' />
          <TrxInfo />
          <BalanceNavigation navigation={this.props.navigation} />
          {!seedConfirmed && (
            <BalanceWarning seed={seed} navigation={this.props.navigation}>
              Please tap to confirm your 12 seed words
            </BalanceWarning>
          )}
          <WalletBalances balances={balances} />
        </ScrollView>
      </Utils.Container>
    )
  }
}

export default withContext(BalanceScene)
