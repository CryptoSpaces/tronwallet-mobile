import React, { Component } from 'react'

import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  AsyncStorage
} from 'react-native'

import { Answers } from 'react-native-fabric'
import axios from 'axios'
import Config from 'react-native-config'
import ActionSheet from 'react-native-actionsheet'

import NavigationHeader from '../../components/Navigation/Header'
import * as Utils from '../../components/Utils'
import WalletBalances from './WalletBalances'
import BalanceWarning from './BalanceWarning'
import BalanceNavigation from './BalanceNavigation'
import TrxValue from './TrxValue'
import TrxInfo from './TrxInfo'
import LineChart from './TrxLineChart'

import { USER_PREFERRED_CURRENCY } from '../../utils/constants'
import Client from '../../services/client'
import getBalanceStore from '../../store/balance'
import { getUserSecrets } from '../../utils/secretsUtils'
import withContext from '../../utils/hocs/withContext'

const CURRENCIES = ['USD', 'EUR', 'BTC', 'ETH', 'Cancel']

class BalanceScene extends Component {
  static navigationOptions = () => ({
    header: <NavigationHeader title='BALANCE' />
  })

  state = {
    refreshing: false,
    error: null,
    seedConfirmed: true,
    seed: [],
    balances: [],
    trxHistory: [],
    trxBalance: 0,
    currency: ''
  }

  async componentDidMount () {
    Answers.logContentView('Tab', 'Balance')
    try {
      this._loadData()
    } catch (e) {
      this.setState({error: 'An error occured while loading the data.'})
    }
    this._navListener =
      this.props.navigation.addListener('didFocus', this._loadData)
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

  _loadData = async () => {
    try {
      const { updateWalletData } = this.props.context
      const data = await Promise.all([
        Client.getBalances(this.props.context.pin),
        getUserSecrets(this.props.context.pin),
        axios.get(
          `${Config.TRX_HISTORY_API}histohour?fsym=TRX&tsym=USD&limit=23`
        ),
        AsyncStorage.getItem(USER_PREFERRED_CURRENCY)
      ])

      await updateWalletData()
      await this._updateBalancesStore(data[0])
      const balances = await this._getBalancesFromStore()
      const { balance } = balances.find(item => item.name === 'TRX')
      const currency = data[3] || 'USD'

      this.setState({
        trxHistory: data[2].data.Data.map(item => item.close),
        trxBalance: balance || 0,
        balances: data[0],
        seedConfirmed: data[1].confirmed,
        seed: data[1].mnemonic.split(' '),
        currency
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

  _handleCurrencyChange = async (index) => {
    const currency = CURRENCIES[index]

    if (currency && currency !== 'Cancel') {
      try {
        await AsyncStorage.setItem(USER_PREFERRED_CURRENCY, currency)
        this.setState({ currency })
      } catch (e) {
        this.setState({ error: 'Error saving preferred currency' })
      }
    }
  }

  render () {
    const {
      trxBalance,
      balances,
      trxHistory,
      seed,
      seedConfirmed,
      currency
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
          <Utils.Content paddingTop={2}>
            <Utils.View minHeight={190}>
              <ActionSheet
                ref={ref => { this.ActionSheet = ref }}
                title='Please, choose your preferred currency.'
                options={CURRENCIES}
                cancelButtonIndex={4}
                onPress={index => this._handleCurrencyChange(index)}
              />
              <TouchableOpacity onPress={() => this.ActionSheet.show()}>
                <TrxValue trxBalance={trxBalance} currency={currency} />
              </TouchableOpacity>
              <Utils.VerticalSpacer size='medium' />
              {!!trxHistory.length && <LineChart chartHistory={trxHistory} />}
              <Utils.VerticalSpacer size='medium' />
              <TrxInfo />
            </Utils.View>
            <BalanceNavigation navigation={this.props.navigation} />
            {!seedConfirmed && (
              <BalanceWarning seed={seed} navigation={this.props.navigation}>
                Please tap to confirm your 12 seed words
              </BalanceWarning>
            )}
            <WalletBalances balances={balances} />
          </Utils.Content>
        </ScrollView>
      </Utils.Container>
    )
  }
}

export default withContext(BalanceScene)
