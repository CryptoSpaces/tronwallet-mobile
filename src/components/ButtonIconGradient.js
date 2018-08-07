import React from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import PropTypes from 'prop-types'

import { Colors } from './DesignSystem'
import * as Utils from './Utils'

const ButtonIcon = ({
  text,
  onPress,
  disabled,
  size,
  full,
  icon
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
      activeOpacity={0.95}
      style={[styles.buttonView, {...flexProps}]}
    >
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={[Colors.primaryGradient[0], Colors.primaryGradient[1]]}
        style={[styles.gradientView, {width: size, height: size}]}
      >
        <View style={[styles.outterView, {width: size * 0.96, height: size * 0.96}]}>
          {icon}
        </View>
      </LinearGradient>
      <Utils.VerticalSpacer size='xsmall' />
      <Utils.Text size='tiny' secondary>{text}</Utils.Text>
    </TouchableOpacity>
  )
}

ButtonIcon.defaultProps = {
  disabled: false,
  size: 64
}

ButtonIcon.propTypes = {
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  icon: PropTypes.element.isRequired,
  full: PropTypes.bool

}

const styles = StyleSheet.create({
  buttonView: {
    alignItems: 'center'
  },
  gradientView: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 99
  },
  outterView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 99
  }
})

export default ButtonIcon
