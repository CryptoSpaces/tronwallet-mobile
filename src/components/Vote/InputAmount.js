// Dependencies
import React from 'react'
import PropTypes from 'prop-types'

// Utils
import { Row, FormInput } from '../Utils'
import { Colors } from '../DesignSystem'

const InputAmount = ({ input, onOutput, id }) => (
  <Row align='center' justify='space-between'>
    <FormInput
      underlineColorAndroid='transparent'
      keyboardType='numeric'
      onChangeText={(v) => onOutput(v, id)}
      placeholderTextColor={Colors.secondaryText}
      placeholder='Vote'
      value={input}
      style={{ marginLeft: 5, marginRight: 5, minWidth: 50 }}
    />
  </Row>
)

InputAmount.propTypes = {
  input: PropTypes.string,
  onOutput: PropTypes.func,
  id: PropTypes.string
}

export default InputAmount
