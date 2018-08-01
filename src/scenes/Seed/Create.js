import React from 'react'
import { ActivityIndicator, Alert } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'

import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'
import NavigationHeader from '../../components/Navigation/Header'

import { getUserSecrets } from '../../utils/secretsUtils'
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
    seed: null
  }

  async componentDidMount () {
    try {
      const { mnemonic } = await getUserSecrets(this.props.context.pin)
      this.setState({ seed: mnemonic })
    } catch (err) {
      console.warn(err)
      Alert.alert('Oops, we have a problem. Please restart the application.')
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
        <Utils.VerticalSpacer size='large' />
        <Utils.Row justify='center'>
          <ButtonGradient
            onPress={() =>
              navigation.navigate(
                'SeedConfirm',
                { seed: seed.split(' ') }
              )
            }
            text="I'VE WRITTEN IT DOWN"
          />
        </Utils.Row>
        <Utils.VerticalSpacer size='medium' />
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
