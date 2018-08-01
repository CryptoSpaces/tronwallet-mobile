import React from 'react'
import { ListItem } from 'react-native-elements'

import FadeIn from '../../components/Animations/FadeIn'
import { Colors } from '../../components/DesignSystem'
import { formatNumber } from '../../utils/numberUtils'
import { ONE_TRX } from '../../services/client'

const ITEM_HEIGHT = 48

const TokenItem = ({ item, onPress }) => {
  const tokenValue = item.balance >= 0 ? item.balance : item.price / ONE_TRX
  const formattedValue =
    tokenValue >= 1
      ? formatNumber(tokenValue.toFixed(2))
      : tokenValue.toFixed(2)

  return (
    <FadeIn name={item.name}>
      <ListItem
        onPress={onPress}
        containerStyle={{
          borderBottomColor: '#191a29',
          height: ITEM_HEIGHT,
          marginLeft: -24,
          justifyContent: 'center'
        }}
        underlayColor='#191a29'
        title={item.name}
        titleStyle={{
          padding: 6,
          borderRadius: 8,
          color: 'white'
        }}
        hideChevron
        badge={{
          value: formattedValue,
          textStyle: { color: Colors.primaryText }
        }}
      />
    </FadeIn>
  )
}

export default TokenItem
