import React, { Component } from 'react'
import { ActivityIndicator, Image, Keyboard } from 'react-native'
import * as Utils from '../../components/Utils'
import { Auth } from 'aws-amplify'
import { Colors, Spacing } from '../../components/DesignSystem'
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
    Keyboard.dismiss()

    const email = navigation.getParam('email')
    this.setState({ loadingConfirm: true })
    try {
      await Auth.confirmSignUp(email, code)
      this.setState(
        {
          loadingConfirm: false
        },
        () => navigation.navigate('Login')
      )
    } catch (error) {
      this.setState({ confirmError: error.message, loadingConfirm: false })
    }
  }

  renderSubmitButton = () => {
    const { loadingConfirm } = this.state

    if (loadingConfirm) {
      return (
        <Utils.Content height={80} justify='center' align='center'>
          <ActivityIndicator size='small' color={Colors.yellow} />
        </Utils.Content>
      )
    }

    return (
      <ButtonGradient
        onPress={this.confirmSignup}
        text='CONFIRM SIGN UP'
        size='medium'
      />
    )
  }

  render () {
    const { confirmError } = this.state
    return (
      <KeyboardAvoidingView 
        behavior='padding'
        keyboardVerticalOffset={150}
        style={{ flex: 1, backgroundColor: Colors.background }}
        enabled
      >
      <ScrollView>
      <Utils.Container
        keyboardShouldPersistTaps={'always'}
        keyboardDismissMode='interactive'
      >
        <Utils.Content height={80} justify='center' align='center'>
          <Image source={require('../../assets/login-circle.png')} />
        </Utils.Content>
        <Utils.Content>
          <Utils.Text size='xsmall' secondary>
            EMAIL VERIFICATION CODE
          </Utils.Text>
          <Utils.FormInput
            keyboardType='numeric'
            onChangeText={text => this.changeInput(text, 'code')}
            onSubmitEditing={this.confirmSignup}
            returnKeyType={'send'}
            padding={Spacing.medium}
          />
          <Utils.Text size='xsmall'>
            We sent you an email with the verification code from
            no-reply@verificationemail.com, please check your spam if you didn't
            find it.
          </Utils.Text>
          <Utils.InputError>{confirmError}</Utils.InputError>

          {this.renderSubmitButton()}
        </Utils.Content>

        <Utils.Content justify='center' align='center'>
          <Utils.Error>{confirmError}</Utils.Error>
          <Utils.Text
            onPress={() => this.props.navigation.goBack()}
            size='small'
            font='light'
            secondary
          >
            Back to Sign Up
          </Utils.Text>
        </Utils.Content>
      </Utils.Container>
      </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

export default SignupScene
