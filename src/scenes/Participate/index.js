import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ScrollView, TouchableOpacity, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import ProgressBar from 'react-native-progress/Bar'

import banner from '../../assets/images/banner.jpg'
import NavigationHeader from '../../components/Navigation/Header'

import {
  Container,
  Content,
  Row,
  VerticalSpacer,
  Text
} from '../../components/Utils'

import { Card, CardHeader, Featured } from './Elements'
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

  _renderSlide = () => (
    <Image source={banner} style={{ height: 200 }} />
  )

  _renderCardContent = isFeatured => (
    <React.Fragment>
      {isFeatured && (
        <Featured>
          <Text align='center'>FEATURED</Text>
        </Featured>
      )}
      <Content>
        <Row justify='space-between'>
          <CardHeader>TRONCash</CardHeader>
          <CardHeader>0.10 TRX</CardHeader>
        </Row>
        <VerticalSpacer size='medium' />
        <ProgressBar progress={0.7} borderWidth={0} width={null} color={Colors.confirmed} unfilledColor={Colors.background} />
        <VerticalSpacer />
        <Row justify='space-between'>
          <Text>End in 165 days</Text>
          <Text>70%</Text>
        </Row>
      </Content>
    </React.Fragment>
  )

  _renderCard = isFeatured => {
    return (
      <React.Fragment>
        <TouchableOpacity onPress={() => { }}>
          <Card>
            {isFeatured ? (
              <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={[Colors.buttonGradient[0], Colors.buttonGradient[1]]}
              >
                {this._renderCardContent(isFeatured)}
              </LinearGradient>
            ) : (
              this._renderCardContent()
            )}
          </Card>
          <VerticalSpacer size='medium' />
        </TouchableOpacity>
      </React.Fragment>
    )
  }

  render () {
    return (
      <Container>
        <ScrollView>
          {this._renderSlide()}
          <VerticalSpacer size='medium' />
          {this._renderCard(true)}
          {this._renderCard()}
        </ScrollView>
      </Container>
    )
  }
}

export default ParticipateHome
