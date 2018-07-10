import React from 'react'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { RevisedFormInput, InputContainer, FormLabel, FormIcon, InputBorderContainer, PasteButton, FormButton, Row, FormContent } from '../Utils'
import { Colors } from '../DesignSystem'

const Input = ({label, type, value, onChange, placeholder, leftContent, rightContent }) => (
  <InputContainer>
    <FormLabel>{label}</FormLabel>
    <InputBorderContainer>
      {leftContent && (
        <FormContent>
          {leftContent()}
        </FormContent>
      )}
      <RevisedFormInput 
        keyboardType={type}
        autoCorrect={false}
        value={value}
        underlineColorAndroid='transparent'
        onChangeText={(value) => onChange(value)}
        returnKeyType='send'
        placeholder={placeholder}
      />
      {rightContent && (
        <FormContent>
          {rightContent()}
        </FormContent>
      )}
    </InputBorderContainer>
  </InputContainer>
)

export default Input