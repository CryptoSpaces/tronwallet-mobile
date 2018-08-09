import React, { Component } from 'react'
import { StatusBar, Platform, YellowBox, SafeAreaView } from 'react-native'
import {
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import axios from 'axios'
import Config from 'react-native-config'
import OneSignal from 'react-native-onesignal'
import { Sentry, SentryLog } from 'react-native-sentry'

import { Colors } from './src/components/DesignSystem'

import LoadingScene from './src/scenes/Loading'
import SendScene from './src/scenes/Send'
import MarketScene from './src/scenes/Market'
import BalanceScene from './src/scenes/Balance'
import VoteScene from './src/scenes/Vote'
import ReceiveScene from './src/scenes/Receive'
import TransactionListScene from './src/scenes/Transactions'
import SubmitTransactionScene from './src/scenes/SubmitTransaction'
import FreezeScene from './src/scenes/Freeze'
import Settings from './src/scenes/Settings'
import TokenInfoScene from './src/scenes/Participate/TokenInfo'
import BuyScene from './src/scenes/Participate/Buy'
import GetVaultScene from './src/scenes/GetVault'
import FreezeVoteScene from './src/components/Vote/Freeze'
import RewardsScene from './src/scenes/Rewards'
import NetworkConnection from './src/scenes/Settings/NetworkModal'
import SeedCreate from './src/scenes/Seed/Create'
import SeedRestore from './src/scenes/Seed/Restore'
import SeedConfirm from './src/scenes/Seed/Confirm'
import TransactionDetails from './src/scenes/TransactionDetails'
import ParticipateHome from './src/scenes/Participate'
import Pin from './src/scenes/Pin'
import FirstTime from './src/scenes/FirstTime'
import TransactionSuccess from './src/scenes/TransactionSuccess'

import Client from './src/services/client'
import { Context } from './src/store/context'
import NodesIp from './src/utils/nodeIp'
import { getUserSecrets } from './src/utils/secretsUtils'

import fontelloConfig from './src/assets/icons/config.json'

import './ReactotronConfig'

if (!__DEV__) {
  Sentry.config('https://8ffba48a3f30473883ba930c49ab233d@sentry.io/1236809', {
    disableNativeIntegration: Platform.OS === 'android'
  }).install()
}


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
  FreezeScene,
  SendScene
})

const TransactionList = createStackNavigator({
  TransactionListScene,
  TransactionDetails
})

const ParticipateStack = createStackNavigator(
  {
    ParticipateHome,
    TokenInfo: TokenInfoScene,
    Buy: BuyScene
  }
)

const AppTabs = createBottomTabNavigator({
  Market: MarketScene,
  Vote: {
    screen: VoteScene,
    path: 'vote'
  },
  Balance: BalanceStack,
  Transactions: TransactionList,
  Participate: ParticipateStack,
  Settings: SettingsStack
}, {
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state
      let iconName
      if (routeName === 'Market') {
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
      } else if (routeName === 'Participate') {
        iconName = `dollar,-currency,-money,-cash,-coin`
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
  GetVault: GetVaultScene,
  SubmitTransaction: {
    screen: SubmitTransactionScene,
    path: 'transaction/:tx'
  },
  TransactionSuccess,
  Freeze: FreezeVoteScene,
  Rewards: RewardsScene
}, {
  mode: 'modal',
  navigationOptions: {
    gesturesEnabled: false,
    header: null
  },
  cardStyle: { shadowColor: 'transparent' }
})

const prefix =
  Platform.OS === 'android' ? 'tronwalletmobile://tronwalletmobile/' : 'tronwalletmobile://'

class App extends Component {
  state = {
    price: {},
    freeze: {},
    publicKey: {},
    pin: null,
    oneSignalId: null,
    shareModal: false,
    queue: null
  }

  async componentDidMount () {
    OneSignal.init('ce0b0f27-0ae7-4a8c-8fff-2a110da3a163')
    OneSignal.configure()
    OneSignal.inFocusDisplaying(2)
    OneSignal.addEventListener('ids', this._onIds)
    OneSignal.addEventListener('opened', this._onOpened)
    OneSignal.addEventListener('received', this._onReceived)

    this._getPrice()
    this._setNodes()
  }

  componentWillUnmount () {
    OneSignal.removeEventListener('ids', this._onIds)
    OneSignal.removeEventListener('opened', this._onOpened)
    OneSignal.removeEventListener('received', this._onReceived)
  }

  _onIds = device => {
    console.log('Device info: ', device)
    this.setState({ oneSignalId: device.userId })
  }

  _onReceived = notification => {
    console.log('Notification received: ', notification)
  }

  _onOpened = openResult => {
    console.log('Message: ', openResult.notification.payload.body)
    console.log('Data: ', openResult.notification.payload.additionalData)
    console.log('isActive: ', openResult.notification.isAppInFocus)
    console.log('openResult: ', openResult)
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

  _openShare = () => {
    this.setState({
      shareModal: true
    })
  }

  _closeShare = () => {
    this.setState({
      shareModal: false
    })
  }

  _toggleShare = () => {
    this.setState((state) => ({
      shareModal: !state.shareModal
    }))
  }

  render () {
    const contextProps = {
      ...this.state,
      updateWalletData: this._loadUserData,
      getFreeze: this._getFreeze,
      getPrice: this._getPrice,
      getPublicKey: this._getPublicKey,
      setPin: this._setPin,
      openShare: this._openShare,
      closeShare: this._closeShare,
      toggleShare: this._toggleShare,
      createJobs: this._createJobs
    }

    return (
      <SafeAreaView style={{ backgroundColor: Colors.background, flex: 1 }} >
        <Context.Provider value={contextProps}>
          <StatusBar barStyle='light-content' />
          <RootNavigator uriPrefix={prefix} />
        </Context.Provider>
      </SafeAreaView>
    )
  }
}

export default App
