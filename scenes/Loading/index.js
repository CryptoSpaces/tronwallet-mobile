import React, { Component } from 'react'
import { Font } from 'expo'
import { ActivityIndicator } from 'react-native'
import { Auth } from 'aws-amplify'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'

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
      'tronwallet': require('../../assets/icons/tronwallet.ttf')
    })
  }

  _checkSession = async () => {
    try {
      const session = await Auth.currentSession()
      if (session) {
        this.props.navigation.navigate('App')
      }
    } catch (error) {
      this.props.navigation.navigate('Auth')
    }
  }

  render () {
    return (
      <Utils.View flex={1} align='center' justify='center' background={Colors.background}>
        <ActivityIndicator />
      </Utils.View>
    )
  }
}

export default LoadingScene
