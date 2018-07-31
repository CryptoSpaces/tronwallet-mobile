import React from 'react'
import { Image, ActivityIndicator } from 'react-native'

import * as Elements from './elements'

const Empty = ({loading}) => (
  <Elements.EmptyScreenContainer>
    {loading ? <ActivityIndicator size='small' color='white' /> : (
      <React.Fragment>
        <Image
          source={require('../../assets/empty.png')}
          resizeMode='contain'
          style={{ width: 200, height: 200 }}
        />
        <Elements.EmptyScreenText>
          No transactions found.
        </Elements.EmptyScreenText>
      </React.Fragment>
    )}
  </Elements.EmptyScreenContainer>
)

export default Empty
