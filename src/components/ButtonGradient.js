import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import PropTypes from 'prop-types'
import { Colors, Spacing } from './DesignSystem'
import * as Utils from './Utils'

const ButtonGradient = ({
  text,
  onPress,
  disabled,
  size,
  width,
  weight,
  marginVertical,
  font
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={{ marginVertical: Spacing[marginVertical] || 0 }}
  >
    <LinearGradient
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      colors={[Colors.buttonGradient[0], Colors.buttonGradient[1]]}

      style={[
        styles.btnGradient,
        {
          opacity: disabled ? 0.4 : 1,
          width: width || '100%',
          height: size === 'small' ? 20 : 50,
          justifyContent: 'center'
        }
      ]}
    >
      <Utils.Text weight={weight} size={'button'} font={font}>{text}</Utils.Text>
    </LinearGradient>
  </TouchableOpacity>
)

ButtonGradient.defaultProps = {
  disabled: false,
  size: 'large',
  font: 'medium'
}

ButtonGradient.propTypes = {
  disabled: PropTypes.bool,
  size: PropTypes.string
}

const styles = StyleSheet.create({
  btnGradient: {
    alignItems: 'center',
    borderRadius: 4
  }
})

export default ButtonGradient
