import React, { Component } from 'react'
import { StatusBar, Platform, YellowBox, SafeAreaView } from 'react-native'
import {
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import axios from 'axios'
import Config from 'react-native-config'

import { Colors } from './src/components/DesignSystem'

import LoadingScene from './src/scenes/Loading'
import SendScreen from './src/scenes/Send'
import HomeScene from './src/scenes/Home'
import BalanceScene from './src/scenes/Balance'
import VoteScene from './src/scenes/Vote'
import ReceiveScene from './src/scenes/Receive'
import TransactionListScene from './src/scenes/Transactions'
import SubmitTransactionScene from './src/scenes/SubmitTransaction'
import TransferScene from './src/scenes/Transfer'
import Settings from './src/scenes/Settings'
import ParticipateScene from './src/scenes/Tokens/Participate'
import GetVaultScene from './src/scenes/GetVault'
import FreezeVoteScene from './src/components/Vote/Freeze'
import RewardsScene from './src/scenes/Rewards'
import NetworkConnection from './src/scenes/Settings/NetworkModal'
import SeedCreate from './src/scenes/Seed/Create'
import SeedRestore from './src/scenes/Seed/Restore'
import SeedConfirm from './src/scenes/Seed/Confirm'
import TransactionDetails from './src/scenes/TransactionDetails'
import Pin from './src/scenes/Pin'
import FirstTime from './src/scenes/FirstTime'

import Client from './src/services/client'
import NodesIp from './src/utils/nodeIp'
import { getUserSecrets } from './src/utils/secretsUtils'
import { Context } from './src/store/context'

import fontelloConfig from './src/assets/icons/config.json'

import './ReactotronConfig'

const Icon = createIconSetFromFontello(fontelloConfig, 'tronwallet')

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'])

const SettingsStack = createStackNavigator({
  Settings,
  SeedCreate,
  SeedConfirm,
  NetworkConnection
}, {
  navigationOptions: {
    headerStyle: {
      backgroundColor: Colors.background,
      elevation: 0,
      borderColor: Colors.background
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontFamily: 'rubik-medium'
    }
  }
})

const BalanceStack = createStackNavigator({
  BalanceScene,
  ReceiveScene,
  TransferScene
}, {
  initialRouteName: 'BalanceScene'
})

const TransactionList = createStackNavigator({
  TransactionListScene,
  TransactionDetails
}, {
  initialRouteName: 'TransactionListScene'
})

const AppTabs = createBottomTabNavigator({
  Home: HomeScene,
  Vote: {
    screen: VoteScene,
    path: 'vote'
  },
  Transactions: TransactionList,
  Balance: BalanceStack,
  Transfer: TransferScene,
  Receive: ReceiveScene,
  Settings: SettingsStack
}, {
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state
      let iconName
      if (routeName === 'Home') {
        iconName = `graph,-bar,-chart,-statistics,-analytics`
      } else if (routeName === 'Balance') {
        iconName = `wallet,-money,-cash,-balance,-purse`
      } else if (routeName === 'Transfer') {
        iconName = `fly,-send,-paper,-submit,-plane`
      } else if (routeName === 'Vote') {
        iconName = `shout-out,-speaker,-offer,-announcement,-loud`
      } else if (routeName === 'Transactions') {
        iconName = `network,-arrow,-up-dowm,-mobile-data,-send-receive`
      } else if (routeName === 'Receive') {
        iconName = `scan,-bar-code,-qr-code,-barcode,-scanner`
      } else if (routeName === 'Settings') {
        iconName = `gear,-settings,-update,-setup,-config`
      }

      return <Icon name={iconName} size={26} color={tintColor} />
    }
  }),
  tabBarOptions: {
    activeTintColor: Colors.primaryText,
    inactiveTintColor: Colors.secondaryText,
    style: {
      backgroundColor: 'black'
    },
    showLabel: false
  },
  initialRouteName: 'Balance'
})

const RootNavigator = createStackNavigator({
  Loading: LoadingScene,
  FirstTime,
  Pin,
  SeedRestore,
  App: AppTabs,
  Send: SendScreen,
  GetVault: GetVaultScene,
  Participate: ParticipateScene,
  SubmitTransaction: {
    screen: SubmitTransactionScene,
    path: 'transaction/:tx'
  },
  Freeze: FreezeVoteScene,
  Rewards: RewardsScene
}, {
  mode: 'modal',
  navigationOptions: {
    gesturesEnabled: false,
    header: null
  }
})

const prefix =
  Platform.OS === 'android' ? 'tronwalletmobile://tronwalletmobile/' : 'tronwalletmobile://'

class App extends Component {
  state = {
    price: {},
    freeze: {},
    publicKey: {},
    pin: null
  }

  componentDidMount () {
    this._getPrice()
    this._setNodes()
  }

  _loadUserData = () => {
    this._getPublicKey()
    this._getFreeze()
  }

  _getFreeze = async () => {
    try {
      const value = await Client.getFreeze(this.state.pin)
      this.setState({ freeze: { value } })
    } catch (err) {
      this.setState({ freeze: { err } })
    }
  }

  _getPrice = async () => {
    try {
      const { data: { data } } = await axios.get(Config.TRX_PRICE_API)
      this.setState({ price: { value: data.quotes.USD.price } })
    } catch (err) {
      this.setState({ price: { err } })
    }
  }

  _getPublicKey = async () => {
    try {
      const { address } = await getUserSecrets(this.state.pin)
      this.setState({ publicKey: { value: address } })
    } catch (err) {
      this.setState({ publicKey: { err } })
    }
  }

  _setNodes = async () => {
    try {
      await NodesIp.initNodes()
    } catch (error) {
      console.warn(error)
    }
  }

  _setPin = (pin, callback) => {
    this.setState({ pin }, () => {
      callback()
      this._loadUserData()
    })
  }

  render () {
    const contextProps = {
      ...this.state,
      updateWalletData: this._loadUserData,
      getFreeze: this._getFreeze,
      getPrice: this._getPrice,
      getPublicKey: this._getPublicKey,
      setPin: this._setPin
    }
    return (
      <SafeAreaView style={{ backgroundColor: Colors.background, flex: 1 }}>
        <Context.Provider value={contextProps}>
          <StatusBar barStyle='light-content' />
          <RootNavigator uriPrefix={prefix} />
        </Context.Provider>
      </SafeAreaView>
    )
  }
}

export default App
