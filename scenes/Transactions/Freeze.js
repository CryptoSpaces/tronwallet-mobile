import React from 'react'
import moment from 'moment'
import { Ionicons } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import { tint } from 'polished'
import * as Utils from '../../components/Utils'
import { ONE_TRX } from '../../src/services/client'

const formatAmount = value => {
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export default ({ item }) => {
  const { contractData } = item

  return (
    <Utils.TransactionCard>
      <Utils.Row align='center' justify='space-between'>
        <Utils.Tag color={tint(0.9, '#38b8f3')}>
          <Utils.Text size="xsmall">{item.type}</Utils.Text>
        </Utils.Tag>
        <Utils.View>
          <Utils.Text size="small">{contractData.frozenBalance / ONE_TRX} TRX  <Ionicons name='ios-snow-outline' size={20} color='#ffffff' /></Utils.Text>
        </Utils.View>
      </Utils.Row>
      <Utils.VerticalSpacer size='xsmall' />
      <Utils.Row>
      <Utils.View>
      <Utils.Text size="xsmall" secondary>{moment(item.timestamp).fromNow()}</Utils.Text>
      </Utils.View>
      </Utils.Row>      
    </Utils.TransactionCard>    
  )


  // return <Utils.TransactionCard paddingSize='xsmall'>
  //   <Utils.Row style={{ justifyContent: 'space-between' }}>
  //     <Utils.Text size='small' secondary>{item.type}</Utils.Text>
  //     <Utils.Text size='xsmall'>{contractData.frozenBalance / ONE_TRX} TRX
  //       {' '}
  //     <Ionicons name='ios-snow-outline' size={14} color='#ffffff' /></Utils.Text>
  //   </Utils.Row>
  //   <Utils.VerticalSpacer size='small' />
  //   <Utils.Text font='light' size='xsmall' secondary>{moment(item.timestamp).fromNow()}</Utils.Text>
  // </Utils.TransactionCard>
}
