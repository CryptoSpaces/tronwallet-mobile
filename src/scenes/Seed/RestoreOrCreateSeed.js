import React from 'react'
import { ActivityIndicator } from 'react-native'

import * as Utils from '../../components/Utils'
import ButtonGradient from '../../components/ButtonGradient'
import NavigationHeader from '../../components/Navigation/Header'

import { createUserKeyPair } from '../../utils/secretsUtils'

class RestoreOrCreateSeed extends React.Component {
  static navigationOptions = () => {
    return {
      header: (
        <NavigationHeader
          title='MY WALLET'
        />
      )
    }
  }

  state = {
    loading: false
  }

  _newWallet = async () => {
    this.setState({ loading: true })
    await createUserKeyPair()
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
          <ButtonGradient
            onPress={() => this.props.navigation.navigate('SeedRestore')}
            text='RESTORE WALLET'
          />
          <Utils.VerticalSpacer size='large' />
          <Utils.Text font='light' secondary>
            If you don't want to restore that address you can easily get a new
            one by tapping on the button below.
          </Utils.Text>
          <Utils.VerticalSpacer size='medium' />
          {this.state.loading ? (
            <ActivityIndicator color='#ffffff' />
          ) : (
            <ButtonGradient
              onPress={this._newWallet}
              text='CREATE WALLET'
            />)}
        </Utils.Content>
      </Utils.Container>
    )
  }
}

export default RestoreOrCreateSeed
