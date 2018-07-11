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
    <Elements.InputWrapper>
      <Elements.LabelWrapper>
        <Elements.Label>{label}</Elements.Label>
      </Elements.LabelWrapper>
      {leftContent && leftContent()}
      <Elements.TextInput
        innerRef={innerRef}
        autoCorrect={false}
        autoCapitalize='none'
        underlineColorAndroid='transparent'
        placeholderTextColor='#66688F'
        {...props}
      />
      {rightContent && rightContent()}
    </Elements.InputWrapper>
  </Elements.Wrapper>
)

Input.defaultProps = {
  returnKeyType: 'send'
}

export default Input
