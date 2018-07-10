import React from 'react'

import * as Utils from '../Utils'

const Input = ({
  label,
  leftContent,
  rightContent,
  ...props
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
        autoCorrect={false}
        underlineColorAndroid='transparent'
        {...props}
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

Input.defaultProps = {
  returnKeyType: 'send'
}

export default Input
