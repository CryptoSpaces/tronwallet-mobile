import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { RevisedFormInput, InputContainer } from '../Utils'

const Input = ({label, icon, type, value, onChange }) => (
  <InputContainer>
    <FormLabel>{label}</FormLabel>
    {icon && (
      <Ionicons name={icon} size={24} color={Colors.primaryText} />
    )}
    <RevisedFormInput 
      keyboardType={type}
      autoCorrect={false}
      value={value}
      onChangeText={(value) => onChange(value)}
      returnKeyType='send'
    />
  </InputContainer>
)

export default Input