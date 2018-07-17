import React from 'react'

import ButtonGradient from '../../components/ButtonGradient'
import * as Utils from '../../components/Utils'

const BalanceNavigation = () => (
  <Utils.Content paddingVertical='xsmall'>
    <Utils.Row>
      <ButtonGradient
        text='RECEIVE'
        size='medium'
        multiColumnButton={{x: 0, y: 2}}
        full
        rightRadius={0}
        onPress={() => {}}
      />
      <Utils.HorizontalSpacer size='tiny' />
      <ButtonGradient
        text='SEND'
        size='medium'
        multiColumnButton={{x: 2, y: 3}}
        full
        leftRadius={0}
        onPress={() => {}}
      />
    </Utils.Row>
  </Utils.Content>
)

export default BalanceNavigation
