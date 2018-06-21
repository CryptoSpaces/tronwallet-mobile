import React from 'react'
import * as Utils from '../Utils'

import formatNumber from '../../utils/formatNumber'
import formatUrl from '../../utils/formatUrl'

const VoteItem = ({ item, index, currentVotes, userVotes }) => {
  let url = formatUrl(item.url)
  let address = `${item.address.slice(0, 12)}...${item.address.substr(item.address.length - 12)}`

  return (
    <Utils.Content>
      <Utils.Row justify='space-between' align='center'>
        <Utils.Row align='center'>
          <Utils.Text secondary>#{index + 1}</Utils.Text>
          <Utils.HorizontalSpacer />
          <Utils.View flex={1}>
            <Utils.Text size='xsmall'>{url}</Utils.Text>
            <Utils.Row>
              <Utils.Text size='xsmall' secondary>Issuer: </Utils.Text>
              <Utils.Text size='xsmall'>{address}</Utils.Text>
            </Utils.Row>
            <Utils.Row>
              <Utils.Text size='xsmall' secondary>Total Votes: </Utils.Text>
              <Utils.Text size='xsmall'>{formatNumber(item.votes)}</Utils.Text>
            </Utils.Row>
          </Utils.View>
          <Utils.HorizontalSpacer />
          <Utils.Text>{userVotes ? '' : (currentVotes || 0).toString()}</Utils.Text>
        </Utils.Row>
      </Utils.Row>
    </Utils.Content>
  )
}

export default VoteItem
