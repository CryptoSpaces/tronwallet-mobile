import React from 'react'
import { Alert, Keyboard } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'

import * as Utils from '../../components/Utils'
import ButtonGradient from '../../components/ButtonGradient'
import NavigationHeader from '../../components/Navigation/Header'

import { recoverUserKeypair } from '../../utils/secretsUtils'
import { withContext } from '../../store/context'

class Restore extends React.Component {
  state = {
    seed: '',
    loading: false
  }

  _navigateToSettings = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'App' })],
      key: null
    })
    this.props.navigation.dispatch(resetAction)
  }

  _handleRestore = async () => {
    Alert.alert(
      'Warning',
      'Restore seed will erase all data on this device and pull information from the network for the restored account.',
      [
        { text: 'Cancel' },
        { text: 'OK', onPress: this._restoreWallet }
      ],
      { cancelable: false }
    )
  }

  _restoreWallet = async () => {
    const { updateWalletData } = this.props.context
    const seed = this.state.seed.trim()

    Keyboard.dismiss()
    this.setState({ loading: true })
    try {
      await recoverUserKeypair(this.props.context.pin, seed)
      await updateWalletData()
      Alert.alert('Wallet recovered with success!')
      this.setState({ loading: false }, this._navigateToSettings)
    } catch (err) {
      console.warn(err)
      Alert.alert(
        "Oops. Looks like the words you typed isn't a valid mnemonic seed. Check for a typo and try again."
      )
      this.setState({ loading: false })
    }
  }

  _rightContent = () => (
    <Utils.ButtonWrapper onPress={() => this.props.navigation.goBack()} absolute side='right'>
      <Utils.Text>Back</Utils.Text>
    </Utils.ButtonWrapper>
  )

  _onKeyPress = (event) => {
    if (event.nativeEvent.key === 'Enter') {
      this._handleRestore()
    }
  }

  render () {
    const { loading } = this.state
    return (
      <Utils.Container>
        <NavigationHeader
          title='RESTORE WALLET'
          onBack={() => this.props.navigation.navigate('Settings')}
          noBorder
        />
        <Utils.Content paddingBottom='2'>
          <Utils.FormInput
            placeholder='Please, type your 12 seed words here'
            height={90}
            padding={16}
            multiline
            numberOfLines={4}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.seed}
            onChangeText={seed => this.setState({ seed })}
            onKeyPress={this._onKeyPress}
          />
        </Utils.Content>
        <Utils.Content paddingTop='2' paddingBottom='4'>
          <ButtonGradient
            disabled={!this.state.seed.length || loading}
            onPress={this._handleRestore}
            text='RESTORE'
          />
        </Utils.Content>
        <Utils.Content paddingTop='8'>
          <Utils.Text weight='300' font='light' secondary size='smaller'>
            To restore your wallet, please provide the same 12 words
            that you wrote on paper when you created your wallet for the first time.
            If you enter a different sequence of words, a new empty wallet will be
            created.
          </Utils.Text>
        </Utils.Content>
        <Utils.VerticalSpacer />
        <Utils.View flex={1} />
      </Utils.Container>
    )
  }
}

export default withContext(Restore)
