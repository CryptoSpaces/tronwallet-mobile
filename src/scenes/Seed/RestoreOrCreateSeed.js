import React from 'react'
import { ActivityIndicator, Alert, SafeAreaView } from 'react-native'

import * as Utils from '../../components/Utils'
import ButtonGradient from '../../components/ButtonGradient'
import { Colors } from '../../components/DesignSystem'

import { createUserKeyPair } from '../../utils/secretsUtils'

class RestoreOrCreateSeed extends React.Component {
  static navigationOptions = () => {
    return {
      header: (
        <SafeAreaView style={{backgroundColor: Colors.background}}>
          <Utils.Header background={Colors.background} noBorder>
            <Utils.Title paddingLeft='large'>My Wallet</Utils.Title>
          </Utils.Header>
        </SafeAreaView>
      )
    }
  }

  state = {
    loading: false
  }

  _createKeyPair = async () => {
    await createUserKeyPair()
    Alert.alert(
      'We created a secret list of words for you. We highly recommend that you write it down on paper to be able to recover it later.'
    )
  }

  _newWallet = async () => {
    this.setState({ loading: true })
    await this._createKeyPair()
    this.setState({ loading: false })
    this.props.navigation.navigate('SeedCreate')
  }

  render () {
    return (
      <Utils.Container>
        <Utils.Content flex={1} justify='flex-start'>
          <Utils.VerticalSpacer />
          <Utils.Text weight='300' font='light' secondary>
            We detected that you have used our application before, either on
            this device or another. Because your seed password is stored locally
            on your device, we need you to restore your seed to be able to use
            your previous address.
          </Utils.Text>
          <Utils.VerticalSpacer size='medium' />
          {this.state.loading ? (
            <ActivityIndicator color='#ffffff' />
          ) : (
            <ButtonGradient
              onPress={this._newWallet}
              text='CREATE WALLET'
            />
          )}
          <Utils.VerticalSpacer size='large' />
          <Utils.Text font='light' secondary>
            If you don't want to restore that address you can easily get a new
            one by tapping on the button below.
          </Utils.Text>
          <Utils.VerticalSpacer size='medium' />
          <ButtonGradient
            onPress={() => this.props.navigation.navigate('SeedRestore')}
            text='RESTORE WALLET'
          />
        </Utils.Content>
      </Utils.Container>
    )
  }
}

export default RestoreOrCreateSeed
