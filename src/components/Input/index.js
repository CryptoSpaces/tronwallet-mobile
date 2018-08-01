import React from 'react'

import * as Elements from './elements'

const thousandSeparator = /(\d)(?=(\d{3})+(\s|$))/g
const cleanNumber = /[^0-9.]/g

const formatText = (text, numbersOnly, onChangeText) => {
  if (numbersOnly) {
    const decimal = text.replace(cleanNumber, '').split('.')
    if (decimal.length >= 2) {
      return onChangeText(`${decimal[0]}.${decimal[1].substr(0, 6)}`)
    } else {
      return onChangeText(text)
    }
  }
  return onChangeText(text)
}

const formatValue = (value, numbersOnly) => {
  if (numbersOnly) {
    const decimal = value.split('.')
    if (decimal.length >= 2) {
      return `${decimal[0].replace(thousandSeparator, '$1,')}.${decimal[1].substr(0, 6)}`
    } else {
      return value.replace(thousandSeparator, '$1,')
    }
  } else {
    return value
  }
}

const Input = ({
  innerRef,
  label,
  leftContent,
  rightContent,
  onChangeText,
  value,
  numbersOnly,
  ...props
}) => (
  <Elements.Wrapper>
    <Elements.LabelWrapper>
      <Elements.Label>{label}</Elements.Label>
    </Elements.LabelWrapper>
    <Elements.InputWrapper>
      {leftContent && leftContent()}
      {/* Do not change the order of props in the component
        below. It needs to be first so that keyboardType comes
        before autoCapitalize or it won't show with the decimal
        button.  */}
      <Elements.TextInput
        {...props}
        innerRef={innerRef}
        value={formatValue(value, numbersOnly)}
        autoCorrect={false}
        autoCapitalize='none'
        underlineColorAndroid='transparent'
        placeholderTextColor='#66688F'
        onChangeText={text => formatText(text, numbersOnly, onChangeText)}
      />
      {rightContent && rightContent()}
    </Elements.InputWrapper>
  </Elements.Wrapper>
)

Input.defaultProps = {
  returnKeyType: 'send',
  numbersOnly: false
}

export default Input
