import React from 'react'

import * as Elements from './elements'

const Input = ({
  innerRef,
  label,
  leftContent,
  rightContent,
  ...props
}) => (
  <Elements.Wrapper>
    <Elements.LabelWrapper>
      <Elements.Label>{label}</Elements.Label>
    </Elements.LabelWrapper>
    <Elements.InputWrapper>
      {leftContent && leftContent()}
      <Elements.TextInput
        {...props}
        innerRef={innerRef}
        autoCorrect={false}
        autoCapitalize='none'
        underlineColorAndroid='transparent'
        placeholderTextColor='#66688F'
      />
      {rightContent && rightContent()}
    </Elements.InputWrapper>
  </Elements.Wrapper>
)

Input.defaultProps = {
  returnKeyType: 'send'
}

export default Input
