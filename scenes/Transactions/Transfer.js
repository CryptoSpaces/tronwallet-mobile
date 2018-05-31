import React from 'react'
import moment from 'moment'
import { Feather } from '@expo/vector-icons'

import * as Utils from '../../components/Utils'
import { ONE_TRX } from '../../src/services/client'

export default ({ item }) => {
  const amount = item.tokenName === 'TRX' ? item.amount / ONE_TRX : item.amount
  const typeTx = item.transferFromAddress !== item.ownerAddress
    ? { icon: 'arrow-down-left', color: 'green' } : { icon: 'arrow-up-right', color: 'red' }

  return <Utils.TransactionCard>
    <Utils.Row style={{ justifyContent: 'space-between' }}>
      <Utils.Text size='small' secondary>{item.type}</Utils.Text>
      <Utils.Text size='xsmall'>{amount} {item.tokenName} {' '}
        <Feather name={typeTx.icon} size={14} color={typeTx.color} /></Utils.Text>
    </Utils.Row>
    <Utils.VerticalSpacer size='small' />
    <Utils.Text size='xsmall'>From: {item.transferFromAddress}</Utils.Text>
    <Utils.Text size='xsmall'>To: {item.transferToAddress}</Utils.Text>
    <Utils.VerticalSpacer size='small' />
    <Utils.Text font='light' size='xsmall' secondary>{moment(item.timestamp).fromNow()}</Utils.Text>
  </Utils.TransactionCard>
}
