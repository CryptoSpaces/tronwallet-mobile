import React from 'react'
import { SafeAreaView, ActivityIndicator } from 'react-native'

import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'

import { getUserSecrets } from '../../utils/secretsUtils'

class Create extends React.Component {
  static navigationOptions = () => ({
    header: (
      <SafeAreaView style={{ backgroundColor: Colors.darkerBackground }}>
        <Utils.Header>
          <Utils.TitleWrapper>
            <Utils.Title>Confirm Wallet Seed</Utils.Title>
          </Utils.TitleWrapper>
        </Utils.Header>
      </SafeAreaView>
    )
  })

  state = {
    seed: null
  }

  async componentDidMount() {
    try {
      const { mnemonic } = await getUserSecrets()
      this.setState({ seed: mnemonic })
    } catch (err) {
      console.warn(err)
      alert('Oops, we have a problem. Please restart the application.')
    }
  }

  render () {
    const { seed } = this.state
    return (
      <Utils.Container>
        <Utils.View flex={1} />
        <Utils.Content backgroundColor={Colors.darkerBackground}>
          {!seed && <ActivityIndicator />}
          {seed && <Utils.Text lineHeight={24} letterSpacing={1.5} align='center'>{seed}</Utils.Text>}
        </Utils.Content>
        <Utils.View flex={1} />
        <Utils.Row justify='center'>
          <ButtonGradient
            onPress={() => this.props.navigation.navigate('SeedConfirm', { seed: seed.split(' ') })}
            text="I'VE WRITTEN IT DOWN"
          />
        </Utils.Row>
        <Utils.VerticalSpacer />
        <Utils.Button onPress={() => this.props.navigation.goBack()}>Confirm later</Utils.Button>
        <Utils.View flex={1} />
      </Utils.Container>
    )
  }
}

export default Create
