import React from 'react'
import { SafeAreaView } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'

import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'

import { recoverUserKeypair } from '../../utils/secretsUtils'
import { resetWalletData } from '../../utils/userAccountUtils'
import { Context } from '../../store/context'

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
    const { updateWalletData } = this.props.context
    this.setState({ loading: true })
    try {
      await recoverUserKeypair(this.state.seed)
      await resetWalletData()
      await updateWalletData()
      alert("Wallet recovered with success!")
      this.setState({ loading: false }, () => {
        this._navigateToSettings()
      })
    } catch (err) {
      alert("Oops. Looks like the words you typed isn't a valid mnemonic seed. Check for a typo and try again.")
      this.setState({ loading: false })
    }
  }

  render() {
    const { loading } = this.state
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
            disabled={!this.state.seed.length || loading}
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

export default props => (
  <Context.Consumer>
    {context => <Restore context={context} {...props} />}
  </Context.Consumer>
)
