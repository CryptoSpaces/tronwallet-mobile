import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { Colors, Spacing } from '../../components/DesignSystem'
import * as Utils from '../../components/Utils'
import Header from '../../components/Header'
// import Client from '../../src/services/client'

class VoteScene extends PureComponent {
    state = {
      userPublicKey: ''
    };

    onChange = (value, field) => {
      this.setState({
        [field]: value
      })
    }

    render () {
      return (
        <Utils.Container>
          <Utils.StatusBar transparent />
          <Header>
            <Utils.View align='center'>
              <Utils.Text size='xsmall' secondary>TOTAL VOTES</Utils.Text>
              <Utils.Text size='small'>945,622,966</Utils.Text>
            </Utils.View>
            <Utils.View align='center'>
              <Utils.Text size='xsmall' secondary>TOTAL REMAINING</Utils.Text>
              <Utils.Text size='small'>14,106</Utils.Text>
            </Utils.View>
          </Header>
          <Utils.Row style={styles.searchWrapper} justify='space-between' align='center'>
            <Utils.FormInput
              underlineColorAndroid='transparent'
              onChangeText={(text) => this.onChange(text, 'userPublicKey')}
              placeholder='Search'
              placeholderTextColor='#fff'
              style={{ width: '70%' }}
            />

          </Utils.Row>
        </Utils.Container>
      )
    }
}

const styles = StyleSheet.create({
  searchWrapper: {
    paddingLeft: 24,
    paddingRight: 24
  },
  rank: {
    paddingRight: 10
  },
  submitButton: {
    padding: Spacing.small,
    alignItems: 'center',
    borderRadius: 5,
    width: '100%'
  },
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

export default VoteScene
