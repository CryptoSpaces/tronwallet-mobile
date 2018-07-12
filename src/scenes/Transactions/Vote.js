import React from 'react'
import moment from 'moment'
import Feather from 'react-native-vector-icons/Feather'
import { tint } from 'polished'
import * as Utils from '../../components/Utils'

export default ({ item, onPress }) => {
  const voteCount = item.contractData.votes.reduce(
    (prev, curr) => prev + curr.voteCount,
    0
  )

  return (
    <Utils.TransactionCard onPress={onPress}>
      <Utils.Row align='center' justify='space-between'>
        <Utils.Tag color={tint(0.9, '#bd1dc6')}>
          <Utils.Text size='xsmall'>{item.type}</Utils.Text>
        </Utils.Tag>
        <Utils.View>
          <Utils.Text size='small'>
            {voteCount} <Feather name='thumbs-up' size={20} color='#ffffff' />
          </Utils.Text>
        </Utils.View>
      </Utils.Row>
      <Utils.VerticalSpacer size='xsmall' />
      <Utils.Row>
        <Utils.View>
          <Utils.VerticalSpacer size='xsmall' />
          <Utils.Text size='xsmall' secondary>
            {moment(item.timestamp).fromNow()}
          </Utils.Text>
        </Utils.View>
      </Utils.Row>
    </Utils.TransactionCard>
  )
}
