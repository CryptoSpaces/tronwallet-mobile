import React from 'react'

import ButtonGradient from '../../components/ButtonGradient'
import * as Utils from '../../components/Utils'

import { withContext } from '../../store/context'

const BalanceNavigation = ({ navigation, context }) => {
  const goToReceive = () => {
    navigation.navigate('ReceiveScene')
  }

  const goToSend = () => {
    navigation.navigate('Pin', {
      shouldGoBack: true,
      testInput: pin => pin === context.pin,
      onSuccess: () => navigation.navigate('TransferScene', {index: 0})
    })
  }

  return (
    <React.Fragment>
      <Utils.VerticalSpacer size='xsmall' />
      <Utils.Row>
        <ButtonGradient
          text='RECEIVE'
          size='medium'
          multiColumnButton={{x: 0, y: 2}}
          full
          rightRadius={0}
          onPress={goToReceive}
        />
        <Utils.HorizontalSpacer size='tiny' />
        <ButtonGradient
          text='SEND'
          size='medium'
          multiColumnButton={{x: 2, y: 3}}
          full
          leftRadius={0}
          onPress={goToSend}
        />
      </Utils.Row>
    </React.Fragment>
  )
}

export default withContext(BalanceNavigation)
