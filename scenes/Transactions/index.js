
import React, { Component } from 'react'
import { ActivityIndicator, NetInfo, SafeAreaView } from 'react-native'
import * as Utils from '../../components/Utils'

const firstLetterCapitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

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
