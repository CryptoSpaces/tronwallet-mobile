import React from 'react'
import moment from 'moment'
import { Feather } from '@expo/vector-icons'
import { tint } from 'polished'
import * as Utils from '../../components/Utils'

export default ({ item }) => {
  const voteCount = item.contractData.votes.reduce((prev, curr) => (prev + curr.voteCount), 0)

  return (
    <Utils.TransactionCard>
      <Utils.Row align='center' justify='space-between'>
        <Utils.Tag color={tint(0.9, '#bd1dc6')}>
          <Utils.Text size='xsmall'>{item.type}</Utils.Text>
        </Utils.Tag>
        <Utils.View>
          <Utils.Text size='small'>{voteCount}  <Feather name='thumbs-up' size={20} color='#ffffff' /></Utils.Text>
        </Utils.View>
      </Utils.Row>
      <Utils.VerticalSpacer size='xsmall' />
      <Utils.Row>
        <Utils.View>
          <Utils.VerticalSpacer size='xsmall' />
          <Utils.Text size='xsmall' secondary>{moment(item.timestamp).fromNow()}</Utils.Text>
        </Utils.View>
      </Utils.Row>
    </Utils.TransactionCard>
  )

  // return <Utils.TransactionCard>
  //   <Utils.Row style={{ justifyContent: 'space-between' }}>
  //     <Utils.Text size='small' secondary>{item.type}</Utils.Text>
  //     <Utils.Text size='xsmall'>{voteCount} TRX
  //       {' '}<Feather name='thumbs-up' size={14} color='#ffffff' />
  //     </Utils.Text>
  //   </Utils.Row>
  //   <Utils.VerticalSpacer size='small' />
  //   <Utils.Text font='light' size='xsmall' secondary>{moment(item.timestamp).fromNow()}</Utils.Text>
  // </Utils.TransactionCard>
}
