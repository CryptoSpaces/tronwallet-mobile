import React, { PureComponent } from 'react'
import { Modal, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo'
import * as Utils from '../../components/Utils'
import { Colors, Spacing } from '../../components/DesignSystem'

class VoteDetailScreen extends PureComponent {
  state = {
    amount: '0'
  }

  onChange = (value, field) => {
    this.setState({
      [field]: value
    })
  }

  render () {
    const { item } = this.props
    const { amount } = this.state
    console.log(amount)
    // if (item) {
    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={false}
        onRequestClose={() => {}}
      >
        <Utils.Container>
          <Utils.Content>
            <Utils.StatusBar transparent />
            <Utils.Text secondary>URL: </Utils.Text>
            <Utils.Text>http://getty.io</Utils.Text>
            <Utils.Text secondary>ADDRESS: </Utils.Text>
            <Utils.Text>
              123123123123123213123123123
            </Utils.Text>
            <Utils.Text secondary>AMOUNT: </Utils.Text>
            <Utils.FormInput
              underlineColorAndroid='transparent'
              keyboardType='numeric'
              onChangeText={(text) => this.onChange(text, 'amount')}
            />
            <TouchableOpacity onPress={() => this.showModal(item)}>
              <LinearGradient
                start={[0, 1]}
                end={[1, 0]}
                colors={[Colors.primaryGradient[0], Colors.primaryGradient[1]]}
                style={{ padding: Spacing.small, alignItems: 'center', borderRadius: 5, width: '100%' }}
              >
                <Utils.Text size='xsmall'>Vote</Utils.Text>
              </LinearGradient>
            </TouchableOpacity>
          </Utils.Content>
          {/* <TextInput
            placeholder='Amount'
            placeholderTextColor="#fff"
            keyboardType="numeric"
            style={styles.amount}
            onChange={() => {}}
            value={amount}
          /> */}
        </Utils.Container>
      </Modal>
    )
    // }
  // return null;
  }
}

// const styles = StyleSheet.create({
//   amount: {
//     color: Colors.primaryText
//   }
// })

export default VoteDetailScreen
