import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'

import {
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'
import ProgressBar from 'react-native-progress/Bar'
import moment from 'moment'

import Client, { ONE_TRX } from '../../services/client'
import getAssetsStore from '../../store/assets'
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

  state = {
    assetList: []
  }

  async componentDidMount () {
    const assetList = await this._getAssetsFromStore()
    this.setState({ assetList })
    this._loadData()
  }

  _loadData = async () => {
    try {
      const tokenList = await Client.getTokenList()
      await this._updateAssetsStore(tokenList)

      const assetList = await this._getAssetsFromStore()

      this.setState({ assetList })
    } catch (error) {
      this.setState({ error: error.message })
    }
  }

  _getAssetsFromStore = async () => {
    const store = await getAssetsStore()
    return store
      .objects('Asset')
      .filtered(
        `percentage < 100 AND startTime < ${Date.now()} AND endTime > ${Date.now()}`
      )
      .map(item => Object.assign({}, item))
  }

  _updateAssetsStore = async assets => {
    const store = await getAssetsStore()
    store.write(() => assets.map(item => store.create('Asset', item, true)))
  }

  _renderSlide = () => (
    <Image source={banner} style={{ height: 200 }} />
  )

  _renderCardContent = ({ name, price, percentage, endTime, isFeatured }) => (
    <React.Fragment>
      {isFeatured && (
        <Featured>
          <Text align='center'>FEATURED</Text>
        </Featured>
      )}
      <Content>
        <Row justify='space-between'>
          <CardHeader>{name}</CardHeader>
          <CardHeader>{price / ONE_TRX} TRX</CardHeader>
        </Row>
        <VerticalSpacer size='medium' />
        <ProgressBar progress={Math.trunc(percentage) / 100} borderWidth={0} width={null} color={Colors.confirmed} unfilledColor={Colors.background} />
        <VerticalSpacer />
        <Row justify='space-between'>
          <Text>Ends {moment(endTime).fromNow()}</Text>
          <Text>{Math.trunc(percentage)}%</Text>
        </Row>
      </Content>
    </React.Fragment>
  )

  _renderCard = (asset) => {
    const isFeatured = asset.name === 'TWX' || asset.name === 'GVX'
    const item = {
      ...asset,
      isFeatured
    }

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
                {this._renderCardContent(item)}
              </LinearGradient>
            ) : (
              this._renderCardContent(item)
            )}
          </Card>
          <VerticalSpacer size='medium' />
        </TouchableOpacity>
      </React.Fragment>
    )
  }

  render () {
    const { assetList } = this.state

    return (
      <Container>
        <ScrollView>
          {this._renderSlide()}
          <VerticalSpacer size='medium' />
          <FlatList
            data={assetList}
            renderItem={({ item }) => this._renderCard(item)}
            keyExtractor={asset => asset.name}
            scrollEnabled
          />
        </ScrollView>
      </Container>
    )
  }
}

export default ParticipateHome
