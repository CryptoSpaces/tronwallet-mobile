import React from 'react'
import PropTypes from 'prop-types'

import { Colors } from '../DesignSystem'
import * as Utils from '../Utils'

const InOutOption = ({ title, disabled, background, onPress, width }) => (
  <Utils.NumKeyWrapper flexBasis={50}>
    <Utils.BorderButton disabled={disabled} background={background || Colors.background} onPress={onPress}>
      <Utils.Text font='regular' letterSpacing={0.9} size='xsmall' color={Colors.buttonText}>{title}</Utils.Text>
    </Utils.BorderButton>
  </Utils.NumKeyWrapper>
)

InOutOption.propType = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  background: PropTypes.string
}

export default InOutOption
