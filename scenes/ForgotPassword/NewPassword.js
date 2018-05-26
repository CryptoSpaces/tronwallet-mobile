import React, { Component } from 'react'
import { ActivityIndicator, Image } from 'react-native'
import * as Utils from '../../components/Utils'
import { Auth } from 'aws-amplify'
import { Colors } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'

class ConfirmNewPassword extends Component {
  state = {
    email: '',
    code: '',
    newPassword: '',
    forgotError: null,
    loadingForgot: false

  }

  changeInput = (text, field) => {
    this.setState({
      [field]: text
    })
  }
  submitNewPassword = async () => {
    const { code, newPassword } = this.state
    const email = this.props.navigation.getParam('email')

    this.setState({ loadingForgot: true })
    try {
      await Auth.forgotPasswordSubmit(email, code, newPassword)
      this.setState({ loadingForgot: false })
      this.props.navigation.navigate('Login', { changedPassword: true })
      this.setState({ loadingForgot: false })
    } catch (error) {
      let message = error.message
      this.setState({ forgotError: message, loadingForgot: false })
    }
  }
  render () {
    const { forgotError, loadingForgot } = this.state
    return (
      <Utils.Container>
        <Utils.Content height={80} justify='center' align='center'>
          <Image source={require('../../assets/login-circle.png')} />
        </Utils.Content>
        <Utils.Content>
          <Utils.Text size='xsmall'>We sent you an email, please submit the code with the new password</Utils.Text>
          <Utils.VerticalSpacer size='small' />
          <Utils.Text size='xsmall' secondary>Code</Utils.Text>
          <Utils.FormInput keyboardType='email-address' onChangeText={(text) => this.changeInput(text, 'code')} />
          <Utils.Text size='xsmall' secondary>New Password</Utils.Text>
          <Utils.FormInput letterSpacing={10} secureTextEntry keyboardType='numeric' onChangeText={(text) => this.changeInput(text, 'newPassword')} />
          {loadingForgot
            ? <ActivityIndicator size='small' color={Colors.yellow} />
            : <ButtonGradient text='Confirm new Password' size='small' onPress={this.submitNewPassword} />
          }
        </Utils.Content>
        <Utils.Content justify='center' align='center'>
          <Utils.Error>{forgotError}</Utils.Error>
          <Utils.Text s onPress={() => this.props.navigation.navigate('Login')} size='small' font='light' secondary>Back to Login</Utils.Text>
        </Utils.Content>
      </Utils.Container>
    )
  }
}

export default ConfirmNewPassword
