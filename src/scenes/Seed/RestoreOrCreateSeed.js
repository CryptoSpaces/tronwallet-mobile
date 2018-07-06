import React from 'react'
import { Image, ActivityIndicator } from 'react-native'

import * as Utils from '../../components/Utils'
import ButtonGradient from '../../components/ButtonGradient'

import { createUserKeyPair } from '../../utils/secretsUtils'
import { resetWalletData } from '../../utils/userAccountUtils'

class RestoreOrCreateSeed extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    loading: false
  }

  _createKeyPair = async () => {
    await createUserKeyPair()
    alert("We created a mnemonic for you. You can confirm that or change it in the settings.")
  }

  _newWallet = async () => {
    this.setState({ loading: true })
    await this._createKeyPair()
    await resetWalletData()
    this.setState({ loading: false })
    this.props.navigation.navigate('SeedCreate')
  }

  render() {
    return (
      <Utils.Container>
        <Utils.Content flex={1} justify='center'>
          <Utils.Row justify='center'>
            <Image source={require('../../assets/login-circle.png')} />
          </Utils.Row>
          <Utils.VerticalSpacer size='large' />
          <Utils.Text light secondary>
            We detected that you have used our application before, either on this device or another.
            Because your seed password is stored locally on your device, we need you to restore your seed to be able
            to use your previous address.
          </Utils.Text>
          <Utils.VerticalSpacer size='medium' />
          {this.state.loading
            ? <ActivityIndicator />
            : <ButtonGradient size='small' onPress={this._newWallet} text="Create a new wallet" />}
          <Utils.VerticalSpacer size='medium' />
          <Utils.Text light secondary>
            If you don't want to restore that address you can easily get a new one
            by tapping on the button below.
          </Utils.Text>
          <Utils.VerticalSpacer size='medium' />
          <ButtonGradient
            size='small'
            onPress={() => this.props.navigation.navigate('RootSeedRestore')}
            text="Restore previous wallet"
          />
        </Utils.Content>
      </Utils.Container>
    )
  }
}

export default RestoreOrCreateSeed
