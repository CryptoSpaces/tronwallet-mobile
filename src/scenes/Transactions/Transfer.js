import React from 'react'
import moment from 'moment'
import { Feather } from 'react-native-vector-icons'
import { tint } from 'polished'
import * as Utils from '../../components/Utils'
import { ONE_TRX } from '../../services/client'

const formatAmount = value => {
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export default ({ item }) => {
  const amount = item.tokenName === 'TRX' ? item.amount / ONE_TRX : item.amount
  const typeTx = item.transferFromAddress !== item.ownerAddress
    ? { icon: 'arrow-down-left', color: 'green' } : { icon: 'arrow-up-right', color: 'red' }

  return (
    <Utils.TransactionCard>
      <Utils.Row align='center' justify='space-between'>
        <Utils.Tag color={tint(0.9, '#1f90e6')}>
          <Utils.Text size='xsmall'>{item.type}</Utils.Text>
        </Utils.Tag>
        <Utils.View>
          <Utils.Text size='small'>{formatAmount(amount)}  <Feather name={typeTx.icon} size={20} color='#ffffff' /></Utils.Text>
          <Utils.VerticalSpacer size='xsmall' />
        </Utils.View>
      </Utils.Row>
      <Utils.Row>
        <Utils.View>
          <Utils.VerticalSpacer size='small' />
          <Utils.Text size='xsmall'>From: {item.transferFromAddress}</Utils.Text>
          <Utils.VerticalSpacer size='xsmall' />
          <Utils.Text size='xsmall'>To: {item.transferToAddress}</Utils.Text>
          <Utils.VerticalSpacer size='xsmall' />
          <Utils.Text size='xsmall' secondary>{moment(item.timestamp).fromNow()}</Utils.Text>
        </Utils.View>
      </Utils.Row>
    </Utils.TransactionCard>
  )

  // return <Utils.TransactionCard>
  //   <Utils.Row style={{ justifyContent: 'space-between' }}>
  //     <Utils.Text size='small' secondary>{item.type}</Utils.Text>
  //     <Utils.Text size='xsmall'>{amount} {item.tokenName} {' '}
  //       <Feather name={typeTx.icon} size={14} color={typeTx.color} /></Utils.Text>
  //   </Utils.Row>
  //   <Utils.VerticalSpacer size='small' />
  //   <Utils.Text size='xsmall'>From: {item.transferFromAddress}</Utils.Text>
  //   <Utils.Text size='xsmall'>To: {item.transferToAddress}</Utils.Text>
  //   <Utils.VerticalSpacer size='small' />
  //   <Utils.Text font='light' size='xsmall' secondary>{moment(item.timestamp).fromNow()}</Utils.Text>
  // </Utils.TransactionCard>
}
