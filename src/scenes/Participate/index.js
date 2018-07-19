import React from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import NavigationHeader from '../../components/Navigation/Header'
import { Container, Row, VerticalSpacer, View, Text } from '../../components/Utils'
import { Card, CardHeader } from './Elements'
import { Colors } from '../../components/DesignSystem'

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

  _renderCard = () => {
    return (
      <Card>
        <Row justify='space-between'>
          <CardHeader>TRONCash</CardHeader>
          <CardHeader>0.10 TRX</CardHeader>
        </Row>
        <VerticalSpacer size='medium' />
        <View borderRadius={10} height={3} background={Colors.green} />
        <VerticalSpacer />
        <Row justify='space-between'>
          <Text>End in 165 days</Text>
          <Text>70%</Text>
        </Row>
      </Card>
    )
  }

  render () {
    return (
      <Container>
        <ScrollView>
          {this._renderCard()}
        </ScrollView>
      </Container>
    )
  }
}

export default ParticipateHome
