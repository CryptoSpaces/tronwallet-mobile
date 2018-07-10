import React from 'react'
import { Clipboard } from 'react-native'
import { Colors, FontSize } from './DesignSystem'
import * as Utils from './Utils'
import Ionicons from 'react-native-vector-icons/Ionicons'
import PropTypes from 'prop-types'

const PasteInput = ({ onChangeText, field, value, qrScan }) => {
  let content = null
  const paste = async () => {
    content = await Clipboard.getString()
    onChangeText(content, field)
  }
  return (
    <Utils.Row align='center'>
      <Utils.FormInput
        value={value}
        style={{ flex: 1, width: '100%' }}
        underlineColorAndroid='transparent'
        onChangeText={onChangeText}
        autoCapitalize='none'
        autoCorrect={false}
        marginTop={15}
      />
      <Utils.PasteButton onPress={paste}>
        <Ionicons
          name='md-clipboard'
          size={FontSize['small']}
          color={Colors.primaryText}
        />
      </Utils.PasteButton>
      {qrScan && (
        <Utils.PasteButton onPress={qrScan}>
          <Ionicons
            name='ios-qr-scanner'
            size={FontSize['small']}
            color={Colors.primaryText}
          />
        </Utils.PasteButton>
      )}
    </Utils.Row>
  )
}

PasteInput.propsType = {
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired
}

export default PasteInput
