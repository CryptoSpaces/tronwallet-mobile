import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo'
import { Colors, Spacing } from './DesignSystem'
import * as Utils from './Utils'

const ButtonGradient = ({ text, onPress, disabled }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled}>
    <LinearGradient
      start={[0, 1]}
      end={[1, 0]}
      colors={[Colors.primaryGradient[0], Colors.primaryGradient[1]]}
      style={styles.btnGradient}>
      <Utils.Text>{text}</Utils.Text>
    </LinearGradient>
  </TouchableOpacity>
)

ButtonGradient.defaultProps = {
  disabled: false
}

const styles = StyleSheet.create({
  btnGradient: {
    padding: Spacing.medium,
    alignItems: 'center',
    borderRadius: 4,
    width: '100%'
  }
})

export default ButtonGradient
