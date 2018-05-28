import React, { Component } from 'react'
import { ActivityIndicator, Image } from 'react-native'
import * as Utils from '../../components/Utils'
import { Auth } from 'aws-amplify'
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
        <Utils.Content height={80} justify='center' align='center'>
          <Image source={require('../../assets/login-circle.png')} />
        </Utils.Content>
        <Utils.VerticalSpacer size='small' />
        <Utils.Content>
          <Utils.Text size='xsmall' secondary>E-MAIL</Utils.Text>
          <Utils.FormInput underlineColorAndroid='transparent' keyboardType='email-address' onChangeText={(text) => this.changeInput(text, 'email')} />
          <Utils.Text size='xsmall' secondary>Password</Utils.Text>
          <Utils.FormInput underlineColorAndroid='transparent' secureTextEntry letterSpacing={10} onChangeText={(text) => this.changeInput(text, 'password')} />
          {loadingSign ? <ActivityIndicator size='small' color={Colors.yellow} />
            : <ButtonGradient text='SIGN IN' onPress={this.signIn} />}
        </Utils.Content>
        <Utils.Content justify='center' align='center'>
          {ChangedPassword && <Utils.Text size='small' success>Password Changed</Utils.Text>}
          <Utils.Error>{signError}</Utils.Error>
          <Utils.Text onPress={() => this.props.navigation.navigate('ForgotPassword')} size='small' font='light' secondary>FORGOT PASSWORD ?</Utils.Text>
        </Utils.Content>
      </Utils.Container>
    )
  }
}

export default LoginScene
