import React from 'react'

import ButtonGradient from '../../components/ButtonGradient'
import * as Utils from '../../components/Utils'

const BalanceNavigation = ({navigation}) => {
  const goToReceive = () => {
    navigation.navigate('ReceiveScene')
  }

  const goToSend = () => {
    navigation.navigate('TransferScene', {index: 0})
  }

  return (
    <Utils.Content paddingVertical='xsmall'>
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
    </Utils.Content>
  )
}

export default BalanceNavigation
