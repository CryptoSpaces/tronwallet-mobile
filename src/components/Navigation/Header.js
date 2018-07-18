import React from 'react'
import { SafeAreaView, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import Feather from 'react-native-vector-icons/Feather'

import * as Utils from '../Utils'
import { Colors } from '../DesignSystem'

const NavigationHeader = ({ title, onClose, noBorder, rightButton }) => {
  let rightElement = null

  if (onClose && !rightButton) {
    rightElement = <TouchableOpacity onPress={onClose}>
      <Feather name='x' color='white' size={32} />
    </TouchableOpacity>
  }
  if (rightButton && !onClose) {
    rightElement = rightButton
  }

  return <SafeAreaView style={{ backgroundColor: Colors.background }}>
    <Utils.Header padding={16} justify='center' noBorder={noBorder}>
      <Utils.View justify='center' align='center'>
        <Utils.Text lineHeight={36} size='average' font='medium' weight={500}>{title.toUpperCase()}</Utils.Text>
      </Utils.View>
      <Utils.View style={{ position: 'absolute', right: 10 }}>
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
