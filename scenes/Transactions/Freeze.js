import React from 'react'
import moment from 'moment'
import { Ionicons } from '@expo/vector-icons'

import * as Utils from '../../components/Utils'
import { ONE_TRX } from '../../src/services/client'

export default ({ item }) => {
  const { contractData } = item
  return (
    <Utils.TransactionCard paddingSize='xsmall'>
      <Utils.Row style={{ justifyContent: 'space-between' }}>
        <Utils.Text size='small' secondary>{item.type}</Utils.Text>
        <Utils.Text size='xsmall'>{contractData.frozenBalance / ONE_TRX} TRX
          {' '}
          <Ionicons name='ios-snow-outline' size={14} color='#ffffff' />
        </Utils.Text>
      </Utils.Row>
      <Utils.VerticalSpacer size='small' />
      <Utils.Text font='light' size='xsmall' secondary>{moment(item.timestamp).fromNow()}</Utils.Text>
    </Utils.TransactionCard>
  )
}
