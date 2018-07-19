import React from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import * as Utils from '../../components/Utils'
import NavigationHeader from '../../components/Navigation/Header'

class ParticipateHome extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <NavigationHeader
          title='PARTICIPATE'
          rightButton={
            <TouchableOpacity onPress={() => { }}>
              <Ionicons name='ios-search' color='white' size={21} />
            </TouchableOpacity>
          }
        />
      )
    }
  }

  render () {
    return (
      <Utils.Container>
        <ScrollView>
          PARTICIPATE
        </ScrollView>
      </Utils.Container>
    )
  }
}

export default ParticipateHome
