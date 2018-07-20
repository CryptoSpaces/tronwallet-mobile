import React from 'react'

import * as Utils from '../../components/Utils'
import Logo from '../../components/Logo'
import ButtonGradient from '../../components/ButtonGradient'

import { createUserKeyPair } from '../../utils/secretsUtils'

import { withContext } from '../../store/context'

class FirstTime extends React.Component {
  render () {
    return (
      <Utils.Container>
        <Utils.View flex={1} />
        <Utils.Content>
          <Utils.Row justify='center'>
            <Logo />
          </Utils.Row>
          <Utils.VerticalSpacer size='big' />
          <ButtonGradient
            text='CREATE WALLET'
            onPress={() => {
              this.props.navigation.navigate('Pin', {
                shouldDoubleCheck: true,
                onSuccess: async pin => {
                  await createUserKeyPair(pin)
                  this.props.context.setPin(pin, () => this.props.navigation.navigate('SeedCreate'))
                }
              })
            }}
          />
          <Utils.VerticalSpacer />
          <ButtonGradient
            text='RESTORE WALLET'
            onPress={() => {
              this.props.navigation.navigate('Pin', {
                shouldDoubleCheck: true,
                onSuccess: pin => this.props.context.setPin(pin, () => this.props.navigation.navigate('SeedRestore'))
              })
            }}
          />
        </Utils.Content>
        <Utils.View flex={1} />
      </Utils.Container>
    )
  }
}

export default withContext(FirstTime)
