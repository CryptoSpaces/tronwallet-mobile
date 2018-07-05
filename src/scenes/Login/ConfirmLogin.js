import React, { Component } from 'react'
import { ActivityIndicator, Image, KeyboardAvoidingView } from 'react-native'
import { Auth } from 'aws-amplify'
import Toast from 'react-native-easy-toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StackActions, NavigationActions } from 'react-navigation'

import { Colors, Spacing } from '../../components/DesignSystem'
import * as Utils from '../../components/Utils'
import ButtonGradient from '../../components/ButtonGradient'

import { createUserKeyPair, getUserSecrets } from '../../utils/secretsUtils'
import { checkPublicKeyReusability } from '../../utils/userAccountUtils'

class ConfirmLogin extends Component {
  state = {
    totpCode: null,
    user: {},
    code: null,
    confirmError: null,
    loadingConfirm: false,
    loadingData: true,
    userPublicKey: null
  }

  componentDidMount() {
    this.loadUserData()
  }

  loadUserData = async () => {
    try {
      const user = this.props.navigation.getParam('user')
      let totpCode = null
      if (user.challengeParam.MFAS_CAN_SETUP) {
        totpCode = await Auth.setupTOTP(user)
      }
      this.setState({ user, totpCode })
    } catch (error) {
      this.setState({ confirmError: error.message })
    }
  }

  goBackLogin = () => this.props.navigation.navigate('Login')

  navigateToHome = () => {
    const { navigation } = this.props
    this.setState({ loadingConfirm: false, confirmError: null },
      () => {
        const signToApp = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'App' })],
          key: null
        })
        navigation.dispatch(signToApp)
      }
    )
  }

  changeInput = (text, field) => {
    this.setState({
      [field]: text,
      confirmError: null
    })
  }

  createKeyPair = async () => {
    await createUserKeyPair()
    alert("We created a mnemonic for you. You can confirm that or change it in the settings.")
  }

  confirmLogin = async () => {
    const { totpCode, user, code } = this.state
    const { navigation } = this.props
    this.setState({ loadingConfirm: true, confirmError: null })
    try {
      totpCode
        ? await Auth.verifyTotpToken(user, code)
        : await Auth.confirmSignIn(user, code, 'SOFTWARE_TOKEN_MFA')

      try {
        const isAddressReusable = await checkPublicKeyReusability()
        if (!isAddressReusable) {
          //Here, we navigate to the Options page (restore or create)
          await this.createKeyPair()
        }
        this.navigateToHome()
      } catch (err) {
        console.warn(err)
        await Auth.signOut()
        this.setState({ confirmError: 'Oops. Login failed, try again', loadingConfirm: false })
      }
    } catch (error) {
      let message = error.message

      if (error.code === 'NotAuthorizedException') {
        this.setState({ confirmError: message, loadingConfirm: false }, () => {
          navigation.navigate('Login', { totpError: true })
        })
        return
      }

      if (error.code === 'EnableSoftwareTokenMFAException') {
        message = 'Wrong code. Try set up your athenticator again with the code above'
      }

      this.setState({ confirmError: message, loadingConfirm: false })
    }
  }
  render() {
    const { confirmError, loadingConfirm } = this.state
    return (
      <KeyboardAvoidingView
        // behavior='padding'
        // keyboardVerticalOffset={150}
        style={{ flex: 1, backgroundColor: Colors.background }}
        enabled
      >
        <KeyboardAwareScrollView>
          <Utils.StatusBar />
          <Utils.Container>
            <Utils.Content height={80} justify='center' align='center'>
              <Image source={require('../../assets/login-circle.png')} />
            </Utils.Content>
            <Utils.Content>
              <Utils.Text size='xsmall' secondary>
                PASTE GOOGLE AUTHENTICATOR CODE HERE
              </Utils.Text>
              <Utils.FormInput
                padding={Spacing.small}
                underlineColorAndroid='transparent'
                onSubmitEditing={this.confirmLogin}
                onChangeText={text => this.changeInput(text, 'code')}
              />
              {loadingConfirm ? (
                <Utils.Content height={80} justify='center' align='center'>
                  <ActivityIndicator size='small' color={Colors.primaryText} />
                </Utils.Content>)
                : (<ButtonGradient text='CONFIRM LOGIN' onPress={this.confirmLogin} size='medium' />)
              }
            </Utils.Content>
            <Utils.Error>{confirmError}</Utils.Error>
            <Utils.Content justify='center' align='center'>
              <Utils.Text
                size='small'
                font='light'
                secondary
                onPress={this.goBackLogin}
              >
                Back to Login
              </Utils.Text>
            </Utils.Content>
            <Toast
              ref='toast'
              position='center'
              fadeInDuration={750}
              fadeOutDuration={1000}
              opacity={0.8}
            />
          </Utils.Container>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    )
  }
}

export default ConfirmLogin