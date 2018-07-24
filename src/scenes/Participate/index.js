import React from 'react'
import { Answers } from 'react-native-fabric'

import {
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  View,
  Dimensions
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'
import ProgressBar from 'react-native-progress/Bar'
import moment from 'moment'
import { debounce } from 'lodash'

import { Colors } from '../../components/DesignSystem'
import { orderBalances } from '../../utils/balanceUtils'
import Client, { ONE_TRX } from '../../services/client'
import getAssetsStore from '../../store/assets'
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
    const { params } = navigation.state
    return {
      header: (
        <NavigationHeader
          title='PARTICIPATE'
          onSearch={name => params._onSearch(name)}
          onSearchPressed={() => params._onSearchPressed()}
        />
      )
    }
  }

  state = {
    assetList: [],
    currentList: [],
    loading: false,
    hideSlide: false
  }

  async componentDidMount () {
    Answers.logContentView('Tab', 'Participate')
    this._onSearch = debounce(this._onSearch, 350)
    this.props.navigation.setParams({
      _onSearch: this._onSearch,
      _onSearchPressed: this._onSearchPressed
    })
    const assetList = await this._getAssetsFromStore()
    this.setState({ assetList, currentList: assetList })
    this._loadData()
  }

  _loadData = async () => {
    try {
      const tokenList = await Client.getTokenList()
      await this._updateAssetsStore(tokenList)

      const assetList = await this._getAssetsFromStore()

      this.setState({ assetList, currentList: assetList })
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

  _renderSlide = () => {
    const { hideSlide } = this.state

    if (hideSlide) {
      return null
    }

    return (
      <View>
        <Image source={require('../../assets/images/banner.png')} style={{ height: 232, width: Dimensions.get('window').width }} resizeMode='contain' />
        <VerticalSpacer size={20} />
      </View>
    )
  }

  _onSearchPressed = () => {
    const { hideSlide } = this.state

    this.setState({ hideSlide: !hideSlide })
    if (hideSlide) this._onSearch('')
  }

  _onSearch = (name) => {
    const { assetList } = this.state
    this.setState({ loading: true })
    if (name) {
      this.setState({ hideSlide: true })
      const regex = new RegExp(name.toLowerCase(), 'i')
      const filtered = assetList.filter(asset => asset.name.toLowerCase().match(regex))
      this.setState({ currentList: filtered, loading: false })
    } else {
      this.setState({ currentList: assetList, loading: false, hideSlide: false })
    }
  }

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

  _renderLoading = () => {
    const { loading } = this.state

    if (loading) {
      return (
        <React.Fragment>
          <ActivityIndicator size='small' color={Colors.primaryText} />
          <VerticalSpacer size={10} />
        </React.Fragment>
      )
    }

    return null
  }

  render () {
    const { currentList } = this.state
    const orderedBalances = orderBalances(currentList)

    return (
      <Container>
        {this._renderSlide()}
        <VerticalSpacer size={20} />
        {this._renderLoading()}
        <FlatList
          data={orderedBalances}
          renderItem={({ item }) => this._renderCard(item)}
          keyExtractor={asset => asset.name}
          scrollEnabled
        />
      </Container>
    )
  }
}

export default ParticipateHome
