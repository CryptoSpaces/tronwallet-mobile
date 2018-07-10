import React from 'react'

import * as Utils from '../Utils'

const Input = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  leftContent,
  rightContent,
  textAlign
}) => (
  <Utils.InputContainer>
    <Utils.FormLabel>{label}</Utils.FormLabel>
    <Utils.InputBorderContainer>
      {leftContent && (
        <React.Fragment>
          {leftContent()}
          <Utils.HorizontalSpacer />
        </React.Fragment>
      )}
      <Utils.RevisedFormInput
        keyboardType={type}
        autoCorrect={false}
        value={value}
        align={textAlign}
        underlineColorAndroid='transparent'
        onChangeText={value => onChange(value)}
        returnKeyType='send'
        placeholder={placeholder}
      />
      <Utils.HorizontalSpacer />
      {rightContent && (
        <React.Fragment>
          <Utils.HorizontalSpacer />
          {rightContent()}
        </React.Fragment>
      )}
    </Utils.InputBorderContainer>
  </Utils.InputContainer>
)

export default Input
