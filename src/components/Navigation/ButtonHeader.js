import React from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

import * as Utils from '../Utils'
import { Colors } from '../DesignSystem'

const NavigationButtonHeader = ({ title, onPress, disabled }) => {
  return <TouchableOpacity disabled={disabled} onPress={onPress} style={{ marginRight: 10 }}>
    <Utils.Text size={'xsmall'} light color={disabled ? Colors.secondaryText : Colors.primaryText}>{title}</Utils.Text>
  </TouchableOpacity>
}

NavigationButtonHeader.defaultProps = {
  disabled: false,
  title: 'Right Button'
}

NavigationButtonHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func, // isRequired but is causing unwatend warnings because of async loads
  disabled: PropTypes.bool
}

export default NavigationButtonHeader
