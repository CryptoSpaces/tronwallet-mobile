import React, { Component } from 'react'
import { ActivityIndicator, Image } from 'react-native'
import * as Utils from '../../components/Utils'
import { Auth } from 'aws-amplify'
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
    this.setState({ loadingSign: true })
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
      this.setState({ signError: null, loadingSign: false })
      this.props.navigation.navigate('ConfirmSignup')
    } catch (error) {
      this.setState({ signError: error.message, loadingSign: false })
    }
  }
  render () {
    const { signError, loadingSign } = this.state
    return (
      <Utils.Container>
        <Utils.Content height={80} justify='center' align='center'>
          <Image source={require('../../assets/login-circle.png')} />
        </Utils.Content>
        <Utils.FormGroup>
          <Utils.Text size='xsmall' secondary>Username</Utils.Text>
          <Utils.FormInput keyboardType='email-address' onChangeText={(text) => this.changeInput(text, 'Username')} />
          <Utils.Text size='xsmall' secondary>Email</Utils.Text>
          <Utils.FormInput keyboardType='email-address' onChangeText={(text) => this.changeInput(text, 'email')} />
          <Utils.Text size='xsmall' secondary>Password</Utils.Text>
          <Utils.FormInput letterSpacing={10} secureTextEntry onChangeText={(text) => this.changeInput(text, 'password')} />
          {loadingSign ? <ActivityIndicator size='small' color={Colors.yellow} />
            : <ButtonGradient text='SIGN UP' onPress={this.signUp} />}
        </Utils.FormGroup>
        <Utils.Content justify='center' align='center'>
          <Utils.Error>{signError}</Utils.Error>
          <Utils.Text onPress={() => this.props.navigation.navigate('ForgotPassword')} size='small' font='light' secondary>PRIVACY POLICY</Utils.Text>
        </Utils.Content>
      </Utils.Container>
    )
  }
}

export default SignupScene
