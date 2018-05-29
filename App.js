import React, { Component, Fragment } from 'react'
import { StatusBar } from 'react-native'
import { Linking } from 'expo'
import {
  createBottomTabNavigator,
  createStackNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation'
import Amplify from 'aws-amplify'

import awsExports from './aws-exports'
import { Colors, ScreenSize } from './components/DesignSystem'

import LoadingScene from './scenes/Loading'
import SignupScene from './scenes/Signup'
import ConfirmSignup from './scenes/Signup/ConfirmSignup'
import WelcomeScene from './scenes/Welcome'
import LoginScene from './scenes/Login'
import ConfirmLogin from './scenes/Login/ConfirmLogin'
import SendScreen from './scenes/Send'
import ForgotPassword from './scenes/ForgotPassword'
import NewPassword from './scenes/ForgotPassword/NewPassword'
import HomeScene from './scenes/Home'
import BalanceScene from './scenes/Balance'
import VoteScreen from './scenes/Vote'
import ReceiveScene from './scenes/Receive'
import TransactionScreen from './scenes/Transaction'
import SettingScene from './scenes/Settings'
import TokensScene from './scenes/Tokens'
import ParticipateScene from './scenes/Tokens/Participate'
import GetVaultScene from './scenes/GetVault/GetVault'

import { createIconSetFromFontello } from '@expo/vector-icons'
import fontelloConfig from './assets/icons/config.json'

const Icon = createIconSetFromFontello(fontelloConfig, 'tronwallet')

Amplify.configure(awsExports)
const prefix = Linking.makeUrl('/') // TODO - Review before release

const SettingsStack = createStackNavigator({
  SettingScene
}, {
  initialRouteName: 'SettingScene',
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

const AppTabs = createBottomTabNavigator({
  Balance: BalanceScene,
  Home: HomeScene,
  Vote: {
    screen: VoteScreen,
    path: 'vote'
  },
  Tokens: TokensScene,
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
      } else if (routeName === 'Vote') {
        iconName = `shout-out,-speaker,-offer,-announcement,-loud`
      } else if (routeName === 'Receive') {
        iconName = `network,-arrow,-up-dowm,-mobile-data,-send-receive`
      } else if (routeName === 'Tokens') {
        iconName = `money,-currency,-note,-cash,-capital`
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
  }
})

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
  })

const LoginStack = createStackNavigator({
  Login: LoginScene,
  ConfirmLogin: ConfirmLogin,
  ForgotPassword: ForgotPassword,
  ConfirmNewPassword: NewPassword
}, {
  initialRouteName: 'Login',
  navigationOptions: {
    header: null
  }
})

const tabWidth = ScreenSize.width / 2
const indicatorWidth = 15

const SignTabs = createMaterialTopTabNavigator({
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
}, {
  tabBarOptions: {
    activeTintColor: Colors.primaryText,
    inactiveTintColor: Colors.secondaryText,
    style: {
      paddingTop: 60,
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
      marginLeft: ((tabWidth / 2) - (indicatorWidth / 2))
    }
  }
})

const RootNavigator = createStackNavigator({
  Loading: LoadingScene,
  Welcome: WelcomeScene,
  Auth: SignTabs,
  App: AppTabs,
  Send: SendScreen,
  GetVault: GetVaultScene,
  Participate: ParticipateScene,
  TransactionDetail: {
    screen: TransactionScreen,
    path: 'transaction/:tx'
  }
}, {
  initialRouteName: 'Loading',
  mode: 'modal',
  navigationOptions: {
    header: null
  }
})

class App extends Component {
  render () {
    return (
      <Fragment>
        <StatusBar barStyle='light-content' />
        <RootNavigator uriPrefix={prefix} />
      </Fragment>
    )
  }
}

export default App
