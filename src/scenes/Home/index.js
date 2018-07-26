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
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import FadeIn from '../../components/Animations/FadeIn'

const PRICE_PRECISION = 7
const LAST_HOUR = Math.round(new Date().getTime() / 1000) - 3600
const LAST_DAY = Math.round(new Date().getTime() / 1000) - 24 * 3600
const LAST_WEEK = Math.round(new Date().getTime() / 1000) - 7 * 24 * 3600
const LAST_MONTH = Math.round(new Date().getTime() / 1000) - 31 * 24 * 3600
const LAST_YEAR = Math.round(new Date().getTime() / 1000) - 365 * 24 * 3600

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
  return data.map((value, index) => (
    <G key={index} onPress={() => onPress(index)}>
      <Circle
        key={`circle-1-${index}`}
        cx={x(index)}
        cy={y(value)}
        r={16}
        fill={'white'}
        fillOpacity={index === selectedIndex ? 1 : 0}
      />
      <Circle
        key={`circle-2-${index}`}
        cx={x(index)}
        cy={y(value)}
        r={6}
        fill={'rgb(179, 181, 212)'}
        fillOpacity={index === selectedIndex ? 1 : 0}
      />
    </G>
  ))
}

class HomeScene extends Component {
  state = {
    graph: {
      loading: true,
      data: null,
      timeSpan: '1W'
    },
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
    return ['1H', '1D', '1W', '1M', '1Y', 'ALL']
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
        data: this.state.graph.data ? this.state.graph.data.map(() => 0) : null
      })
    })
    let url
    switch (this.state.graph.timeSpan) {
      case '1H':
        url = `${
          Config.TRX_HISTORY_API
        }?fsym=TRX&tsym=USD&fromTs=${LAST_HOUR}&aggregate=3`
        break
      case '1D':
        url = `${
          Config.TRX_HISTORY_API
        }?fsym=TRX&tsym=USD&fromTs=${LAST_DAY}&aggregate=2`
        break
      case '1W':
        url = `${
          Config.TRX_HISTORY_API
        }?fsym=TRX&tsym=USD&fromTs=${LAST_WEEK}&aggregate=1`
        break
      case '1M':
        url = `${
          Config.TRX_HISTORY_API
        }?fsym=TRX&tsym=USD&fromTs=${LAST_MONTH}&aggregate=1`
        break
      case '1Y':
        url = `${
          Config.TRX_HISTORY_API
        }?fsym=TRX&tsym=USD&fromTs=${LAST_YEAR}&limit=365&aggregate=1`
        break
      case 'ALL':
        url = `${
          Config.TRX_HISTORY_API
        }?fsym=TRX&tsym=USD&aggregate=1&allData=true`
        break
    }
    const response = await axios.get(url, { credentials: false })
    this.setState({
      graph: Object.assign({}, this.state.graph, {
        loading: false,
        data: response.data.Data.map(item => item.close)
      })
    })
  }

  _formatNumber = n => n.toFixed().replace(/(\d)(?=(\d{3})+(\s|$))/g, '$1 ')

  _changeGraphTimeSpan = timeSpan => {
    this.setState(
      {
        graph: Object.assign({}, this.state.graph, { timeSpan })
      },
      this._loadGraphData
    )
  }

  _handleGraphPress = (index) => {
    this.setState({ selectedIndex: index })
  }

  render () {
    const { price, marketcap, volume, supply, graph, selectedIndex } = this.state

    return (
      <Utils.Container>
        <Utils.ContentWithBackground
          source={require('../../assets/home-header.png')}
          resizeMode='contain'
        >
          <Utils.StatusBar transparent />
          <Utils.VerticalSpacer size='large' />
          <Utils.View align='center'>
            <Image
              source={require('../../assets/tron-logo-small.png')}
              resizeMode='contain'
              style={{ height: 60 }}
            />
            <Utils.VerticalSpacer size='medium' />
            <Utils.Text secondary>TRX PRICE</Utils.Text>
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
        <Utils.Content background={Colors.background}>
          <Utils.Row justify='space-between' align='center'>
            <Utils.View>
              <Utils.Text secondary size='xsmall' lineHeight={20}>
                MARKET CAP
              </Utils.Text>
              <Utils.VerticalSpacer size='medium' />
              <Utils.Text secondary size='xsmall' lineHeight={20}>
                VOLUME 24H
              </Utils.Text>
              <Utils.VerticalSpacer size='medium' />
              <Utils.Text secondary size='xsmall' lineHeight={20}>
                CIRCULATING SUPPLY
              </Utils.Text>
            </Utils.View>
            {(!marketcap || !volume || !supply) && (
              <FadeIn name='home-info-loading'>
                <Utils.Content>
                  <ActivityIndicator size='small' color={Colors.primaryText} />
                </Utils.Content>
              </FadeIn>
            )}
            {marketcap &&
              volume &&
              supply && (
                <FadeIn name='home-info'>
                  <Utils.View>
                    <Motion
                      defaultStyle={{ data: 0 }}
                      style={{ data: spring(marketcap, presets.gentle) }}
                    >
                      {value => (
                        <Utils.Text lineHeight={20}>{`$ ${this._formatNumber(
                          value.data
                        )}`}</Utils.Text>
                      )}
                    </Motion>
                    <Utils.VerticalSpacer size='medium' />
                    <Motion
                      defaultStyle={{ data: 0 }}
                      style={{ data: spring(volume, presets.gentle) }}
                    >
                      {value => (
                        <Utils.Text lineHeight={20}>{`$ ${this._formatNumber(
                          value.data
                        )}`}</Utils.Text>
                      )}
                    </Motion>
                    <Utils.VerticalSpacer size='medium' />
                    <Motion
                      defaultStyle={{ data: 0 }}
                      style={{ data: spring(supply, presets.gentle) }}
                    >
                      {value => (
                        <Utils.Text lineHeight={20}>{`${this._formatNumber(
                          value.data
                        )}`}</Utils.Text>
                      )}
                    </Motion>
                  </Utils.View>
                </FadeIn>
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
          <Fragment>
            <Utils.VerticalSpacer />
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
              data={graph.data}
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
        )}
      </Utils.Container>
    )
  }
}

export default HomeScene
