import React, { Component } from 'react'
import { AppLoading, Font } from 'expo'
import { Auth } from 'aws-amplify'

class LoadingScene extends Component {
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
      <AppLoading
        startAsync={this._loadStuff}
        onFinish={() => this._checkSession()}
        onError={console.warn}
      />
    )
  }
}

export default LoadingScene
