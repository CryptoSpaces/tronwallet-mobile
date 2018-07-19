import React, { Component } from 'react'
import { ActivityIndicator, AsyncStorage } from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'

import SecretStore from '../../store/secrets'
import { withContext } from '../../store/context'

class LoadingScene extends Component {
  componentDidMount () {
    SplashScreen.hide()
    this._askPin()
  }

  _isFirstTime = async () => {
    const isFirstTime = await AsyncStorage.getItem('@TronWallet:isFirstTime')
    if (isFirstTime !== null) {
      return false
    }
    return true
  }

  _tryToOpenStore = async pin => {
    try {
      await SecretStore(pin)
      return true
    } catch (err) {
      return false
    }
  }

  _handleSuccess = key => {
    this.props.context.setPin(key, async () => {
      const isFirstTime = await this._isFirstTime()
      if (isFirstTime) {
        this.props.navigation.navigate('RestoreOrCreateSeed')
      } else {
        this.props.navigation.navigate('App')
      }
    })
  }

  _askPin = async () => {
    const shouldDoubleCheck = await this._isFirstTime()
    this.props.navigation.navigate('Pin', {
      shouldDoubleCheck,
      testInput: this._tryToOpenStore,
      onSuccess: this._handleSuccess
    })
  }

  render () {
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

export default withContext(LoadingScene)
