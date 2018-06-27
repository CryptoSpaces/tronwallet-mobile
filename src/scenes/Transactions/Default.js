import React from 'react'
import moment from 'moment'
import Feather from 'react-native-vector-icons/Feather'

import * as Utils from '../../components/Utils'

export default ({ item }) => (<Utils.TransactionCard>
  <Utils.Row style={{ justifyContent: 'space-between' }}>
    <Utils.Text size='small' secondary>Transaction Type {item.type}</Utils.Text>
    <Utils.Text size='xsmall'>
      <Feather name='refresh-cw' size={14} color='#ffffff' />
    </Utils.Text>
  </Utils.Row>
  <Utils.VerticalSpacer size='small' />
  <Utils.Text font='light' size='xsmall' secondary>{moment(item.timestamp).fromNow()}</Utils.Text>
</Utils.TransactionCard>
)
