import React from 'react'
import moment from 'moment'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { tint } from 'polished'
import * as Utils from '../../components/Utils'
import { ONE_TRX } from '../../services/client'

// const formatAmount = value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export default ({ item, onPress }) => (
  <Utils.TransactionCard onPress={onPress}>
    <Utils.Row align='center' justify='space-between'>
      <Utils.Tag color={tint(0.9, '#38b8f3')}>
        <Utils.Text size='xsmall'>{item.type}</Utils.Text>
      </Utils.Tag>
      <Utils.View>
        <Utils.Text size='small'>
          {item.contractData.frozenBalance / ONE_TRX} TRX{' '}
          <Ionicons name='ios-snow-outline' size={20} color='#ffffff' />
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
