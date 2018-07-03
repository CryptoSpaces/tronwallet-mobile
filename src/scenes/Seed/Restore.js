import React from 'react'
import { SafeAreaView } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'

import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'

import { recoverUserKeypair } from '../../utils/secretsUtils'

class Restore extends React.Component {
  static navigationOptions = () => ({
    header: (
      <SafeAreaView style={{ backgroundColor: Colors.darkerBackground }}>
        <Utils.Header>
          <Utils.TitleWrapper>
            <Utils.Title>Restore Wallet</Utils.Title>
          </Utils.TitleWrapper>
        </Utils.Header>
      </SafeAreaView>
    )
  })

  state = {
    seed: ''
  }

  _handleRestore = async () => {
    try {
      await recoverUserKeypair(this.state.seed)
      alert("Wallet recovered with success!")
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'SettingsScene' })
        ]
      })
      this.props.navigation.dispatch(resetAction)
    } catch (err) {
      console.warn(err)
      alert("Oops. Looks like the words you typed isn't a valid mnemonic seed. Check for a typo and try again.")
    }
  }

  render () {
    return (
      <Utils.Container>
        <Utils.View flex={1} />
        <Utils.Content>
          <Utils.FormInput
            placeholder='Please, type your 12 seed words here'
            multiline={true}
            numberOfLines={4}
            value={this.state.seed}
            onChangeText={seed => this.setState({ seed })}
          />
        </Utils.Content>
        <Utils.View flex={1} />
        <Utils.Row justify='center'>
          <ButtonGradient
            disabled={!this.state.seed.length}
            onPress={this._handleRestore}
            text='RESTORE'
          />
        </Utils.Row>
        <Utils.VerticalSpacer />
        <Utils.Button onPress={() => this.props.navigation.goBack()}>Back</Utils.Button>
        <Utils.View flex={1} />
      </Utils.Container>
    )
  }
}

export default Restore
