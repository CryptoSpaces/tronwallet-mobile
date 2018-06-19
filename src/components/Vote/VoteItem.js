import React from 'react'
import * as Utils from '../Utils'
import { Colors, Spacing } from '../DesignSystem'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import formatUrl from '../../utils/formatUrl'

const VoteItem = ({ item, index, format, onChangeVotes, votes, userVote, openModal }) => {
  let url = formatUrl(item.url)
  let address = `${item.address.slice(0, 12)}...${item.address.substr(item.address.length - 12)}`

  return (
    <TouchableOpacity onPress={openModal}>
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
          {//REFACTOR STYLES ->>
          }
          <Utils.Row align='center' justify='space-between'>
            <View style={{}}>
              <Text style={{color: 'red'}}>{userVote ? '' : (votes || 0).toString()}</Text>
            </View>
          </Utils.Row>
          {/* <Utils.Row align='center' justify='space-between'>
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
          </Utils.Row> */}
        </Utils.Row>
      </Utils.Item>
    </TouchableOpacity>
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
