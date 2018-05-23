import React, { Component } from 'react'
import { TouchableOpacity, ActivityIndicator, Clipboard, Image } from 'react-native'
import { Auth } from 'aws-amplify'
import { Colors } from '../../components/DesignSystem'
import * as Utils from '../../components/Utils'
import ButtonGradient from '../../components/ButtonGradient'

class ConfirmLogin extends Component {
  state = {
    totpCode: null,
    user: {},
    code: null,
    confirmError: null,
    loadingConfirm: false,
    loadingData: true
  }

  componentDidMount () {
    this.loadUserData()
  }

  changeInput = (text, field) => {
    this.setState({
      [field]: text
    })
  }

  confirmLogin = async () => {
    const { totpCode, user, code } = this.state
    this.setState({ loadingConfirm: true })
    try {
      totpCode ? await Auth.verifyTotpToken(user, code) : await Auth.confirmSignIn(user, code, 'SOFTWARE_TOKEN_MFA')
      this.setState({ loadingConfirm: false, confirmError: null })
      this.props.navigation.navigate('App')
    } catch (error) {
      let message = error.message
      if (error.code === 'EnableSoftwareTokenMFAException') {
        message = 'Wrong code. Try set up your athenticator again with the code above'
      }
      this.setState({ confirmError: message, loadingConfirm: false })
    }
  }

  copyClipboard = async () => {
    const { totpCode } = this.state
    await Clipboard.setString(totpCode)
    // alert('Copied to clipboard')
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

  render () {
    const { confirmError, loadingConfirm, totpCode } = this.state
    return (
      <Utils.Container>
        <Utils.Content height={80} justify='center' align='center'>
          <Image source={require('../../assets/login-circle.png')} />
        </Utils.Content>
        <Utils.Content>
          <Utils.Text size='xsmall' secondary>Authenticator Code</Utils.Text>
          <Utils.FormInput underlineColorAndroid='transparent' onChangeText={(text) => this.changeInput(text, 'code')} />
          {totpCode &&
            <React.Fragment>
              <Utils.Text size='small' secondary>TOTP Secret</Utils.Text>
              <Utils.Text size='xsmall'>You need to link your account with some TOTP authenticator. We recomend Google Authenticator. Click To copy</Utils.Text>
              <TouchableOpacity onPress={this.copyClipboard}>
                <Utils.FormInput multiline value={totpCode} editable={false} />
              </TouchableOpacity>
            </React.Fragment>}
          {loadingConfirm ? <ActivityIndicator size='small' color={Colors.yellow} />
            : <ButtonGradient text='Confirm Login' onPress={this.confirmLogin} />}
        </Utils.Content>
        <Utils.Content justify='center' align='center'>
          <Utils.Error>{confirmError}</Utils.Error>
          <Utils.Text onPress={() => this.props.navigation.goBack()} size='small' font='light' secondary>Back to Login</Utils.Text>
        </Utils.Content>
      </Utils.Container>
    )
  }
}

export default ConfirmLogin
