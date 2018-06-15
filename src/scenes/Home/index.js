import React, { Component } from 'react'
import axios from 'axios'
import { AreaChart, Grid } from 'react-native-svg-charts'
import { Svg } from 'react-native-svg';
import { ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import { View } from 'react-native-animatable'
import * as shape from 'd3-shape'

import Gradient from '../../components/Gradient'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'

const Line = ({ line }) => (
  <Svg.Path
    key={'line'}
    d={line}
    stroke={'url(#gradient)'}
    fill={'none'}
    strokeWidth={3}
  />
)

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
    price: 0
  }

  componentDidMount () {
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
    const { data: { data } } = await axios.get(
      'https://api.coinmarketcap.com/v2/ticker/1958'
    )
    this.setState({
      marketcap: data.quotes.USD.market_cap,
      volume: data.quotes.USD.volume_24h,
      supply: data.circulating_supply,
      price: data.quotes.USD.price
    })
  }

  _loadGraphData = async () => {
    this.setState({
      graph: Object.assign({}, this.state.graph, {
        data: this.state.graph.data ? this.state.graph.data.map(() => 0) : null
      })
    })
    let url
    switch (this.state.graph.timeSpan) {
      case '1H':
        url = `https://min-api.cryptocompare.com/data/histoday?fsym=TRX&tsym=USD&fromTs=${Math.round(
          new Date().getTime() / 1000
        ) - 3600}&aggregate=3`
        break
      case '1D':
        url = `https://min-api.cryptocompare.com/data/histoday?fsym=TRX&tsym=USD&fromTs=${Math.round(
          new Date().getTime() / 1000
        ) -
          24 * 3600}&aggregate=2`
        break
      case '1W':
        url = `https://min-api.cryptocompare.com/data/histoday?fsym=TRX&tsym=USD&fromTs=${Math.round(
          new Date().getTime() / 1000
        ) -
          7 * 24 * 3600}&aggregate=1`
        break
      case '1M':
        url = `https://min-api.cryptocompare.com/data/histoday?fsym=TRX&tsym=USD&fromTs=${Math.round(
          new Date().getTime() / 1000
        ) -
          31 * 24 * 3600}&aggregate=1`
        break
      case '1Y':
        url = `https://min-api.cryptocompare.com/data/histoday?fsym=TRX&tsym=USD&fromTs=${Math.round(
          new Date().getTime() / 1000
        ) -
          365 * 24 * 3600}&limit=365&aggregate=1`
        break
      case 'ALL':
        url =
          'https://min-api.cryptocompare.com/data/histoday?fsym=TRX&tsym=USD&aggregate=1&allData=true'
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

  render () {
    const { price } = this.state
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
                <Utils.Text size='medium'>$ {price}</Utils.Text>
              </Utils.Row>
            </Utils.View>
          </Utils.Row>
          <Utils.VerticalSpacer size='large' />
        </Utils.ContentWithBackground>
        <Utils.Content background={Colors.background} flex={1}>
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
            {
              !this.state.marketcap || !this.state.volume || !this.state.supply ? (
                <Utils.Content>
                  <ActivityIndicator size='small' color={Colors.primaryText} />
                </Utils.Content>
              ) : (
                <View animation='fadeIn'>
                  <Utils.View>
                    <Utils.Text lineHeight={20}>{`$ ${this._formatNumber(
                      this.state.marketcap
                    )}`}</Utils.Text>
                    <Utils.VerticalSpacer size='medium' />
                    <Utils.Text lineHeight={20}>{`$ ${this._formatNumber(
                      this.state.volume
                    )}`}</Utils.Text>
                    <Utils.VerticalSpacer size='medium' />
                    <Utils.Text lineHeight={20}>{`${this._formatNumber(
                      this.state.supply
                    )} TRX`}</Utils.Text>
                  </Utils.View>
                </View>
              )}
          </Utils.Row>
        </Utils.Content>
        <Utils.Row justify='space-evenly'>
          {this.timeSpans.map(timeSpan => (
            <TouchableOpacity
              key={timeSpan}
              onPress={() => this._changeGraphTimeSpan(timeSpan)}
            >
              <Utils.Text secondary={this.state.graph.timeSpan !== timeSpan}>
                {timeSpan}
              </Utils.Text>
            </TouchableOpacity>
          ))}
        </Utils.Row>
        {this.state.graph.loading ? (
          <Utils.Content height={120} justify='center'>
            <ActivityIndicator size='large' color={Colors.primaryText} />
          </Utils.Content>
        ) : (
          <View animation='fadeIn' style={{ flex: 1 }}>
            <AreaChart
              style={{ flex: 1 }}
              data={this.state.graph.data}
              contentInset={{ top: 30, bottom: 30 }}
              curve={shape.curveLinear}
              svg={{ fill: 'url(#gradient)', opacity: 0.2 }}
              numberOfTicks={4}
              animate
            >
              <Grid svg={{ stroke: '#FFF', strokeOpacity: 0.1 }} />
              <Gradient />
              <Line />
            </AreaChart>
          </View>
        )}
      </Utils.Container>
    )
  }
}

export default HomeScene
