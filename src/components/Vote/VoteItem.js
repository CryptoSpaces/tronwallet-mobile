import React from 'react'
import * as Utils from '../Utils'
import { Colors, Spacing } from '../DesignSystem'
import { View, StyleSheet } from 'react-native'

const VoteItem = ({ item, index, format, onChangeVotes, votes, userVote }) => {
  let url = item.url
  let address = `${item.address.slice(0, 12)}...${item.address.substr(item.address.length - 12)}`
  // url = url.replace(/(^\w+:|^)\/\//, '')
  url = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
  if (url.length > 35) {
    url = `${url.slice(0, 32)}...`
  }

  return (
    <Utils.Item padding={16}>
      <Utils.Row justify='space-between' align='center'>
        <Utils.Row justify='space-between' align='center'>
          <View style={styles.rank}>
            <Utils.Text secondary>#{index + 1}</Utils.Text>
          </View>
          <Utils.View>
            <Utils.View style={{ width: '100%' }}>
              <Utils.Text lineHeight={20} size='xsmall'>{url}</Utils.Text>
            </Utils.View>
            <Utils.Row>
              {/* <Utils.Text lineHeight={20} size='xsmall' secondary>Issuer: </Utils.Text> */}
              <Utils.Text lineHeight={20} size='xsmall'>{address}</Utils.Text>
            </Utils.Row>
            <Utils.Row>
              <Utils.Text lineHeight={20} size='xsmall' secondary>Total Votes: </Utils.Text>
              <Utils.Text lineHeight={20} size='xsmall'>{format(item.votes)}</Utils.Text>
            </Utils.Row>
          </Utils.View>
        </Utils.Row>
        <Utils.Row align='center' justify='space-between'>
          <Utils.FormInput
            underlineColorAndroid='transparent'
            keyboardType='numeric'
            onChangeText={(v) => onChangeVotes(v, item.address)}
            placeholderTextColor={Colors.secondaryText}
            placeholder={`${userVote || 0}`}
            value={userVote ? '' : (votes || '').toString()}
            padding={Spacing.small}
            style={styles.input}
          />
        </Utils.Row>
      </Utils.Row>
    </Utils.Item>
  )
}

const styles = StyleSheet.create({
  rank: {
    paddingRight: 10
  },
  input: {
    minWidth: 70
  }
})

export default VoteItem
