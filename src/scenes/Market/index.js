import React, { Component, Fragment } from 'react'
import axios from 'axios'
import * as shape from 'd3-shape'
import { AreaChart, Grid } from 'react-native-svg-charts'
import { Path, Circle, G } from 'react-native-svg'
import { ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import { Motion, spring, presets } from 'react-motion'
import { Answers } from 'react-native-fabric'
import Config from 'react-native-config'

import Gradient from '../../components/Gradient'
import tl from '../../utils/i18n'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import FadeIn from '../../components/Animations/FadeIn'

const PRICE_PRECISION = 4

const Line = ({ line }) => (
  <Path
    key={'line'}
    d={line}
    stroke={'url(#gradient)'}
    fill={'none'}
    strokeWidth={3}
  />
)

const Cursor = ({ x, y, data, selectedIndex, onPress }) => {
  return data.map((item, index) => (
    <G key={index} onPress={() => onPress(index)}>
      <Circle
        key={`circle-1-${index}`}
        cx={x(index)}
        cy={y(item.close)}
        r={16}
        fill={'white'}
        fillOpacity={index === selectedIndex ? 1 : 0}
      />
      <Circle
        key={`circle-2-${index}`}
        cx={x(index)}
        cy={y(item.close)}
        r={6}
        fill={'rgb(179, 181, 212)'}
        fillOpacity={index === selectedIndex ? 1 : 0}
      />
    </G>
  ))
}

class MarketScene extends Component {
  state = {
    graph: {
      loading: true,
      data: null,
      timeSpan: tl.t('market.time.hour')
    },
    high: null,
    low: null,
    marketcap: null,
    volume: null,
    supply: null,
    price: 0,
    selectedIndex: -1
  }

  componentDidMount () {
    Answers.logContentView('Tab', 'Market')
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this._loadData()
      this._loadGraphData()
    })
  }

  componentWillUnmount () {
    this._navListener.remove()
  }

  get timeSpans () {
    return [tl.t('market.time.hour'), tl.t('market.time.day'), tl.t('market.time.week'), tl.t('market.time.month'), tl.t('market.time.all')]
  }

  _loadData = async () => {
    const { data: { data } } = await axios.get(Config.TRX_PRICE_API)
    this.setState({
      marketcap: data.quotes.USD.market_cap,
      volume: data.quotes.USD.volume_24h,
      supply: data.circulating_supply,
      price: data.quotes.USD.price
    })
  }

  _loadGraphData = async () => {
    this.setState({
      selectedIndex: -1,
      graph: Object.assign({}, this.state.graph, {
        data: this.state.graph.data ? this.state.graph.data.map(() => ({ close: 0 })) : null
      })
    })
    let url
    switch (this.state.graph.timeSpan) {
      case '1H':
        url = `${Config.TRX_HISTORY_API}/histominute?fsym=TRX&tsym=USD&limit=59`
        break
      case '1D':
        url = `${Config.TRX_HISTORY_API}/histohour?fsym=TRX&tsym=USD&limit=23`
        break
      case '1W':
        url = `${Config.TRX_HISTORY_API}/histoday?fsym=TRX&tsym=USD&limit=6`
        break
      case '1M':
        url = `${Config.TRX_HISTORY_API}/histoday?fsym=TRX&tsym=USD`
        break
      case '1Y':
        url = `${Config.TRX_HISTORY_API}/histoday?fsym=TRX&tsym=USD&limit=364`
        break
      case 'ALL':
        url = `${Config.TRX_HISTORY_API}/histoday?fsym=TRX&tsym=USD&allData=true`
        break
    }
    const response = await axios.get(url, { credentials: false })
    this.setState({
      graph: Object.assign({}, this.state.graph, {
        loading: false,
        data: response.data.Data.map(({ close, high, low }) => ({ close, high, low }))
      })
    })
  }

  _formatNumber = n => n.toFixed().replace(/(\d)(?=(\d{3})+(\s|$))/g, '$1,')

  _changeGraphTimeSpan = timeSpan => {
    this.setState(
      {
        graph: Object.assign({}, this.state.graph, { timeSpan, loading: true })
      },
      this._loadGraphData
    )
  }

  _handleGraphPress = (index) => {
    const { high, low } = this.state.graph.data[index]
    this.setState({ selectedIndex: index, high, low })
  }

  _renderHeader = () => {
    const { price } = this.state

    return (
      <Utils.ContentWithBackground
        source={require('../../assets/market-header.png')}
        resizeMode='stretch'
      >
        <Utils.StatusBar transparent />
        <Utils.View align='center'>
          <Image
            source={require('../../assets/tron-logo-small.png')}
            resizeMode='contain'
            style={{ height: 60 }}
          />
          <Utils.VerticalSpacer size='medium' />
          <Utils.Text secondary>{tl.t('trxPrice')}</Utils.Text>
        </Utils.View>
        <Utils.VerticalSpacer size='small' />
        <Utils.Row justify='center'>
          <Utils.View>
            <Utils.Row>
              <Utils.Text secondary />
              <Utils.HorizontalSpacer />
              <Motion
                defaultStyle={{ data: 0 }}
                style={{ data: spring(price, presets.gentle) }}
              >
                {value => (
                  <Utils.Text size='medium'>
                    $ {value.data.toFixed(PRICE_PRECISION)}
                  </Utils.Text>
                )}
              </Motion>
            </Utils.Row>
          </Utils.View>
        </Utils.Row>
        <Utils.VerticalSpacer size='large' />
      </Utils.ContentWithBackground>
    )
  }

  _renderValues = () => {
    const { selectedIndex, high, low, marketcap, volume, supply } = this.state
    const decimalFormatter = (value) => `$ ${value.toFixed(4)}`
    const integerFormatter = (value) => `$ ${this._formatNumber(value)}`
    const supplyFormatter = (value) => this._formatNumber(value)

    return (
      <FadeIn name='market-info'>
        <Utils.View>
          {selectedIndex !== -1 && (
            <Fragment>
              {this._renderValue(high, decimalFormatter)}
              {this._renderValue(low, decimalFormatter)}
            </Fragment>
          )}
          {this._renderValue(marketcap, integerFormatter)}
          {this._renderValue(volume, integerFormatter)}
          {this._renderValue(supply, supplyFormatter, true)}
        </Utils.View>
      </FadeIn>
    )
  }

  _renderValue = (value, formatter, isLast) => (
    <Fragment>
      <Motion
        defaultStyle={{ data: 0 }}
        style={{ data: spring(value, presets.gentle) }}
      >
        {value => (
          <Utils.Text align='right' lineHeight={20}>
            {formatter(value.data)}
          </Utils.Text>
        )}
      </Motion>
      {!isLast && <Utils.VerticalSpacer size='small' />}
    </Fragment>
  )

  _renderLabels = () => (
    <Utils.View>
      {this.state.selectedIndex !== -1 && (
        <Fragment>
          {this._renderLabel(tl.t('market.highest'))}
          {this._renderLabel(tl.t('market.lowest'))}
        </Fragment>
      )}
      {this._renderLabel(tl.t('market.volume'))}
      {this._renderLabel(tl.t('market.cap'))}
      {this._renderLabel(tl.t('market.supply'), true)}
    </Utils.View>
  )

  _renderLabel = (label, isLast) => (
    <Fragment>
      <Utils.Text secondary size='xsmall' lineHeight={20}>
        {label}
      </Utils.Text>
      {!isLast && <Utils.VerticalSpacer size='small' />}
    </Fragment>
  )

  _renderChart = () => {
    const { selectedIndex, graph } = this.state

    return (
      <Fragment>
        <FadeIn name='graph'>
          <Utils.Row justify='space-evenly'>
            {this.timeSpans.map(timeSpan => (
              <TouchableOpacity
                key={timeSpan}
                onPress={() => this._changeGraphTimeSpan(timeSpan)}
              >
                <Utils.Text secondary={graph.timeSpan !== timeSpan}>
                  {timeSpan}
                </Utils.Text>
              </TouchableOpacity>
            ))}
          </Utils.Row>
        </FadeIn>
        <AreaChart
          style={{ flex: 1 }}
          data={graph.data || []}
          xAccessor={({ index }) => index}
          yAccessor={({ item }) => item.close}
          contentInset={{ top: 30, bottom: 30 }}
          curve={shape.curveLinear}
          svg={{ fill: 'url(#gradient)', opacity: 0.2 }}
          numberOfTicks={4}
          animate
        >
          <Grid svg={{ stroke: '#FFF', strokeOpacity: 0.1 }} />
          <Gradient />
          <Line />
          <Cursor selectedIndex={selectedIndex} onPress={(index) => this._handleGraphPress(index)} />
        </AreaChart>
      </Fragment>
    )
  }

  render () {
    const { marketcap, volume, supply, graph } = this.state

    return (
      <Utils.Container>
        {this._renderHeader()}
        <Utils.Content background={Colors.background}>
          <Utils.Row justify='space-between' align='center'>
            {this._renderLabels()}
            {(!marketcap || !volume || !supply) && (
              <FadeIn name='market-info-loading'>
                <Utils.Content>
                  <ActivityIndicator size='small' color={Colors.primaryText} />
                </Utils.Content>
              </FadeIn>
            )}
            {marketcap &&
              volume &&
              supply && (
                this._renderValues()
              )}
          </Utils.Row>
        </Utils.Content>
        {graph.loading && (
          <Utils.Content flex={1} justify='center' align='center'>
            <FadeIn name='graph-load'>
              <ActivityIndicator size='large' color={Colors.primaryText} />
            </FadeIn>
          </Utils.Content>
        )}
        {!graph.loading && (
          this._renderChart()
        )}
      </Utils.Container>
    )
  }
}

export default MarketScene
