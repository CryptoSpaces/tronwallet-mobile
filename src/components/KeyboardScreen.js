import React from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Colors } from './DesignSystem'

const KeyboardScreen = ({children, ios, android}) => (
  <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: Colors.background }}
    enabled
    {...android}
  >
    <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: Colors.background }}
      {...ios}
    >
      {children}
    </KeyboardAwareScrollView>
  </KeyboardAvoidingView>
)

export default KeyboardScreen
