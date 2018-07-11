import React from 'react'
import { SafeAreaView, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import Feather from 'react-native-vector-icons/Feather'

import * as Utils from './Utils'
import { Colors } from './DesignSystem'

const NavigationHeader = ({ title, onClose, noBorder, rightButton }) => {
  let rightElement = null

  if (onClose && !rightButton) {
    rightElement = <Utils.View justify='center' align='center' marginRight={5}>
      <TouchableOpacity onPress={onClose}>
        <Feather name='x' color='white' size={32} />
      </TouchableOpacity>
    </Utils.View>
  }
  if (rightButton && !onClose) {
    rightElement = rightButton
  }

  return <SafeAreaView style={{ backgroundColor: Colors.background }}>
    <Utils.Header noBorder={noBorder}>
      <Utils.TitleWrapper>
        <Utils.Title>{title}</Utils.Title>
      </Utils.TitleWrapper>
      {rightElement}
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
