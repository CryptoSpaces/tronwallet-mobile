// Dependencies
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

// Utils
import { Row, Text, FormInput } from '../../../components/Utils'
import { Colors } from '../../../components/DesignSystem'

const InputAmount = ({ input, onOutput, max, id }) => {
  return (
    <Row align='center' justify='space-between'>
      <TouchableOpacity style={styles.button} onPress={() => onOutput(Number(input) - 1, id)}>
        <Text size='xsmall'>-</Text>
      </TouchableOpacity>
      <FormInput
        underlineColorAndroid='transparent'
        keyboardType='numeric'
        onChangeText={(v) => onOutput(v, id)}
        placeholderTextColor='#fff'
        placeholder='0'
        value={input.toString()}
        style={{ marginLeft: 5, marginRight: 5 }}
      />
      <TouchableOpacity style={styles.button} onPress={() => onOutput(Number(input) + 1, id)}>
        <Text size='xsmall'>+</Text>
      </TouchableOpacity>
    </Row>
  )
  // <Wrapper>
  //   <Button onClick={() => onOutput(input - 1, id)} disabled={input === 0}>
  //     -
  //   </Button>
  //   <Label>{input}</Label>
  //   <Button
  //     onClick={() => onOutput(input + 1, id)}
  //     disabled={input === Number(max)}
  //   >
  //     +
  //   </Button>
  // </Wrapper>
}

InputAmount.propTypes = {
  input: PropTypes.string,
  onOutput: PropTypes.func,
  max: PropTypes.number,
  id: PropTypes.string
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.secondaryText,
    borderColor: Colors.secondaryText,
    borderRadius: 5,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default InputAmount
