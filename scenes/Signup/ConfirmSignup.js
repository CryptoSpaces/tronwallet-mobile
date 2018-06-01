import React, { Component } from 'react'
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView } from 'react-native'
import { Auth } from 'aws-amplify'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StackActions, NavigationActions } from 'react-navigation'
import Toast from 'react-native-easy-toast'

import ButtonGradient from '../../components/ButtonGradient'
import * as Utils from '../../components/Utils'
import { Colors, Spacing } from '../../components/DesignSystem'

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

    const username = navigation.getParam('username')
    const password = navigation.getParam('password')

    this.setState({ loadingConfirm: true })
    try {
      await Auth.confirmSignUp(username, code)
      await Auth.signIn(username, password)
      this.setState({ loadingConfirm: false })
      const confirmSignAndLogin = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'SetPublicKey' })],
        key: null
      })
      navigation.dispatch(confirmSignAndLogin)
    } catch (error) {
      if (error.code === 'NotAuthorizedException') {
        this.setState({ loadingConfirm: false })
        this.refs.toast.show('Email confirmed but credentials failed. Redirecting...')
        setTimeout(() => navigation.navigate('Login'), 2000)
        return
      }
      this.setState({ confirmError: error.message, loadingConfirm: false })
    }
  }

  renderSubmitButton = () => {
    const { loadingConfirm } = this.state

    if (loadingConfirm) {
      return (
        <Utils.Content height={80} justify='center' align='center'>
          <ActivityIndicator size='small' color={Colors.primaryText} />
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
        // behavior='padding'
        // keyboardVerticalOffset={150}
        style={{ flex: 1, backgroundColor: Colors.background }}
        enabled
      >
        <KeyboardAwareScrollView>
          <Utils.StatusBar />
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
              {this.renderSubmitButton()}
            </Utils.Content>
            <Utils.Error>{confirmError}</Utils.Error>
            <Utils.Content justify='center' align='center'>
              <Utils.Text
                onPress={() => this.props.navigation.navigate('Login')}
                size='small'
                font='light'
                secondary
              >
                Go back
              </Utils.Text>
            </Utils.Content>
          </Utils.Container>
        </KeyboardAwareScrollView>
        <Toast
          ref='toast'
          position='center'
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
      </KeyboardAvoidingView>
    )
  }
}

export default SignupScene
