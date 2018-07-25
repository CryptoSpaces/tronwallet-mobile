import React from 'react'
import moment from 'moment'
import { View } from 'react-native'

import { Card, Moment, Confirmation, Badge, BadgeText } from './elements'
import { VerticalSpacer } from '../../components/Utils'

const Transaction = ({ item, onPress }) => {
  const config = {}
  const _configureTransaction = (config) => {
    switch (item.type) {
      case 'Transfer':
        config.BadgeColor = '#4a69e2'
        break
      case 'Freeze':
        config.BadgeColor = '#25b9e3'
        break
      case 'Unfreeze':
        config.BadgeColor = '#1f6986'
        break
      case 'Vote':
        config.BadgeColor = '#bb2dc4'
        break
      case 'Participate':
        config.BadgeColor = '#6442e4'
        break
      case 'Create':
        config.BadgeColor = '#94c047'
        break
      default:break
    }
    return config
  }

  _configureTransaction(config)
  return (
    <Card onPress={onPress}>
      <View>
        <Badge color={config.BadgeColor}>
          <BadgeText>
            {item.type.toUpperCase()}
          </BadgeText>
        </Badge>
        <VerticalSpacer size='medium' />
        <Confirmation>
          {item.confirmed ? 'Confirmed' : 'Unconfirmed'}
        </Confirmation>
      </View>
      <View>
        <Moment>
          {moment(item.timestamp).fromNow()}
        </Moment>
      </View>
    </Card>
  )
}

export default Transaction
