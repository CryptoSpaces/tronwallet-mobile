import React, { Component } from 'react'
import { ActivityIndicator, AsyncStorage } from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'

import SecretStore from '../../store/secrets'
import { withContext } from '../../store/context'

class LoadingScene extends Component {
  async componentDidMount () {
    SplashScreen.hide()
    this._askPin()
  }

  _getUseStatus = async () => {
    const useStatus = await AsyncStorage.getItem('@TronWallet:useStatus')
    if (useStatus === null || useStatus === 'reset') {
      return useStatus || true
    } else {
      return false
    }
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
    this.props.context.setPin(key, () => this.props.navigation.navigate('App'))
  }

  _askPin = async () => {
    const useStatus = await this._getUseStatus()
    if (useStatus) {
      const shouldDoubleCheck = useStatus !== 'reset'
      this.props.navigation.navigate('FirstTime', {
        shouldDoubleCheck,
        testInput: this._tryToOpenStore
      })
    } else {
      this.props.navigation.navigate('Pin', {
        testInput: this._tryToOpenStore,
        onSuccess: this._handleSuccess
      })
    }
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
