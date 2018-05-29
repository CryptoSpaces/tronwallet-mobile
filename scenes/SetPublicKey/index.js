import React, { Component } from 'react'
import { ActivityIndicator, Image, TouchableOpacity, Linking } from 'react-native'
// import Toast from 'react-native-easy-toast'

import { Colors } from '../../components/DesignSystem'
import * as Utils from '../../components/Utils'
import PasteInput from '../../components/PasteInput'
import ButtonGradient from '../../components/ButtonGradient'
import { isAddressValid } from '../../src/services/address'
import Client from '../../src/services/client'
import tronLogo from '../../assets/tron-logo-small.png'

export default class SetPkScene extends Component {
    state = {
      userPublicKey: null,
      loading: false,
      error: null
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
        const url = `tronvault://tronvault/auth`
        const supported = await Linking.canOpenURL(url)
        if (supported) {
          await Linking.openURL(url)
          this.setState({ loading: false })
        } else {
          this.setState({ loading: false }, () => {
            this.props.navigation.navigate('GetVault')
          })
        }
      } catch (error) {
        this.setState({ error: error.message, loading: false })
      }
    }

    goBackLogin = () => this.props.navigation.navigate('Login');

    renderButtonOptions = () => {
      return <React.Fragment>
        <ButtonGradient text='CONFIRM PUBLIC KEY' onPress={this.confirmPublicKey} />
        <Utils.VerticalSpacer size='large' />
        <TouchableOpacity style={{
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: 5,
          borderWidth: 0.8,
          flexDirection: 'row',
          borderRadius: 5,
          borderColor: Colors.secondaryText
        }} onPress={this.getKeyFromVault}>
          <Utils.Text font='light'>FETCH KEY FROM TRON VAULT</Utils.Text>
          <Image style={{ width: 40, height: 40 }} source={tronLogo} />
        </TouchableOpacity>
      </React.Fragment>
    }

    renderLoadingView = () => (
      <Utils.Content height={80} justify='center' align='center'>
        <ActivityIndicator size='small' color={Colors.yellow} />
      </Utils.Content>
    )
    render () {
      const { userPublicKey, loading, error } = this.state

      return (
        <Utils.Container>
          <Utils.StatusBar />
          <Utils.Content>
            <Utils.Text>You need to set your public key before continue</Utils.Text>
            <PasteInput
              value={userPublicKey}
              field='userPublicKey'
              onChangeText={(userPublicKey) => this.setState({ userPublicKey })}
            />
            {loading && this.renderLoadingView()}
            <Utils.VerticalSpacer size='medium' />
            {!loading && this.renderButtonOptions()}
            <Utils.VerticalSpacer size='medium' />
            {error && <Utils.Error>{error}</Utils.Error>}
          </Utils.Content>
          <Utils.Content align='center'>
            <Utils.Text onPress={this.goBackLogin} size='small' font='light' secondary>Back to Login</Utils.Text>
          </Utils.Content>
        </Utils.Container>
      )
    }
}
