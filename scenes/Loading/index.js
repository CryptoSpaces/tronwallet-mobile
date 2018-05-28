import React, { Component } from 'react'
import { AppLoading, Font } from 'expo'

class LoadingScene extends Component {
  _loadStuff = async () => {
    await Font.loadAsync({
      'rubik-black': require('../../assets/fonts/Rubik-Black.ttf'),
      'rubik-bold': require('../../assets/fonts/Rubik-Bold.ttf'),
      'rubik-medium': require('../../assets/fonts/Rubik-Medium.ttf'),
      'rubik-regular': require('../../assets/fonts/Rubik-Regular.ttf'),
      'rubik-light': require('../../assets/fonts/Rubik-Light.ttf')
    })
  }

  render () {
    return (
      <AppLoading
        startAsync={this._loadStuff}
        onFinish={() => this.props.navigation.navigate('Tokens')}
        onError={console.warn}
      />
    )
  }
}

export default LoadingScene
