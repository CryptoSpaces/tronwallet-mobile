import React, { Component } from 'react'
import { ActivityIndicator, Image } from 'react-native'
import { Auth } from 'aws-amplify'
import Modal from 'react-native-modal'
import Toast from 'react-native-easy-toast'

import { Colors } from '../../components/DesignSystem'
import * as Utils from '../../components/Utils'
import ButtonGradient from '../../components/ButtonGradient'
import { isAddressValid } from '../../src/services/address'
import Client from '../../src/services/client'
import PasteInput from '../../components/PasteInput'
import CopyInput from '../../components/CopyInput'

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

  loadUserData = async () => {
    try {
      // const userPubliKey = await Client.getPublicKey()
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

  goBackLogin = () => {
    this.setState({
      modalPkVisible: false
    },
    () => this.props.navigation.navigate('Login'))
  }

  changeInput = (text, field) => {
    this.setState({
      [field]: text
    })
  }

  confirmPublicKey = async () => {
    const { userPublicKey } = this.state
    const { navigation } = this.props
    this.setState({ loadingConfirm: true })
    try {
      if (!isAddressValid(userPublicKey)) throw new Error('Address invalid')
      await Client.setUserPk(userPublicKey)
      this.setState({ loadingConfirm: false, modalPkVisible: false }, () => navigation.navigate('App'))
    } catch (error) {
      this.setState({
        confirmError: error.message || error,
        loadingConfirm: false
      })
    }
  }

  confirmLogin = async () => {
    const { totpCode, user, code } = this.state
    this.setState({ loadingConfirm: true })
    try {
      totpCode ? await Auth.verifyTotpToken(user, code) : await Auth.confirmSignIn(user, code, 'SOFTWARE_TOKEN_MFA')

      const userPublicKey = await Client.getPublicKey()
      if (userPublicKey) {
        this.setState({
          loadingConfirm: false,
          confirmError: null,
          modalPkVisible: false
        },
        () => this.props.navigation.navigate('App')
        )
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

  showToast = (success) => {
    console.log(this.state.totpCode)

    if (success) { this.refs.toast.show('Google Authenticator secret copied to the clipboard') }
  }

  renderModalPk = () => {
    const { confirmError, loadingConfirm, userPublicKey } = this.state

    return (
      <Utils.Container>

        <Utils.Content>
          <Utils.Text>You need to set your public key before continue</Utils.Text>
          <PasteInput
            value={userPublicKey}
            field='userPublicKey'
            onChangeText={(text) => this.changeInput(text, 'userPublicKey')}
          />
          <Utils.Error>{confirmError}</Utils.Error>
          {loadingConfirm
            ? (<Utils.Content height={80} justify='center' align='center'>
              <ActivityIndicator size='small' color={Colors.yellow} />
            </Utils.Content>)
            : (<ButtonGradient text='CONFIRM PUBLIC KEY' onPress={this.confirmPublicKey} />)
          }
        </Utils.Content>

        <Utils.Content align='center'>
          <Utils.Text onPress={this.goBackLogin} size='small' font='light' secondary>Back to Login</Utils.Text>
        </Utils.Content>
      </Utils.Container>
    )
  }

  renderTOTPArea = () => {
    const { totpCode } = this.state
    if (!totpCode) return null

    return (
      <React.Fragment>
        <Utils.Text size='xsmall'>
          For security reasons, you will need to link your account with Google Authenticator, please copy the code below to add to it. After add the code in your Google Authenticator, please copy the six digits code and paste it on the input above.
        </Utils.Text>
        <Utils.VerticalSpacer size='medium' />
        <Utils.Text size='xsmall' secondary>COPY THE CODE TO ADD TO YOUR GOOGLE AUTHENTICATOR</Utils.Text>
        <CopyInput value={totpCode} editable={false} onCopyText={this.showToast} />
        <Utils.VerticalSpacer size='small' />
      </React.Fragment>
    )
  }

  render () {
    const { confirmError, loadingConfirm, modalPkVisible } = this.state
    return (
      <Utils.Container>
        <Utils.Content height={80} justify='center' align='center'>
          <Image source={require('../../assets/login-circle.png')} />
        </Utils.Content>
        <Utils.Content>

          <Utils.Text size='xsmall' secondary>PASTE GOOGLE AUTHENTICATOR CODE HERE</Utils.Text>
          <Utils.FormInput underlineColorAndroid='transparent' onChangeText={(text) => this.changeInput(text, 'code')} />

          {this.renderTOTPArea()}

          {loadingConfirm
            ? (<Utils.Content height={80} justify='center' align='center'>
              <ActivityIndicator size='small' color={Colors.yellow} />
            </Utils.Content>)
            : (<ButtonGradient text='CONFIRM LOGIN' onPress={this.confirmLogin} />)
          }
        </Utils.Content>
        <Utils.Content justify='center' align='center'>
          <Utils.Error>{confirmError}</Utils.Error>
          <Utils.Text size='small' font='light' secondary onPress={this.goBackLogin} > Back to Login </Utils.Text>
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
        <Toast
          ref='toast'
          position='center'
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
        />
      </Utils.Container>
    )
  }
}

export default ConfirmLogin
