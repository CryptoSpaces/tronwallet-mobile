import { createSwitchNavigator, createBottomTabNavigator } from 'react-navigation'

import LoadingScene from './scenes/Loading'
import WelcomeScene from './scenes/Welcome'
import LoginScene from './scenes/Login'
import HomeScene from './scenes/Home'
import BalanceScene from './scenes/Balance'

const AppTabs = createBottomTabNavigator({
  Home: HomeScene,
  Balance: BalanceScene
})

export default createSwitchNavigator({
  Loading: LoadingScene,
  Welcome: WelcomeScene,
  Auth: LoginScene,
  App: AppTabs
})
