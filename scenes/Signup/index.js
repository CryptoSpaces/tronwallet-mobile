import React, { Component } from 'react'
import {
  ActivityIndicator,
  Image,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native'
import * as Utils from '../../components/Utils'
import { Auth } from 'aws-amplify'
import { Colors, Spacing } from '../../components/DesignSystem'
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
        username: email,
        password,
        attributes: {
          email,
          nickname: username
        },
        validationData: []
      })
      this.setState(
        {
          signError: null,
          loadingSign: false
        },
        () => this.props.navigation.navigate('ConfirmSignup', { email })
      )
    } catch (error) {
      this.setState({ signError: error.message, loadingSign: false })
    }
  }

  _nextInput = target => {
    if (target === 'username') {
      this.email.focus();
      return
    }

    if (target === 'email') {
      this.password.focus();
      return
    }

    if (target === 'password') {
      this.signUp();
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

    return (<ButtonGradient text='SIGN UP' onPress={this.signUp} size='small' />)
  }

  render () {
    const { signError } = this.state
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

          <Utils.Content justify='center' align='center'>
            <Utils.VerticalSpacer size='medium' />
            <Image source={require('../../assets/login-circle.png')} />
            <Utils.VerticalSpacer size='small' />
            <Utils.Text size='medium'>
              TRONWALLET
            </Utils.Text>
          </Utils.Content>

          <Utils.FormGroup>
            <Utils.Text size='xsmall' secondary>
              NAME
            </Utils.Text>
            <Utils.FormInput
              innerRef={ref => {
                this.username = ref
              }}
              underlineColorAndroid='transparent'
              marginBottom={20}
              onChangeText={text => this.changeInput(text, 'username')}
              onSubmitEditing={() => this._nextInput('username')}
              returnKeyType={'next'}
              padding={Spacing.small}
            />

            <Utils.Text size='xsmall' secondary>
              E-MAIL
            </Utils.Text>
            <Utils.FormInput
              innerRef={ref => {
                this.email = ref
              }}
              keyboardType='email-address'
              underlineColorAndroid='transparent'
              marginBottom={20}
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={text => this.changeInput(text, 'email')}
              onSubmitEditing={() => this._nextInput('email')}
              returnKeyType={'next'}
              padding={Spacing.small}
            />

            <Utils.Text size='xsmall' secondary>
              PASSWORD
            </Utils.Text>
            <Utils.FormInput
              innerRef={ref => {
                this.password = ref
              }}
              letterSpacing={10}
              marginBottom={20}
              underlineColorAndroid='transparent'
              secureTextEntry
              onChangeText={text => this.changeInput(text, 'password')}
              onSubmitEditing={() => this._nextInput('password')}
              returnKeyType={'send'}
              padding={Spacing.small}
            />

            {this.renderSubmitButton()}
          </Utils.FormGroup>

          <Utils.Content justify='center' align='center'>
            <Utils.Error>{signError}</Utils.Error>
            <Utils.Text
              onPress={() => this.props.navigation.navigate('ForgotPassword')}
              size='small'
              font='light'
              secondary
            >
              PRIVACY POLICY
            </Utils.Text>
          </Utils.Content>
        </Utils.Container>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

export default SignupScene
