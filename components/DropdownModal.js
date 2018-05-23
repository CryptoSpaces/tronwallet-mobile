import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FormInput } from './Utils'
import { FontSize } from './DesignSystem'

class DropdownModal extends Component {
  static propTypes = {
    width: PropTypes.string,
    fontSize: PropTypes.number,
    color: PropTypes.string
  }

  static defaultProps = {
    width: '90%',
    fontSize: FontSize.medium,
    color: 'white'
  }

  render () {
    const { width, fontSize, color } = this.props
    return (
      <FormInput
        underlineColorAndroid='transparent'
        value='AAAaaaBBbbbbCCCccc'
        style={{
          marginLeft: 5,
          marginRight: 5,
          width: width,
          textAlign: 'center',
          fontSize: fontSize,
          color: color
        }}
      />
    )
  }
}

export default DropdownModal
