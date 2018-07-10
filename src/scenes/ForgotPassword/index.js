import React, { Component } from 'react'
import { ActivityIndicator, Image } from 'react-native'
import * as Utils from '../../components/Utils'
import { Auth } from 'aws-amplify'
import { Colors, Spacing } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'

class SignupScene extends Component {
  state = {
    email: '',
    forgotError: null,
    loadingForgot: false
  }

  changeInput = (text, field) => {
    this.setState({
      [field]: text
    })
  }

  forgotPassword = async () => {
    const { email } = this.state
    const { navigation } = this.props
    this.setState({ loadingForgot: true })
    try {
      await Auth.forgotPassword(email)
      this.setState({ loadingForgot: false })

      navigation.navigate('ConfirmNewPassword', { email })
    } catch (error) {
      let message = error.message
      if (error.code === 'UserNotFoundException') {
        message = 'Email not valid'
      }
      this.setState({ forgotError: message, loadingForgot: false })
    }
  }
  render () {
    const { forgotError, loadingForgot } = this.state
    return (
      <Utils.Container>
        <Utils.Content justify='center' align='center'>
          <Utils.VerticalSpacer size='small' />
          <Image source={require('../../assets/login-circle.png')} />
          <Utils.VerticalSpacer size='small' />
          <Utils.Text size='medium'>TRONWALLET</Utils.Text>
        </Utils.Content>
        <Utils.Content>
          <Utils.Text size='xsmall' secondary>
            Change Password
          </Utils.Text>
          <Utils.VerticalSpacer size='medium' />
          <Utils.Text size='xsmall'>
            Provide your email to proceed with the recovery
          </Utils.Text>
          <Utils.FormInput
            autoCorrect={false}
            autoCapitalize='none'
            keyboardType='email-address'
            onChangeText={text => this.changeInput(text, 'email')}
            padding={Spacing.medium}
          />
          {loadingForgot ? (
            <ActivityIndicator size='small' color={Colors.yellow} />
          ) : (
            <ButtonGradient
              text='Change Password'
              onPress={this.forgotPassword}
              size='medium'
            />
          )}
        </Utils.Content>
        <Utils.Content justify='center' align='center'>
          <Utils.Text
            onPress={() => this.props.navigation.goBack()}
            size='small'
            font='light'
            secondary
          >
            Back to Login
          </Utils.Text>
          <Utils.Error>{forgotError}</Utils.Error>
        </Utils.Content>
      </Utils.Container>
    )
  }
}

export default SignupScene
