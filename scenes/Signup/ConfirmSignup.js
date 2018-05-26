import React, { Component } from 'react'
import { ActivityIndicator, Image } from 'react-native'
import * as Utils from '../../components/Utils'
import { Auth } from 'aws-amplify'
import { Colors } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'

class SignupScene extends Component {
  state = {
    code: '',
    confirmError: null,
    loadingConfirm: false

  }

  changeInput = (text, field) => {
    this.setState({
      [field]: text
    })
  }
  confirmSignup = async () => {
    const { code } = this.state
    const { navigation } = this.props
    const email = navigation.getParam('email')
    this.setState({ loadingConfirm: true })
    try {
      await Auth.confirmSignUp(email, code)
      navigation.navigate('Login')
      this.setState({ loadingConfirm: false })
    } catch (error) {
      this.setState({ confirmError: error.message, loadingConfirm: false })
    }
  }
  render () {
    const { confirmError, loadingConfirm } = this.state
    return (
      <Utils.Container>
        <Utils.Content height={80} justify='center' align='center'>
          <Image source={require('../../assets/login-circle.png')} />
        </Utils.Content>
        <Utils.Content>
          <Utils.Text size='xsmall' secondary>Code</Utils.Text>
          <Utils.FormInput keyboardType='numeric' onChangeText={(text) => this.changeInput(text, 'code')} />
          <Utils.Text size='xsmall'>We sent you a verification code, please submit it</Utils.Text>
          <Utils.InputError>{confirmError}</Utils.InputError>
          {loadingConfirm
            ? <ActivityIndicator size='small' color={Colors.yellow} />
            : <ButtonGradient onPress={this.confirmSignup} text='Confirm Sign Up' size='small' />
          }
        </Utils.Content>
        <Utils.Content justify='center' align='center'>
          <Utils.Error>{confirmError}</Utils.Error>
          <Utils.Text onPress={() => this.props.navigation.goBack()} size='small' font='light' secondary>Back to Sign Up</Utils.Text>
        </Utils.Content>
      </Utils.Container>
    )
  }
}

export default SignupScene
