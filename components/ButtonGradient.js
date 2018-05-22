import React from 'react'
import { TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo'
import { Colors, Spacing } from './DesignSystem'
import * as Utils from './Utils'
const ButtonGradient = ({ text, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient
      start={[0, 1]}
      end={[1, 0]}
      colors={[Colors.primaryGradient[0], Colors.primaryGradient[1]]}
      style={{ padding: Spacing.big, alignItems: 'center', borderRadius: 5, width: '100%' }}>
      <Utils.Text>{text}</Utils.Text>
    </LinearGradient>
  </TouchableOpacity>
)

export default ButtonGradient
