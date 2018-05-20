import React, { Component } from 'react'
import { TouchableOpacity, Text, TextInput, ActivityIndicator } from 'react-native'
import * as Utils from '../../components/Utils'
import { Auth } from 'aws-amplify'
import { Colors } from '../../components/DesignSystem'

class LoginScene extends Component {
  state = {
    email: '',
    password: '',
    signError: null

  }

  changeInput = (text, field) => {
    this.setState({
      [field]: text
    })
  }
  signIn = async () => {
    const { navigation } = this.props
    const { email, password } = this.state
    this.setState({ loadingSign: true })
    try {
      const user = await Auth.signIn(email, password)
      // navigate to !
      navigation.navigate('ConfirmLogin', { user })
      this.setState({ signError: null, loadingSign: false })
    } catch (error) {
      if (error.code === 'UserNotConfirmedException') {
        navigation.navigate('ConfirmSignup', { email: email })
        this.setState({ loadingSign: false })
        return
      }
      this.setState({ signError: error.message, loadingSign: false })
    }
  }
  render () {
    const { signError, loadingSign } = this.state
    const ChangedPassword = this.props.navigation.getParam('changedPassword')
    return (
      <Utils.Container>
        <Utils.Text>Login Scene</Utils.Text>
        <Utils.Container>
          <Utils.Text size='xsmall' secondary>Email</Utils.Text>
          <TextInput style={{ color: 'white', fontSize: 30 }} keyboardType='email-address' onChangeText={(text) => this.changeInput(text, 'email')} />
          <Utils.Text size='xsmall' secondary>Password</Utils.Text>
          <TextInput style={{ color: 'white', fontSize: 30 }} secureTextEntry onChangeText={(text) => this.changeInput(text, 'password')} />
        </Utils.Container>

        {loadingSign ? <ActivityIndicator size='small' color={Colors.yellow} />
          : <TouchableOpacity onPress={this.signIn}>
            <Utils.Text size='small'>LOGIN</Utils.Text>
          </TouchableOpacity>}
        <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
          <Utils.Text size='small'>Forgot Password</Utils.Text>
        </TouchableOpacity>
        <Text style={{ color: 'red', fontSize: 30 }}>{signError}</Text>
        {ChangedPassword && <Text style={{ color: 'green', fontSize: 22 }}>Password Changed</Text>}
      </Utils.Container >
    )
  }
}

export default LoginScene
