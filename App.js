import React, { Component } from 'react'
import { StatusBar, Platform, YellowBox, SafeAreaView } from 'react-native'
import {
  createBottomTabNavigator,
  createStackNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation'
import Amplify from 'aws-amplify'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import axios from 'axios'
import Config from 'react-native-config'

import awsExports from './aws-exports'
import { Colors, ScreenSize } from './src/components/DesignSystem'

import LoadingScene from './src/scenes/Loading'
import SignupScene from './src/scenes/Signup'
import ConfirmSignup from './src/scenes/Signup/ConfirmSignup'
import WelcomeScene from './src/scenes/Welcome'
import LoginScene from './src/scenes/Login'
import ConfirmLogin from './src/scenes/Login/ConfirmLogin'
import SendScreen from './src/scenes/Send'
import ForgotPassword from './src/scenes/ForgotPassword'
import NewPassword from './src/scenes/ForgotPassword/NewPassword'
import SetPublicKey from './src/scenes/SetPublicKey'
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
import RestoreOrCreateSeed from './src/scenes/Seed/RestoreOrCreateSeed'
import TransactionDetails from './src/scenes/TransactionDetails'

import fontelloConfig from './src/assets/icons/config.json'
import NavigationHeader from './src/components/Navigation/Header'
import NavigationButton from './src/components/Navigation/ButtonHeader'
import ClearVotes from './src/components/ClearButton'

import Client from './src/services/client'
import { getUserPublicKey } from './src/utils/userAccountUtils'
import NodesIp from './src/utils/nodeIp'
import { Context } from './src/store/context'

import './ReactotronConfig'

const Icon = createIconSetFromFontello(fontelloConfig, 'tronwallet')

Amplify.configure(awsExports)
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'])

const SettingsStack = createStackNavigator(
  {
    Settings,
    SeedCreate,
    SeedConfirm,
    NetworkConnection
  },
  {
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
  }
)

const VoteStack = createStackNavigator(
  {
    VoteScene
  },
  {
    initialRouteName: 'VoteScene',
    navigationOptions: ({ navigation }) => ({
      header: (<NavigationHeader
        title='VOTES'
        rightButton={(navigation.getParam('votesError') || navigation.getParam('listError'))
          ? <NavigationButton
            title='RELOAD'
            onPress={navigation.getParam('loadData')}
          />
          : <ClearVotes
            onPress={navigation.getParam('clearVotes')}
          />} />

      )
    })
  }
)

const BalanceStack = createStackNavigator(
  {
    BalanceScene,
    ReceiveScene,
    TransferScene
  },
  {
    initialRouteName: 'BalanceScene'
  }
)

const TransactionList = createStackNavigator(
  {
    TransactionListScene,
    TransactionDetails
  }, {
    initialRouteName: 'TransactionListScene'
  }
)

const AppTabs = createBottomTabNavigator(
  {
    Home: HomeScene,
    Vote: {
      screen: VoteStack,
      path: 'vote'
    },
    Transactions: TransactionList,
    Balance: BalanceStack,
    Settings: SettingsStack
  },
  {
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
  }
)

const SignStack = createStackNavigator(
  {
    Signup: SignupScene,
    ConfirmSignup: ConfirmSignup
  },
  {
    initialRouteName: 'Signup',
    navigationOptions: {
      header: null,
      title: 'SIGN UP'
    }
  }
)

const LoginStack = createStackNavigator(
  {
    Login: LoginScene,
    ConfirmLogin: ConfirmLogin,
    ForgotPassword: ForgotPassword,
    ConfirmNewPassword: NewPassword
  },
  {
    initialRouteName: 'Login',
    navigationOptions: {
      header: null
    }
  }
)

const tabWidth = ScreenSize.width / 2
const indicatorWidth = 15
const LoginTabsPadding = 20 + 12

const SignTabs = createMaterialTopTabNavigator(
  {
    Login: {
      screen: LoginStack,
      navigationOptions: {
        title: 'SIGN IN'
      }
    },
    Sign: {
      screen: SignStack,
      navigationOptions: {
        title: 'SIGN UP'
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: Colors.primaryText,
      inactiveTintColor: Colors.secondaryText,
      style: {
        paddingTop: LoginTabsPadding,
        backgroundColor: Colors.background,
        elevation: 0
      },
      labelStyle: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'rubik-medium'
      },
      indicatorStyle: {
        width: indicatorWidth,
        height: 1.2,
        marginLeft: tabWidth / 2 - indicatorWidth / 2
      }
    }
  }
)

const RootNavigator = createStackNavigator(
  {
    Loading: LoadingScene,
    Welcome: WelcomeScene,
    RestoreOrCreateSeed,
    SeedRestore,
    Auth: SignTabs,
    App: AppTabs,
    Send: SendScreen,
    GetVault: GetVaultScene,
    Participate: ParticipateScene,
    SetPublicKey: {
      screen: SetPublicKey,
      path: 'getkey/:data'
    },
    SubmitTransaction: {
      screen: SubmitTransactionScene,
      path: 'transaction/:tx'
    },
    Freeze: FreezeVoteScene,
    Rewards: RewardsScene
  },
  {
    initialRouteName: 'Loading',
    navigationOptions: {
      gesturesEnabled: false,
      header: null
    }
  }
)

const prefix =
  Platform.OS === 'android' ? 'tronwalletmobile://tronwalletmobile/' : 'tronwalletmobile://'

class App extends Component {
  state = {
    price: {},
    freeze: {},
    publicKey: {}
  }

  componentDidMount () {
    this._getPrice()
    this._setNodes()
    this._loadUserData()
  }

  _loadUserData = () => {
    this._getPublicKey()
    this._getFreeze()
  }

  _getFreeze = async () => {
    try {
      const value = await Client.getFreeze()
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
      const publicKey = await getUserPublicKey()
      this.setState({ publicKey: { value: publicKey } })
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

  render () {
    const contextProps = {
      ...this.state,
      updateWalletData: this._loadUserData,
      getFreeze: this._getFreeze,
      getPrice: this._getPrice,
      getPublicKey: this._getPublicKey
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <Context.Provider value={contextProps}>
          <StatusBar barStyle='light-content' />
          <RootNavigator uriPrefix={prefix} />
        </Context.Provider>
      </SafeAreaView>
    )
  }
}

export default App
