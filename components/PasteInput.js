import React from 'react'
import { Clipboard } from 'react-native'
import { Colors, FontSize } from './DesignSystem'
import * as Utils from './Utils'
import { Ionicons } from '@expo/vector-icons'
import PropTypes from 'prop-types'

const PasteInput = ({ onChangeText, field, value }) => {
  let content = null
  const paste = async () => {
    content = await Clipboard.getString()
    onChangeText(content, field)
  }
  return (
    <Utils.Row style={{ alignItems: 'center' }}>
      <Utils.FormInput value={value} style={{ flex: 1, width: '100%' }} underlineColorAndroid='transparent' onChangeText={onChangeText} />
      <Utils.PasteButton onPress={paste}>
        <Ionicons name='md-clipboard' size={FontSize['small']} color={Colors.primaryText} />
      </Utils.PasteButton>
    </Utils.Row>
  )
}

PasteInput.propsType = {
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired
}

export default PasteInput
