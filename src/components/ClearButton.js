import React from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import Feather from 'react-native-vector-icons/Feather'
import { Spacing } from './DesignSystem'

const ClearButton = ({onPress}) => (
  <TouchableOpacity style={{padding: Spacing.medium}} onPress={onPress}>
    <Feather name='trash-2' color='white' size={18} />
  </TouchableOpacity>
)

ClearButton.propType = {
  onPress: PropTypes.func.isRequired
}

export default ClearButton
