import React, { Component } from 'react'
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native'
import { Auth } from 'aws-amplify'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import * as Utils from '../../components/Utils'
import Input from '../../components/Input/Input'
import { Colors } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'

class SignupScene extends Component {
  state = {
    email: '',
    password: '',
    username: '',
    signError: null,
    loadingSign: false
  }

  changeInput = (text, field) => {
    this.setState({
      [field]: text
    })
  }

  signUp = async () => {
    const { email, password, username } = this.state
    this.setState({ loadingSign: true, signError: null }, () =>
      Keyboard.dismiss()
    )
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email
        },
        validationData: []
      })
      this.setState(
        {
          signError: null,
          loadingSign: false
        },
        () =>
          this.props.navigation.navigate('ConfirmSignup', {
            username,
            password
          })
      )
    } catch (error) {
      this.setState({ signError: error.message, loadingSign: false })
    }
  }

  _nextInput = target => {
    if (target === 'username') {
      this.email.focus()
      return
    }

    if (target === 'email') {
      this.password.focus()
      return
    }

    if (target === 'password') {
      this.signUp()
    }
  }

  renderSubmitButton = () => {
    const { loadingSign } = this.state

    if (loadingSign) {
      return (
        <Utils.Content height={80} justify='center' align='center'>
          <ActivityIndicator size='small' color={'#ffffff'} />
        </Utils.Content>
      )
    }

    return (
      <ButtonGradient
        text='SIGN UP'
        onPress={this.signIn}
        size='medium'
        marginVertical='large'
        font='bold'
      />
    )
  }

  render () {
    const { signError, username, email, password } = this.state
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: Colors.background }}
        enabled
      >
        <KeyboardAwareScrollView>
          <Utils.StatusBar />
          <Utils.Container
            keyboardShouldPersistTaps={'always'}
            keyboardDismissMode='interactive'
          >
            <Utils.Content justify='center' align='center'>
              <Utils.VerticalSpacer size='medium' />
              <Image source={require('../../assets/login-circle.png')} />
              <Utils.VerticalSpacer size='small' />
            </Utils.Content>
            <Utils.FormGroup>
              <Input
                innerRef={(input) => { this.username = input }}
                label='USERNAME'
                keyboardType='email-address'
                placeholder='John Doe'
                value={username}
                onChangeText={text => this.changeInput(text, 'username')}
                onSubmitEditing={() => this._nextInput('username')}
                returnKeyType='next'
                autoCapitalize='none'
              />
              <Input
                innerRef={(input) => { this.email = input }}
                label='EMAIL'
                keyboardType='email-address'
                placeholder='johndoe@yourdomain.com'
                value={email}
                onChangeText={text => this.changeInput(text, 'email')}
                onSubmitEditing={() => this._nextInput('email')}
                returnKeyType='next'
                autoCapitalize='none'
              />
              <Input
                innerRef={(input) => { this.password = input }}
                label='PASSWORD'
                secureTextEntry
                placeholder='.........'
                letterSpacing={4}
                value={password}
                onChangeText={text => this.changeInput(text, 'password')}
                onSubmitEditing={() => this._nextInput('password')}
                returnKeyType='send'
                autoCapitalize='none'
              />
              <Utils.Text size='xsmall' secondary>
                Password must be at least 8 characters in length, contain at
                least one uppercase, lowercase letters, special characters and
                numbers
              </Utils.Text>
              <Utils.VerticalSpacer size='medium' />
              {this.renderSubmitButton()}
            </Utils.FormGroup>
            <Utils.Error>{signError}</Utils.Error>
            <Utils.Content justify='center' align='center' />
          </Utils.Container>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    )
  }
}

export default SignupScene
