import React from 'react'
import { SafeAreaView, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/Ionicons'

import * as Utils from '../Utils'
import { Colors } from '../DesignSystem'

const NavigationHeader = ({ title, onClose, noBorder, rightButton }) => {
  let leftElement = null
  let rightElement = null

  if (onClose) {
    leftElement = <TouchableOpacity onPress={onClose}>
      <Icon name='ios-arrow-round-back' color='white' size={42} />
    </TouchableOpacity>
  }
  if (rightButton) {
    rightElement = rightButton
  }

  return <SafeAreaView style={{ backgroundColor: Colors.background }}>
    <Utils.Header padding={16} justify='center' noBorder={noBorder}>
      <Utils.View justify='center' align='center'>
        <Utils.Text lineHeight={36} size='small' font='bold'>{title.toUpperCase()}</Utils.Text>
      </Utils.View>
      <Utils.View style={{ position: 'absolute', left: 20 }}>
        {leftElement}
      </Utils.View>
      <Utils.View style={{ position: 'absolute', right: 20 }}>
        {rightElement}
      </Utils.View>
    </Utils.Header>
  </SafeAreaView>
}

NavigationHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  noBorder: PropTypes.bool,
  rightButton: PropTypes.element
}

export default NavigationHeader
