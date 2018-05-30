import React, { Component } from 'react'
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView } from 'react-native'
import { Auth } from 'aws-amplify'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'

class LoginScene extends Component {
  state = {
    email: '',
    password: '',
    signError: null
  }

  changeInput = (text, field) => {
    this.setState({
      [field]: text,
      signError: null
    })
  }

  signIn = async () => {
    const { navigation } = this.props
    const { email, password } = this.state
    Keyboard.dismiss()

    this.setState({ loadingSign: true, signError: null })

    try {
      const user = await Auth.signIn(email, password)
      console.log('login ==>', user)
      navigation.navigate('ConfirmLogin', { user })
      this.setState({ signError: null, loadingSign: false })
    } catch (error) {
      if (error.code === 'UserNotConfirmedException') {
        navigation.navigate('ConfirmSignup', { email })
        this.setState({ loadingSign: false })
        return
      }
      if (error && error.message) {
        this.setState({ signError: error.message, loadingSign: false })
      } else {
        this.setState({ signError: error, loadingSign: false })
      }
    }
  }

  _submit = (target) => {
    const { email, password } = this.state

    if (target === 'email' && !password) {
      this.password.focus()
      return
    }

    if (target === 'password' && !email) {
      this.email.focus()
      return
    }

    if (email && password) {
      return this.signIn()
    }
  }

  renderSubmitButton = () => {
    const { loadingSign } = this.state

    if (loadingSign) {
      return (
        <Utils.Content height={80} justify='center' align='center'>
          <ActivityIndicator size='small' color={Colors.yellow} />
        </Utils.Content>
      )
    }

    return (<ButtonGradient text='SIGN IN' onPress={this.signIn} size='medium' />)
  }

  render () {
    const { signError } = this.state
    const ChangedPassword = this.props.navigation.getParam('changedPassword')
    return (
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
        <Utils.Container
          keyboardShouldPersistTaps={'always'}
          keyboardDismissMode='interactive'
        >
          <Utils.Content height={80} justify='center' align='center'>
            <Image source={require('../../assets/login-circle.png')} />
          </Utils.Content>
          <Utils.VerticalSpacer size='large' />
          <Utils.FormGroup>
            <Utils.Text size='xsmall' secondary>E-MAIL</Utils.Text>
            <Utils.FormInput
              innerRef={ref => { this.email = ref }}
              underlineColorAndroid='transparent'
              keyboardType='email-address'
              marginBottom={40}
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={(text) => this.changeInput(text, 'email')}
              onSubmitEditing={() => this._submit('email')}
              returnKeyType={'next'}
            />
            <Utils.Text size='xsmall' secondary>PASSWORD</Utils.Text>
            <Utils.FormInput
              innerRef={ref => { this.password = ref }}
              underlineColorAndroid='transparent'
              secureTextEntry
              letterSpacing={10}
              onChangeText={(text) => this.changeInput(text, 'password')}
              onSubmitEditing={() => this._submit('password')}
              returnKeyType='send'
            />
            {this.renderSubmitButton()}
          </Utils.FormGroup>
          <Utils.Content justify='center' align='center'>
            {ChangedPassword && <Utils.Text size='small' success>Password Changed</Utils.Text>}
            <Utils.Error>{signError}</Utils.Error>
            <Utils.Text
              onPress={() => this.props.navigation.navigate('ForgotPassword')}
              size='small'
              font='light'
              secondary
            >
              FORGOT PASSWORD ?
            </Utils.Text>
          </Utils.Content>
        </Utils.Container>
      </KeyboardAvoidingView>
    )
  }
}

export default LoginScene
