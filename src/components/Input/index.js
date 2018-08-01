import React from 'react'

import * as Elements from './elements'

const thousandSeparator = /(\d)(?=(\d{3})+(\s|$))/g

const formatText = (text, numbersOnly, onChangeText, type) => {
  if (numbersOnly) {
    if (type === 'int') {
      return onChangeText(text.replace(/[^0-9]/g, ''))
    } else {
      const decimal = text.replace(/[^0-9.]/g, '').split('.')
      if (decimal.length >= 2) {
        return onChangeText(`${decimal[0]}.${decimal[1].substr(0, 6)}`)
      } else {
        return onChangeText(text.replace(/[^0-9.]/g, ''))
      }
    }
  }
  return onChangeText(text)
}

const formatValue = (value, numbersOnly, type) => {
  if (numbersOnly) {
    if (type === 'int') {
      return value.replace(thousandSeparator, '$1,')
    } else {
      const decimal = value.split('.')
      if (decimal.length >= 2) {
        return `${decimal[0].replace(thousandSeparator, '$1,')}.${decimal[1].substr(0, 6)}`
      } else {
        return value.replace(thousandSeparator, '$1,')
      }
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
  type,
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
        value={formatValue(value, numbersOnly, type)}
        autoCorrect={false}
        autoCapitalize='none'
        underlineColorAndroid='transparent'
        placeholderTextColor='#66688F'
        onChangeText={text => formatText(text, numbersOnly, onChangeText, type)}
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
