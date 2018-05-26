import React, { Component } from 'react'
import { TouchableOpacity, ActivityIndicator, Clipboard, Image } from 'react-native'
import { Auth } from 'aws-amplify'
import Modal from 'react-native-modal'
import { Colors } from '../../components/DesignSystem'
import * as Utils from '../../components/Utils'
import ButtonGradient from '../../components/ButtonGradient'
import { isAddressValid } from '../../src/services/address'
import Client from '../../src/services/client'
import PasteInput from '../../components/PasteInput'

class ConfirmLogin extends Component {
  state = {
    totpCode: null,
    user: {},
    code: null,
    confirmError: null,
    loadingConfirm: false,
    loadingData: true,
    modalPkVisible: false,
    userPublicKey: null,
    confirmPkError: null
  }

  componentDidMount () {
    this.loadUserData()
  }

  confirmPublicKey = async () => {
    const { userPublicKey } = this.state
    const { navigation } = this.props
    this.setState({ loadingConfirm: true })
    try {
      if (!isAddressValid(userPublicKey)) throw new Error('Address invalid')
      await Client.setUserPk(userPublicKey)
      this.setState({ loadingConfirm: false })
      navigation.navigate('App')
    } catch (error) {
      this.setState({ confirmError: error.message || error, loadingConfirm: false })
    }
  }

  renderModalPk = () => {
    const { confirmError, loadingConfirm, userPublicKey } = this.state

    return (
      <Utils.Container>
        <Utils.Content>
          <Utils.Text>You need to set your public key before continue</Utils.Text>
          <PasteInput value={userPublicKey} field='userPublicKey' onChangeText={(text) => this.changeInput(text, 'userPublicKey')} />
          <Utils.Error>{confirmError}</Utils.Error>
          {loadingConfirm ? <ActivityIndicator size='small' color={Colors.yellow} />
            : <ButtonGradient text='Confirm Public Key' onPress={this.confirmPublicKey.bind(this)} />}
        </Utils.Content>
        <Utils.Content align='center'>
          <Utils.Text onPress={() => {
            this.setState({ modalPkVisible: false })
            this.props.navigation.navigate('Login')
          }} size='small' font='light' secondary>Back to Login</Utils.Text>
        </Utils.Content>
      </Utils.Container>
    )
  }

  changeInput = (text, field) => {
    this.setState({
      [field]: text
    })
  }

  confirmLogin = async () => {
    const { totpCode, user, code, userPublicKey } = this.state
    this.setState({ loadingConfirm: true })
    try {
      totpCode ? await Auth.verifyTotpToken(user, code) : await Auth.confirmSignIn(user, code, 'SOFTWARE_TOKEN_MFA')

      if (userPublicKey) {
        this.setState({ loadingConfirm: false, confirmError: null })
        this.props.navigation.navigate('App')
      } else {
        this.setState({ modalPkVisible: true, loadingConfirm: false })
      }
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
      const userPubliKey = await Client.getPublicKey()
      const user = this.props.navigation.getParam('user')
      let totpCode = null
      if (user.challengeParam.MFAS_CAN_SETUP) {
        totpCode = await Auth.setupTOTP(user)
      }
      this.setState({ user, totpCode, userPubliKey })
    } catch (error) {
      this.setState({ confirmError: error.message })
    }
  }

  render () {
    const { confirmError, loadingConfirm, totpCode, modalPkVisible } = this.state
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
        <Modal
          isVisible={modalPkVisible}
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
        >
          {this.renderModalPk()}
        </Modal>
      </Utils.Container>
    )
  }
}

export default ConfirmLogin
