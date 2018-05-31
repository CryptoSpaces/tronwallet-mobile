import React from 'react'
import { Feather } from '@expo/vector-icons'
import moment from 'moment'
import { tint } from 'polished'
import * as Utils from '../../components/Utils'
import { ONE_TRX } from '../../src/services/client'
import { Colors, FontSize } from '../../components/DesignSystem'
import moment from 'moment';
export default ({ item }) => {
  const { contractData } = item
  return (
    <Utils.TransactionCard>
      <Utils.Row align='center' justify='space-between'>
        <Utils.Tag color={tint(0.9, '#3bd36a')}>
          <Utils.Text size="xsmall">{item.type}</Utils.Text>
        </Utils.Tag>
        <Utils.Text size="small">{contractData.amount}  <Feather name='users' size={20} color='#ffffff' /></Utils.Text>
      </Utils.Row>
      <Utils.VerticalSpacer size='xsmall' />
      <Utils.Row>
      <Utils.View>
        <Utils.Text size="small">{contractData.token}</Utils.Text>
      </Utils.View>
      </Utils.Row>      
  </Utils.TransactionCard>
  )
  // return <Utils.TransactionCard>
  //   <Utils.Row style={{ justifyContent: 'space-between' }}>
  //     <Utils.Text size='small' secondary>{item.type}</Utils.Text>
  //     <Utils.Text size='xsmall'>{contractData.amount / ONE_TRX} {contractData.token}
  //       {' '}
  //       <Feather name='users' size={14} color='#ffffff' /></Utils.Text>
  //   </Utils.Row>
  //   <Utils.VerticalSpacer size='small' />
  //   <Utils.Text font='light' size='xsmall' secondary>{moment(item.timestamp).fromNow()}</Utils.Text>
  // </Utils.TransactionCard>
}
