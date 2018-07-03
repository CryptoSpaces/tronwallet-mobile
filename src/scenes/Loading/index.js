import React, { Component } from 'react'
import { ActivityIndicator, Linking } from 'react-native'
import { Auth } from 'aws-amplify'
import SplashScreen from 'react-native-splash-screen'

import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'

class LoadingScene extends Component {
  async componentDidMount() {
    // React Navigation open this route cuncurrently with the deeplink route.
    const deepLinkUrl = await Linking.getInitialURL()
    if (!deepLinkUrl) {
      this._checkSession()
    }
  }

  _checkSession = async () => {
    try {
      await Promise.race([
        Auth.currentSession(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Session expired.')), 5000))
      ])
      this.props.navigation.navigate('App')
    } catch (error) {
      this.props.navigation.navigate('Login')
    }
    SplashScreen.hide()
  }


  render() {
    return (
      <Utils.View
        flex={1}
        align='center'
        justify='center'
        background={Colors.background}
      >
        <ActivityIndicator />
      </Utils.View>
    )
  }
}

export default LoadingScene
