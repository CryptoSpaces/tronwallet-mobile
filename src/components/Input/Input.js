import React from 'react'
import { RevisedFormInput, InputContainer, FormLabel, FormIcon, InputBorderContainer } from '../Utils'
import { Colors } from '../DesignSystem'

const Input = ({label, icon, type, value, onChange, placeholder }) => (
  <InputContainer>
    <FormLabel>{label}</FormLabel>
    <InputBorderContainer>
      {icon && (
        <FormIcon name={icon} size={24} color={Colors.primaryText} />
      )}
      <RevisedFormInput 
        keyboardType={type}
        autoCorrect={false}
        value={value}
        onChangeText={(value) => onChange(value)}
        returnKeyType='send'
        placeholder={placeholder}
      />
    </InputBorderContainer>
  </InputContainer>
)

export default Input