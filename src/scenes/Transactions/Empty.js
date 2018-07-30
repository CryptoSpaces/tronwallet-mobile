import React from 'react'
import { Image, ActivityIndicator } from 'react-native'

import * as Elements from './elements'

const Empty = ({refreshing}) => (
  <Elements.EmptyScreenContainer>
    <Image
      source={require('../../assets/empty.png')}
      resizeMode='contain'
      style={{ width: 200, height: 200 }}
    />
    <Elements.EmptyScreenText>
      No transactions found.
    </Elements.EmptyScreenText>
    <Elements.VSpacer />
    {refreshing && (
      <ActivityIndicator size='small' color='#ffffff' />
    )}
  </Elements.EmptyScreenContainer>
)

export default Empty
