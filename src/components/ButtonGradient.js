import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import PropTypes from 'prop-types'
import { Colors, Spacing } from './DesignSystem'
import * as Utils from './Utils'

const ButtonGradient = ({ text, onPress, disabled, size, width, marginVertical, font }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} style={{marginVertical: Spacing[marginVertical] || 0}}>
    <LinearGradient
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      colors={[Colors.primaryGradient[0], Colors.primaryGradient[1]]}
      style={[
        styles.btnGradient,
        {
          padding: Spacing[size],
          opacity: disabled ? 0.4 : 1,
          width: width || '100%'
        }
      ]}>
      <Utils.Text font={font}>{text}</Utils.Text>
    </LinearGradient>
  </TouchableOpacity>
)

ButtonGradient.defaultProps = {
  disabled: false,
  size: 'medium'
}

ButtonGradient.propTypes = {
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'big', 'large'])
}

const styles = StyleSheet.create({
  btnGradient: {
    alignItems: 'center',
    borderRadius: 4
  }
})

export default ButtonGradient
