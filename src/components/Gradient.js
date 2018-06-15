import React from 'react'
import { Defs, LinearGradient, Stop } from 'react-native-svg'

import { Colors } from './DesignSystem'

const Gradient = () => (
  <Defs key={'gradient'}>
    <LinearGradient id={'gradient'} x1={'0%'} y={'0%'} x2={'100%'} y2={'100%'}>
      <Stop offset={'0%'} stopColor={Colors.primaryGradient[0]} />
      <Stop offset={'100%'} stopColor={Colors.primaryGradient[1]} />
    </LinearGradient>
  </Defs>
)

export default Gradient
