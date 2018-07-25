import React from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import Feather from 'react-native-vector-icons/Feather'

import { Spacing, Colors } from '../DesignSystem'
import * as Utils from '../Utils'

const ClearVotes = ({onPress, disabled, label}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: Colors.darkerBackground,
      borderColor: Colors.darkerBackground,
      borderWidth: 1,
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.xsmall
    }}>
    <Utils.Text size='small' marginX={Spacing.small}>{label || 0}</Utils.Text>
    <Feather name='trash-2' color='white' size={18} />
  </TouchableOpacity>
)

ClearVotes.defaultProps = {
  label: 0
}
ClearVotes.propTypes = {
  onPress: PropTypes.func.isRequired,
  label: PropTypes.number.isRequired

}
export default ClearVotes
