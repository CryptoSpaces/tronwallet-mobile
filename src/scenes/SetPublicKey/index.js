import React, { Component } from 'react'
import { ActivityIndicator, TouchableOpacity, Linking } from 'react-native'
import Toast from 'react-native-easy-toast'
import Feather from 'react-native-vector-icons/Feather'
import { Auth } from 'aws-amplify'

import Header from '../../components/Header'
import { Colors } from '../../components/DesignSystem'
import * as Utils from '../../components/Utils'
import PasteInput from '../../components/PasteInput'
import ButtonGradient from '../../components/ButtonGradient'
import { isAddressValid } from '../../services/address'
import Client from '../../services/client'
import qs from 'qs'
import { TronVaultURL, MakeTronMobileURL } from '../../utils/deeplinkUtils'

export default class SetPkScene extends Component {
  state = {
    userPublicKey: null,
    loading: false,
    error: null
  }

  componentWillReceiveProps(nextProps) {
    this._checkDeepLink(nextProps)
  }

  _checkDeepLink = async nextProps => {
    const { navigation } = nextProps

    if (navigation.state.params && navigation.state.params.data) {
      const deepLinkData = qs.parse(navigation.state.params.data)

      if (deepLinkData.action === 'setpk') {
        const userPublicKey = deepLinkData.pk
        this.setState({ userPublicKey }, () => {
          this.refs.toast.show('Public key pasted')
        })
      }
    }
  }

  confirmPublicKey = async () => {
    const { userPublicKey } = this.state
    const { navigation } = this.props
    this.setState({ loading: true, error: null })
    try {
      if (!isAddressValid(userPublicKey)) throw new Error('Address invalid')
      await Client.setUserPk(userPublicKey)
      this.setState({ loading: false }, () => navigation.navigate('App'))
    } catch (error) {
      this.setState({
        error: error.message || error,
        loading: false
      })
    }
  }

  getKeyFromVault = async () => {
    this.setState({ loading: true, error: null })
    try {
      const dataToSend = qs.stringify({
        action: 'getkey',
        URL: MakeTronMobileURL('getkey')
      })

      this.openDeepLink(dataToSend)
    } catch (error) {
      this.setState({ error: error.message, loading: false })
    }
  }

  openDeepLink = async (dataToSend) => {
    try {
      const url = `${TronVaultURL}auth/${dataToSend}`
      await Linking.openURL(url)
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false }, () => {
        this.props.navigation.navigate('GetVault')
      })
    }
  }

  goBackLogin = async () => {
    await Auth.signOut()
    this.props.navigation.navigate('Login')
  }

  renderButtonOptions = () => {
    return <React.Fragment>
      <ButtonGradient text='CONFIRM PUBLIC KEY' onPress={this.confirmPublicKey} size='small' />
      <Utils.VerticalSpacer size='large' />
      <TouchableOpacity style={{
        alignItems: 'center',
        justifyContent: 'space-around',
        marginHorizontal: 5,
        flexDirection: 'row'
      }} onPress={this.getKeyFromVault}>
        <Utils.Text secondary font='light' size='small'>CONNECT TRON VAULT</Utils.Text>
      </TouchableOpacity>
    </React.Fragment>
  }

  renderLoadingView = () => (
    <Utils.Content height={80} justify='center' align='center'>
      <ActivityIndicator size='small' color={Colors.yellow} />
    </Utils.Content>
  )
  render() {
    const { userPublicKey, loading, error } = this.state
    return (
      <Utils.Container>
        <Utils.StatusBar />
        <Header
          leftIcon={<Feather name='x' color={Colors.primaryText} size={24} />}
          onLeftPress={this.goBackLogin}
        />
        <Utils.Content>
          <Utils.Text>
            You need to set your public key before continue
          </Utils.Text>
          <PasteInput
            value={userPublicKey}
            field='userPublicKey'
            onChangeText={userPublicKey => this.setState({ userPublicKey })}
          />
          {loading && this.renderLoadingView()}
          <Utils.VerticalSpacer size='medium' />
          {!loading && this.renderButtonOptions()}
          <Utils.VerticalSpacer size='medium' />
          {error && <Utils.Error>{error}</Utils.Error>}
        </Utils.Content>
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