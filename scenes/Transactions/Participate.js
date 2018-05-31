import React from 'react'
import { Feather } from '@expo/vector-icons'
import moment from 'moment'

import * as Utils from '../../components/Utils'
import { ONE_TRX } from '../../src/services/client'

export default ({ item }) => {
  const { contractData } = item
  return <Utils.TransactionCard>
    <Utils.Row style={{ justifyContent: 'space-between' }}>
      <Utils.Text size='small' secondary>{item.type}</Utils.Text>
      <Utils.Text size='xsmall'>{contractData.amount / ONE_TRX} {contractData.token}
        {' '}
        <Feather name='users' size={14} color='#ffffff' /></Utils.Text>
    </Utils.Row>
    <Utils.VerticalSpacer size='small' />
    <Utils.Text font='light' size='xsmall' secondary>{moment(item.timestamp).fromNow()}</Utils.Text>
  </Utils.TransactionCard>
}
