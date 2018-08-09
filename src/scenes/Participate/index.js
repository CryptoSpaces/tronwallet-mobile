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
import { debounce, union } from 'lodash'

import tl from '../../utils/i18n'
import SyncButton from '../../components/SyncButton'
import { Colors } from '../../components/DesignSystem'
import { orderAssets, updateAssets } from '../../utils/assetsUtils'
import { ONE_TRX } from '../../services/client'
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
  HorizontalSpacer,
  BuyButton,
  ButtonText,
  TokensTitle
} from './Elements'
import { rgb } from '../../../node_modules/polished'

const AMOUNT_TO_FETCH = 40

class ParticipateHome extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    return {
      header: (
        <NavigationHeader
          title={tl.t('participate.title')}
          leftButton={<SyncButton
            loading={params && params.loading}
            onPress={() => { }}
          />}
          onSearch={name => params._onSearch(name)}
          onSearchPressed={() => params._onSearchPressed()}
        />
      )
    }
  }

  state = {
    assetList: [],
    currentList: [],
    start: 0,
    searching: false,
    searchMode: false
  }

  async componentDidMount () {
    Answers.logContentView('Tab', 'Participate')
    this._onSearch = debounce(this._onSearch, 350)
    this.props.navigation.setParams({
      loading: false,
      _onSearch: this._onSearch,
      _onSearchPressed: this._onSearchPressed
    })

    this._loadData()
  }

  _loadData = async () => {
    this.props.navigation.setParams({ loading: true })

    try {
      const assets = await updateAssets(0, AMOUNT_TO_FETCH)
      const filtered = assets.filter(({ issuedPercentage, name, startTime, endTime }) =>
        issuedPercentage < 100 && name !== 'TRX' && startTime < Date.now() && endTime > Date.now()
      )
      this.setState({ assetList: filtered, currentList: filtered })
    } catch (error) {
      this.setState({ error: error.message })
    } finally {
      this.props.navigation.setParams({ loading: false })
    }
  }

  _loadMore = async () => {
    const { start, assetList, searchMode } = this.state
    if (searchMode) return

    this.props.navigation.setParams({ loading: true })
    const newStart = start + AMOUNT_TO_FETCH

    try {
      const assets = await updateAssets(newStart, AMOUNT_TO_FETCH)
      const filtered = assets.filter(({ issuedPercentage, name, startTime, endTime }) =>
        issuedPercentage < 100 && name !== 'TRX' && startTime < Date.now() && endTime > Date.now()
      )
      const updatedAssets = union(assetList, filtered)

      this.setState({ start: newStart, assetList: updatedAssets, currentList: updatedAssets })
    } catch (error) {
      this.setState({ error: error.message })
    } finally {
      this.props.navigation.setParams({ loading: false })
    }
  }

  _renderSlide = () => {
    const { searchMode } = this.state

    if (searchMode) {
      return null
    }

    return (
      <View>
        <Image source={require('../../assets/images/banner.png')} style={{ height: 232, width: Dimensions.get('window').width }} resizeMode='cover' />
        <VerticalSpacer size={30} />
        <TokensTitle>
          TOKENS
        </TokensTitle>
        <VerticalSpacer size={20} />
      </View>
    )
  }

  _onSearchPressed = () => {
    const { searchMode } = this.state

    this.setState({ searchMode: !searchMode })
    if (searchMode) this._onSearch('')
  }

  _onSearch = async (name) => {
    const { assetList } = this.state

    try {
      if (name) {
        this.setState({ loading: true, searchMode: true })
        const assets = await updateAssets(0, 10, name)
        const filtered = assets.filter(({ issuedPercentage, name, startTime, endTime }) =>
          issuedPercentage < 100 && name !== 'TRX' && startTime < Date.now() && endTime > Date.now()
        )
        this.setState({ currentList: filtered, loading: false })
      } else {
        this.setState({ currentList: assetList, loading: false, searchMode: false })
      }
    } catch (error) {
      this.setState({ error: error.message })
    }
  }

  _renderCardContent = ({ name, price, issuedPercentage, endTime, verified }) => (
    <React.Fragment>
      {verified && (
        <Featured>
          <FeaturedText align='center'>{tl.t('participate.featured')}</FeaturedText>
        </Featured>
      )}
      <CardContent>
        <Row justify='space-between' align='center'>
          {verified ? (
            <Row align='center'>
              <Image source={require('../../assets/tron-logo-small.png')} style={{ height: 36, width: 36 }} />
              <HorizontalSpacer size={8} />

              <FeaturedTokenName>{name}</FeaturedTokenName>
              <HorizontalSpacer size={4} />
              <Image source={guarantee} style={{ height: 14, width: 14 }} />
            </Row>
          ) : (
            <TokenName>{name}</TokenName>
          )}
          {verified ? <FeaturedTokenPrice>{price / ONE_TRX} TRX</FeaturedTokenPrice> : <TokenPrice>{price / ONE_TRX} TRX</TokenPrice>}
        </Row>
        <VerticalSpacer size={verified ? 12 : 20} />
        <Row>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ProgressBar
              progress={Math.round(issuedPercentage) / 100}
              borderWidth={0}
              width={null} height={4}
              color={rgb(6, 231, 123)}
              unfilledColor={rgb(25, 26, 42)}
            />
            <VerticalSpacer size={6} />
            <Row justify='space-between'>
              <Text>{tl.t('ends')} {moment(endTime).fromNow()}</Text>
              <Text>{Math.round(issuedPercentage)}%</Text>
            </Row>
          </View>
          <HorizontalSpacer size={20} />
          {name === 'TWX' && (
            <BuyButton elevation={8}>
              <ButtonText>{tl.t('participate.button.buyNow')}</ButtonText>
            </BuyButton>
          )}
        </Row>
      </CardContent>
    </React.Fragment>
  )

  _renderCard = (asset) => {
    return (
      <React.Fragment>
        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Buy', { item: asset }) }}>
          <Card>
            {asset.verified ? (
              <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={[rgb(255, 68, 101), rgb(246, 202, 29)]}
                style={{ flex: 1 }}
              >
                {this._renderCardContent(asset)}
              </LinearGradient>
            ) : (
              this._renderCardContent(asset)
            )}
          </Card>
          <VerticalSpacer size={15} />
        </TouchableOpacity>
      </React.Fragment>
    )
  }

  _renderLoading = () => {
    const { searching } = this.state

    if (searching) {
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
    const { currentList, searching } = this.state
    const orderedBalances = orderAssets(currentList)

    return (
      <Container>
        {this._renderLoading()}
        <FlatList
          ListHeaderComponent={this._renderSlide()}
          data={orderedBalances}
          renderItem={({ item }) => this._renderCard(item)}
          keyExtractor={asset => asset.name}
          scrollEnabled
          removeClippedSubviews
          onEndReached={this._loadMore}
          onEndReachedThreshold={0.75}
          refreshing={searching}
        />
      </Container>
    )
  }
}

export default ParticipateHome
