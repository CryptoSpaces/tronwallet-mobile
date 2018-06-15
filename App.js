import React, { Component, Fragment } from 'react'
import { StatusBar } from 'react-native'
//import { Linking, Constants } from 'expo'
import {
  createBottomTabNavigator,
  createStackNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation'
import Amplify from 'aws-amplify'

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
import TransactionListScene from './src/scenes/Transactions'
import TransactionDetailScene from './src/scenes/TransactionDetail'
import TransferScene from './src/scenes/Transfer'
import SettingScene from './src/scenes/Settings'
import ParticipateScene from './src/scenes/Tokens/Participate'
import GetVaultScene from './src/scenes/GetVault/GetVault'

import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './src/assets/icons/config.json'

const Icon = createIconSetFromFontello(fontelloConfig, 'tronwallet');

Amplify.configure(awsExports)
//const prefix = Linking.makeUrl('/') // TODO - Review before release
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const SettingsStack = createStackNavigator(
  {
    SettingScene
  },
  {
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
  }
)

const VoteStack = createStackNavigator(
  {
    VoteScene
  },
  {
    initialRouteName: 'VoteScene'
  }
)
const TransferStack = createStackNavigator(
  {
    TransferScene
  },
  {
    initialRouteName: 'TransferScene'
  }
)

const TransactionList = createStackNavigator(
  {
    TransactionListScene
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
    Balance: BalanceScene,
    Transactions: TransactionList,
    Transfer: TransferStack,
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
    Auth: SignTabs,
    App: AppTabs,
    Send: SendScreen,
    GetVault: GetVaultScene,
    Participate: ParticipateScene,
    SetPublicKey: {
      screen: SetPublicKey,
      path: 'getkey/:data'
    },
    TransactionDetail: {
      screen: TransactionDetailScene,
      path: 'transaction/:tx'
    }
  },
  {
    initialRouteName: 'Loading',
    mode: 'modal',
    navigationOptions: {
      header: null
    }
  }
);

class App extends Component {
  render () {
    return (
      <Fragment>
        <StatusBar barStyle='light-content' />
        <RootNavigator uriPrefix={'tronwallet'} />
      </Fragment>
    )
  }
}

export default App
