import React from 'react'
import { ListItem } from 'react-native-elements'

import FadeIn from '../../components/Animations/FadeIn'
import { Colors } from '../../components/DesignSystem'

const ITEM_HEIGHT = 40

const TokenItem = ({ item, onPress }) => (
  <FadeIn name={item.name}>
    <ListItem
      onPress={onPress}
      disabled={item.name === 'TRX'}
      titleStyle={{ color: Colors.primaryText }}
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
        value: `${item.balance || 0}`,
        textStyle: { color: Colors.primaryText },
      }}
    />
  </FadeIn>
)

export default TokenItem