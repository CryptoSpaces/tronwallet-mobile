import React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import moment from 'moment'
import { tint } from 'polished'
import * as Utils from '../../components/Utils'
import { ONE_TRX } from '../../services/client'

const formatAmount = value => {
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export default ({ item }) => {
  const { contractData } = item
  return (
    <Utils.TransactionCard>
      <Utils.Row align='center' justify='space-between'>
        <Utils.Tag color={tint(0.9, '#0cd94d')}>
          <Utils.Text size='xsmall'>{item.type}</Utils.Text>
        </Utils.Tag>
        <Utils.View>
          <Utils.Text size='small'>
            {formatAmount(contractData.amount / ONE_TRX)}  <Feather name='users' size={20} color='#ffffff' />
          </Utils.Text>
        </Utils.View>
      </Utils.Row>
      <Utils.Row>
        <Utils.View>
          <Utils.VerticalSpacer size='xsmall' />
          <Utils.Text size='xsmall'>{contractData.token}</Utils.Text>
          <Utils.VerticalSpacer size='xsmall' />
          <Utils.Text size='xsmall' secondary>{moment(contractData.timestamp).fromNow()}</Utils.Text>
        </Utils.View>
      </Utils.Row>
    </Utils.TransactionCard>
  )
}
