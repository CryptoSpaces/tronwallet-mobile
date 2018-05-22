import React, { Component } from 'react'
import { createSwitchNavigator, createBottomTabNavigator } from 'react-navigation'

import LoadingScene from './scenes/Loading'
import WelcomeScene from './scenes/Welcome'
import LoginScene from './scenes/Login'
import HomeScene from './scenes/Home'
import BalanceScene from './scenes/Balance'
import VoteScreen from './src/screens/VoteScreen'

const AppTabs = createBottomTabNavigator({
  Home: HomeScene,
  Balance: BalanceScene,
  Vote: VoteScreen
})

const RootSwitch = createSwitchNavigator({
  Loading: LoadingScene,
  Welcome: WelcomeScene,
  Auth: LoginScene,
  App: AppTabs
})

export default class App extends Component {
  render () {
    return <RootSwitch />
  }
}
