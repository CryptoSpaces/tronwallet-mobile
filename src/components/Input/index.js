import React from 'react'

import * as Elements from './elements'

const formatText = (text, numbersOnly, onChangeText) => {
  if (numbersOnly) {
    return onChangeText(text.replace(/[^0-9]/g, ''))
  }
  return onChangeText(text)
}

const formatValue = (value, numbersOnly) => numbersOnly
  ? value.replace(/(\d)(?=(\d{3})+(\s|$))/g, '$1,') : value

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
