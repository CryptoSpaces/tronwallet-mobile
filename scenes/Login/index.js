import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import * as Utils from '../../components/Utils'

class LoginScene extends Component {
  render () {
    return (
      <Utils.Container>
        <Utils.Text>Login Scene</Utils.Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('App')}>
          <Utils.Text>LOGIN</Utils.Text>
        </TouchableOpacity>
      </Utils.Container>
    )
  }
}

export default LoginScene
