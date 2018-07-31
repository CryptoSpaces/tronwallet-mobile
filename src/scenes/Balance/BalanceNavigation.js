import React from 'react'

import ButtonGradient from '../../components/ButtonGradient'
import * as Utils from '../../components/Utils'

const BalanceNavigation = ({ navigation }) => {
  const goToReceive = () => {
    navigation.navigate('ReceiveScene')
  }

  const navigateNext = next => navigation.navigate(next, {index: 0})

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
          text='FREEZE'
          size='medium'
          multiColumnButton={{x: 2, y: 3}}
          full
          leftRadius={0}
          rightRadius={0}
          onPress={() => navigateNext('FreezeScene')}
        />
        <Utils.HorizontalSpacer size='tiny' />
        <ButtonGradient
          text='SEND'
          size='medium'
          multiColumnButton={{x: 3, y: 4}}
          full
          leftRadius={0}
          onPress={() => navigateNext('SendScene')}
        />
      </Utils.Row>
    </React.Fragment>
  )
}

export default BalanceNavigation
