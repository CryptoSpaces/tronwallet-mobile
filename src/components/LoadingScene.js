import React from 'react'

import { ActivityIndicator } from 'react-native'
import { Colors } from './DesignSystem'
import * as Utils from './Utils'

export default () => {
  return (
    <Utils.View
      style={{ backgroundColor: Colors.background }}
      flex={1}
      justify='center'
      align='center'
    >
      <ActivityIndicator size='large' color={Colors.primaryText} />
    </Utils.View>
  )
}
