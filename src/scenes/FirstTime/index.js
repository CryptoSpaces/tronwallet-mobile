import React from 'react'
import { BackHandler } from 'react-native'

import * as Utils from '../../components/Utils'
import tl from '../../utils/i18n'
import Logo from '../../components/Logo'
import ButtonGradient from '../../components/ButtonGradient'

import { createUserKeyPair } from '../../utils/secretsUtils'

import { withContext } from '../../store/context'

class FirstTime extends React.Component {
  componentDidMount () {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress)
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress)
  }

  _handleBackPress = () => {
    BackHandler.exitApp()
  }

  render () {
    const shouldDoubleCheck = this.props.navigation.getParam('shouldDoubleCheck')
    const testInput = this.props.navigation.getParam('testInput')
    return (
      <Utils.Container>
        <Utils.View flex={1} />
        <Utils.Content>
          <Utils.Row justify='center'>
            <Logo />
          </Utils.Row>
          <Utils.VerticalSpacer size='big' />
          <ButtonGradient
            text={tl.t('firstTime.button.create')}
            onPress={() => {
              this.props.navigation.navigate('Pin', {
                shouldDoubleCheck,
                testInput,
                onSuccess: async pin => {
                  await createUserKeyPair(pin, this.props.context.oneSignalId)
                  this.props.context.setPin(
                    pin,
                    () => this.props.navigation.navigate('SeedCreate', { shouldReset: true, firstTime: true })
                  )
                }
              })
            }}
          />
          <Utils.VerticalSpacer />
          <ButtonGradient
            text={tl.t('firstTime.button.restore')}
            onPress={() => {
              this.props.navigation.navigate('Pin', {
                shouldDoubleCheck,
                testInput,
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
