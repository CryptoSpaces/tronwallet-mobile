import React from 'react'
import moment from 'moment'
import Feather from 'react-native-vector-icons/Feather'
import { tint } from 'polished'
import * as Utils from '../../components/Utils'
import { ONE_TRX } from '../../services/client'
import formatNumber from '../../utils/formatNumber'

const TransferItem = ({ item }) => {
  const amount = item.contractData.tokenName === 'TRX' ? item.contractData.amount / ONE_TRX : item.contractData.amount
  const typeTx = item.contractData.transferFromAddress !== item.ownerAddress
    ? { icon: 'arrow-down-left', color: 'green' } : { icon: 'arrow-up-right', color: 'red' }
  return (
    <Utils.TransactionCard>
      <Utils.Row align='center' justify='space-between'>
        <Utils.Tag color={tint(0.9, '#1f90e6')}>
          <Utils.Text size='xsmall'>{item.type}</Utils.Text>
        </Utils.Tag>
        <Utils.View>
          <Utils.Text size='small'>
            {Number(amount) > 1 ? formatNumber(amount) : amount} {item.contractData.tokenName} <Feather name={typeTx.icon} size={20} color='#ffffff' />
          </Utils.Text>
          <Utils.VerticalSpacer size='xsmall' />
        </Utils.View>
      </Utils.Row>
      <Utils.Row>
        <Utils.View>
          <Utils.VerticalSpacer size='small' />
          <Utils.Text size='xsmall'>From: {item.contractData.transferFromAddress}</Utils.Text>
          <Utils.VerticalSpacer size='xsmall' />
          <Utils.Text size='xsmall'>To: {item.contractData.transferToAddress}</Utils.Text>
          <Utils.VerticalSpacer size='xsmall' />
          <Utils.Text size='xsmall' secondary>{moment(item.timestamp).fromNow()}</Utils.Text>
        </Utils.View>
      </Utils.Row>
    </Utils.TransactionCard>
  )
}

export default TransferItem
