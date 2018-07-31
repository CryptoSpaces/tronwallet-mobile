import React from 'react'
import { Clipboard } from 'react-native'
import { Colors, FontSize } from './DesignSystem'
import * as Utils from './Utils'
import Ionicons from 'react-native-vector-icons/Ionicons'
import PropTypes from 'prop-types'

const CopyInput = ({ onCopyText, value }) => {
  const paste = async () => {
    try {
      await Clipboard.setString(value)
      onCopyText(true)
    } catch (error) {
      onCopyText(false)
    }
  }
  return (
    <Utils.Row style={{ alignItems: 'center' }}>
      <Utils.FormInput
        multiline
        value={value}
        editable={false}
        style={{ flex: 1, width: '100%', paddingLeft: 0, paddingRight: 0 }}
        underlineColorAndroid='transparent'
      />
      <Utils.PasteButton onPress={paste}>
        <Ionicons
          name='md-copy'
          size={FontSize['small']}
          color={Colors.primaryText}
        />
      </Utils.PasteButton>
    </Utils.Row>
  )
}

CopyInput.propsType = {
  value: PropTypes.string.isRequired,
  onCopyText: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired
}

CopyInput.defaultProps = {
  onCopyText: () => {}
}

export default CopyInput
