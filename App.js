import React, { Component, Fragment } from 'react'
import { StatusBar, Platform } from 'react-native'
import { createBottomTabNavigator, createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation'
import Amplify from 'aws-amplify'
import awsExports from './aws-exports'
import { Colors, Spacing, width } from './components/DesignSystem'
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
import ReceiveScreen from './src/screens/ReceiveScreen'
import TransactionScreen from './scenes/Transaction'

Amplify.configure(awsExports)
const prefix = Platform.OS === 'android' ? 'exp://localhost:19000/--/' : 'exp://localhost:19000/--/'

const AppTabs = createBottomTabNavigator({
  Home: HomeScene,
  Balance: BalanceScene,
  Vote: {
    screen: VoteScreen,
    path: 'vote'
  },
  Receive: ReceiveScreen
})

const SignStack = createStackNavigator(
  {
    Signup: SignupScene,
    ConfirmSignup: ConfirmSignup
  },
  {
    initialRouteName: 'Signup',
    navigationOptions: {
      header: null
    }
  })

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
  })

const SignTabs = createMaterialTopTabNavigator({
  Login: LoginStack,
  Sign: SignStack
}, {
  tabBarOptions: {
    activeTintColor: Colors.primaryText,
    inactiveTintColor: Colors.secondaryText,
    style: {
      height: width * 0.2,
      paddingTop: Spacing['large'],
      backgroundColor: Colors.background
    },
    labelStyle: {
      fontSize: 12,
      lineHeight: 20
    },
    barStyle: {
      width: 20
    },
    indicatorStyle: {
      width: 20,
      alignSelf: 'center'
    }
  }
})

const RootSwitch = createStackNavigator({
  Loading: LoadingScene,
  Welcome: WelcomeScene,
  Auth: SignTabs,
  App: AppTabs,
  Send: SendScreen,
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
        <RootSwitch uriPrefix={prefix} />
      </Fragment>
    )
  }
}

export default App
