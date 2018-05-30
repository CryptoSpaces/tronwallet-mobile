
import React, { Component } from 'react'
import { SafeAreaView } from 'react-native'
import * as Utils from '../../components/Utils'

class TransactionsScene extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <SafeAreaView style={{ backgroundColor: 'black' }}>
          <Utils.Header>
            <Utils.TitleWrapper>
              <Utils.Title>Transactions</Utils.Title>
            </Utils.TitleWrapper>
          </Utils.Header>
        </SafeAreaView>
      )
    }
  }

  render () {
    return (
      <Utils.Container />
    )
  }
}
export default TransactionsScene
