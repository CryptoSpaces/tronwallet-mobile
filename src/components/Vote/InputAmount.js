// Dependencies
import React from 'react'
// import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

// Utils
import { Row, FormInput } from '../../../components/Utils'
// import { Colors } from '../../../components/DesignSystem'

const InputAmount = ({ input, onOutput, max, id }) => (
  <Row align='center' justify='space-between'>
    {/* <TouchableOpacity style={styles.button} onPress={() => onOutput(Number(input) - 1, id)}>
      <Text size='xsmall'>-</Text>
    </TouchableOpacity> */}
    <FormInput
      underlineColorAndroid='transparent'
      keyboardType='numeric'
      onChangeText={(v) => onOutput(v, id)}
      placeholderTextColor='#fff'
      placeholder='0'
      value={input}
      style={{ marginLeft: 5, marginRight: 5, minWidth: 50, textAlign: 'center' }}
    />
    {/* <TouchableOpacity style={styles.button} onPress={() => onOutput(Number(input) + 1, id)}>
      <Text size='xsmall'>+</Text>
    </TouchableOpacity> */}
  </Row>
)

InputAmount.propTypes = {
  input: PropTypes.string,
  onOutput: PropTypes.func,
  max: PropTypes.number,
  id: PropTypes.string
}

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: Colors.secondaryText,
//     borderColor: Colors.secondaryText,
//     borderRadius: 5,
//     height: 20,
//     width: 20,
//     justifyContent: 'center',
//     alignItems: 'center'
//   }
// })

export default InputAmount
