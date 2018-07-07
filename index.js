import { AppRegistry } from 'react-native'
import App from './App'
import Config from 'react-native-config'
import { Sentry } from 'react-native-sentry'

if (!__DEV__) {
    Sentry.config(Config.APP_SENTRY_URL).install()
}

AppRegistry.registerComponent('tronwallet2', () => App)
