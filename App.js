import React, { Component, Fragment } from 'react'
import { StatusBar } from 'react-native'
import { createSwitchNavigator, createBottomTabNavigator, createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation'
import Amplify from 'aws-amplify'
import awsExports from './aws-exports'

import LoadingScene from './scenes/Loading'
import SignupScene from './scenes/Signup'
import ConfirmSignup from './scenes/Signup/ConfirmSignup'
import WelcomeScene from './scenes/Welcome'
import LoginScene from './scenes/Login'
import ConfirmLogin from './scenes/Login/ConfirmLogin'
import ForgotPassword from './scenes/ForgotPassword'
import NewPassword from './scenes/ForgotPassword/NewPassword'
import HomeScene from './scenes/Home'
import BalanceScene from './scenes/Balance'

Amplify.configure(awsExports)

const AppTabs = createBottomTabNavigator({
  Home: HomeScene,
  Balance: BalanceScene
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
})

const RootSwitch = createSwitchNavigator({
  Loading: LoadingScene,
  Welcome: WelcomeScene,
  Auth: SignTabs,
  App: AppTabs
})

class App extends Component {
  render () {
    return (
      <Fragment>
        <StatusBar barStyle='light-content' />
        <RootSwitch />
      </Fragment>
    )
  }
}

export default App
