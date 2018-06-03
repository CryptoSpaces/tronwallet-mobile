import React, { Component } from 'react'
import { Font } from 'expo'
import { ActivityIndicator } from 'react-native'
import { Auth } from 'aws-amplify'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import Client from '../../services/client'

class LoadingScene extends Component {
  async componentDidMount () {
    await this._loadStuff()
    this._checkSession()
  }

  _loadStuff = async () => {
    await Font.loadAsync({
      'rubik-black': require('../../assets/fonts/Rubik-Black.ttf'),
      'rubik-bold': require('../../assets/fonts/Rubik-Bold.ttf'),
      'rubik-medium': require('../../assets/fonts/Rubik-Medium.ttf'),
      'rubik-regular': require('../../assets/fonts/Rubik-Regular.ttf'),
      'rubik-light': require('../../assets/fonts/Rubik-Light.ttf'),
      tronwallet: require('../../assets/icons/tronwallet.ttf')
    })
  }

  _checkSession = async () => {
    try {
      const session = await Auth.currentSession()
      const userPublicKey = await Client.getPublicKey()
      if (session) {
        if (userPublicKey) {
          this.props.navigation.navigate('App')
        } else {
          this.props.navigation.navigate('SetPublicKey')
        }
      }
    } catch (error) {
      this.props.navigation.navigate('Login')
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

export default LoadingScene
