import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import PropTypes from 'prop-types'
import { Colors, Spacing, ButtonSize } from './DesignSystem'
import * as Utils from './Utils'

const ButtonGradient = ({
  text,
  onPress,
  disabled,
  size,
  width,
  weight,
  marginVertical,
  font,
  full,
  rightRadius,
  leftRadius,
  multiColumnButton
}) => {
  const flexProps = {}
  if (full) {
    flexProps.flexGrow = 1
    flexProps.flexBasis = 0
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        marginVertical: Spacing[marginVertical] || 0,
        ...flexProps
      }}
    >
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={multiColumnButton
          ? [Colors.buttonGradient[multiColumnButton.x], Colors.buttonGradient[multiColumnButton.y]]
          : [Colors.buttonGradient[0], Colors.buttonGradient[1]]}

        style={[
          styles.btnGradient,
          {
            opacity: disabled ? 0.4 : 1,
            width: width || '100%',
            height: ButtonSize[size],
            paddingHorizontal: size === 'small' ? 8 : 16,
            justifyContent: 'center',
            borderBottomRightRadius: rightRadius,
            borderTopRightRadius: rightRadius,
            borderBottomLeftRadius: leftRadius,
            borderTopLeftRadius: leftRadius
          }
        ]}
      >
        <Utils.Text weight={weight} size='button' font={font} align='center'>{text}</Utils.Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

ButtonGradient.defaultProps = {
  disabled: false,
  size: 'large',
  font: 'medium',
  rightRadius: 4,
  leftRadius: 4
}

ButtonGradient.propTypes = {
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.string
}

const styles = StyleSheet.create({
  btnGradient: {
    alignItems: 'center'
  }
})

export default ButtonGradient
