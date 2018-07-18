import React from 'react'
import moment from 'moment'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { tint } from 'polished'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import { ONE_TRX } from '../../services/client'

// const formatAmount = value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export default ({ item, onPress }) => {
  const statusColor = item.confirmed ? 'green' : Colors.orange
  const statusText = item.confirmed ? 'Confirmed' : 'Unconfirmed'

  return (
    <Utils.TransactionCard onPress={onPress}>
      <Utils.Row align='center' justify='space-between'>
        <Utils.Row>
          <Utils.Tag marginRight={10} color={tint(0.9, 'teal')}>
            <Utils.Text size='xsmall'>{item.type}</Utils.Text>
          </Utils.Tag>
          <Utils.Tag color={tint(0.9, statusColor)}>
            <Utils.Text size='xsmall'>{statusText}</Utils.Text>
          </Utils.Tag>
        </Utils.Row>
        <Utils.View>
          <Utils.Text size='small'>
            {item.contractData.frozenBalance / ONE_TRX} TRX{' '}
            <Ionicons name='ios-unlock' size={20} color='#ffffff' />
          </Utils.Text>
        </Utils.View>
      </Utils.Row>
      <Utils.VerticalSpacer size='xsmall' />
      <Utils.Row>
        <Utils.View>
          <Utils.Text size='xsmall' secondary>
            {moment(item.timestamp).fromNow()}
          </Utils.Text>
        </Utils.View>
      </Utils.Row>
    </Utils.TransactionCard>
  )
}
