import React from 'react'
import { ActivityIndicator, Alert } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'

import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'
import NavigationHeader from '../../components/Navigation/Header'

import { getUserSecrets, createUserKeyPair } from '../../utils/secretsUtils'
import { resetWalletData } from '../../utils/userAccountUtils'
import { withContext } from '../../store/context'

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'App' })],
  key: null
})

class Create extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <NavigationHeader
        title='CONFIRM WALLET SEED'
        onBack={() => {
          navigation.getParam('shouldReset', false)
            ? navigation.dispatch(resetAction)
            : navigation.goBack()
        }}
      />
    )
  })

  state = {
    seed: null,
    error: null
  }

  async componentDidMount () {
    try {
      await this._getMnemonic()
    } catch (err) {
      console.log(err)
      Alert.alert('Oops, we have a problem. Please restart the application.')
    }
  }

  _getNewMnemonic = async () => {
    const { pin, oneSignalId } = this.props.context
    try {
      await resetWalletData()
      await createUserKeyPair(pin, oneSignalId)
      await this._getMnemonic()
    } catch (e) {
      console.log(e)
      this.setState({
        error: 'Oops, we have a problem. Please restart the application.'
      })
    }
  }

  _getMnemonic = async () => {
    try {
      const { mnemonic } = await getUserSecrets(this.props.context.pin)
      this.setState({ seed: mnemonic })
    } catch (e) {
      console.log(e)
      this.setState({
        error: 'Oops, we have a problem. Please restart the application.'
      })
    }
  }

  render () {
    const { seed } = this.state
    const { navigation } = this.props
    return (
      <Utils.Container>
        <Utils.View flex={1} />
        <Utils.View height={1} backgroundColor={Colors.secondaryText} />
        <Utils.Content backgroundColor={Colors.darkerBackground}>
          {!seed && <ActivityIndicator />}
          {seed && (
            <Utils.Text lineHeight={24} align='center'>
              {seed}
            </Utils.Text>
          )}
        </Utils.Content>
        <Utils.View height={1} backgroundColor={Colors.secondaryText} />
        <Utils.Content paddingBottom={12}>
          <Utils.Row justify='center' align='flex-start' height={90}>
            <Utils.View style={{flex: 1}}>
              <ButtonGradient
                onPress={this._getNewMnemonic}
                text='GET NEW SEED'
                full
              />
              <Utils.Text light size='xsmall' secondary>
                This will generate a completely new wallet.
              </Utils.Text>
            </Utils.View>
            <Utils.HorizontalSpacer size='large' />
            <ButtonGradient
              onPress={() =>
                navigation.navigate(
                  'SeedConfirm',
                  { seed: seed.split(' ') }
                )
              }
              text='CONFIRM'
              full
            />
          </Utils.Row>
        </Utils.Content>
        <Utils.Button
          onPress={() => {
            navigation.getParam('shouldReset', false)
              ? navigation.dispatch(resetAction)
              : navigation.goBack()
          }}
        >
          Confirm later
        </Utils.Button>
        <Utils.View flex={1} />
      </Utils.Container>
    )
  }
}

export default withContext(Create)
