import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import * as Utils from './Utils'
import { Colors } from './DesignSystem'

const Header = ({
  title,
  description,
  onLeftPress = null,
  onRightPress = null,
  leftIcon = <Text style={{ color: Colors.primaryText }}>BACK</Text>,
  rightIcon = <Text style={{ color: Colors.primaryText }}>RIGHT</Text>,
  children,
  top = 20,
  bottom = 10
}) => {
  const placeholder = <View />

  const leftBtn = onLeftPress ? (
    <TouchableOpacity onPress={onLeftPress}>{leftIcon}</TouchableOpacity>
  ) : (
    placeholder
  )

  const rightBtn = onRightPress ? (
    <TouchableOpacity onPress={onRightPress}>{rightIcon}</TouchableOpacity>
  ) : (
    placeholder
  )

  return (
    <View
      style={{ paddingTop: top, paddingBottom: bottom, paddingVertical: 10 }}
    >
      <Utils.Row align='center' justify='space-between'>
        {leftBtn}
        {children}
        {rightBtn}
      </Utils.Row>
    </View>
  )
}

export default Header
