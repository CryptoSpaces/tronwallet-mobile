import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Answers } from 'react-native-fabric'

import {
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'
import ProgressBar from 'react-native-progress/Bar'
import moment from 'moment'

import { orderBalances } from '../../utils/balanceUtils'
import Client, { ONE_TRX } from '../../services/client'
import getAssetsStore from '../../store/assets'
import banner from '../../assets/images/banner.jpg'
import guarantee from '../../assets/guarantee.png'
import NavigationHeader from '../../components/Navigation/Header'

import {
  Container,
  Row
} from '../../components/Utils'

import {
  Card,
  CardContent,
  TokenPrice,
  Featured,
  Text,
  TokenName,
  VerticalSpacer,
  FeaturedText,
  FeaturedTokenName,
  FeaturedTokenPrice,
  HorizontalSpacer
} from './Elements'
import { rgb } from '../../../node_modules/polished'

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
    Answers.logContentView('Tab', 'Participate')
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
        `issuedPercentage < 100 AND name <> 'TRX' AND startTime < ${Date.now()} AND endTime > ${Date.now()}`
      )
      .map(item => Object.assign({}, item))
  }

  _updateAssetsStore = async assets => {
    const store = await getAssetsStore()
    store.write(() => assets.map(item => store.create('Asset', item, true)))
  }

  _renderSlide = () => (
    <Image source={banner} style={{ height: 232 }} />
  )

  _renderCardContent = ({ name, price, issuedPercentage, endTime, isFeatured }) => (
    <React.Fragment>
      {isFeatured && (
        <Featured>
          <FeaturedText align='center'>FEATURED</FeaturedText>
        </Featured>
      )}
      <CardContent>
        <Row justify='space-between'>
          {isFeatured ? (
            <Row>
              <FeaturedTokenName>{name}</FeaturedTokenName>
              <HorizontalSpacer size={4} />
              <Image alignSelf='flex-start' source={guarantee} style={{ height: 14, width: 14 }} />
            </Row>
          ) : (
            <TokenName>{name}</TokenName>
          )}
          {isFeatured ? <FeaturedTokenPrice>{price / ONE_TRX} TRX</FeaturedTokenPrice> : <TokenPrice>{price / ONE_TRX} TRX</TokenPrice>}
        </Row>
        <VerticalSpacer size={15} />
        <ProgressBar
          progress={Math.round(issuedPercentage) / 100}
          borderWidth={0}
          width={null} height={4}
          color={rgb(6, 231, 123)}
          unfilledColor={rgb(25, 26, 42)}
        />
        <VerticalSpacer size={6} />
        <Row justify='space-between'>
          <Text>Ends {moment(endTime).fromNow()}</Text>
          <Text>{Math.round(issuedPercentage)}%</Text>
        </Row>
      </CardContent>
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
        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Buy', { item }) }}>
          <Card>
            {isFeatured ? (
              <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={[rgb(255, 68, 101), rgb(246, 202, 29)]}
              >
                {this._renderCardContent(item)}
              </LinearGradient>
            ) : (
              this._renderCardContent(item)
            )}
          </Card>
          <VerticalSpacer size={11} />
        </TouchableOpacity>
      </React.Fragment>
    )
  }

  render () {
    const { assetList } = this.state
    const ordernedBalances = orderBalances(assetList)

    return (
      <Container>
        <ScrollView>
          {this._renderSlide()}
          <VerticalSpacer size={20} />
          <FlatList
            data={ordernedBalances}
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
