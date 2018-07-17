import React, { Component } from 'react'

import * as Utils from '../../components/Utils'
import { Motion, spring } from 'react-motion'
import { formatNumber } from '../../utils/numberUtils'

import Client from '../../services/client'
import getBalanceStore from '../../store/balance'

import ButtonGradient from '../../components/ButtonGradient'
import Badge from '../../components/Badge'

const POOLING_TIME = 30000

class BalanceScene extends Component {
  state = {
    loading: false,
    error: null,
    balances: [],
    trxBalance: 0
  }

  async componentDidMount () {
    try {
      this._loadData()
    } catch (e) {
      this.setState({error: 'An error occured while loading the data.'})
    }
    this._dataListener = setInterval(this._loadData, POOLING_TIME)
  }

  _loadData = async () => {
    this.setState({loading: true})
    try {
      const getData = await Client.getBalances()
      await this._updateBalancesStore(getData)
      const balances = await this._getBalancesFromStore()
      const { balance } = balances.find(item => item.name === 'TRX')
      this.setState({
        trxBalance: balance || 0,
        balances
      })
    } catch (e) {
      this.setState({ error: e.message })
    } finally {
      this.setState({ loading: false })
    }
  }

  _getBalancesFromStore = async () => {
    const store = await getBalanceStore()
    return store.objects('Balance').map(item => Object.assign({}, item))
  }

  _updateBalancesStore = async balances => {
    const store = await getBalanceStore()
    store.write(() => balances.map(item => store.create('Balance', item, true)))
  }

  render () {
    const { trxBalance, balances } = this.state

    return (
      <Utils.Container justify='flex-start' align='stretch'>
        <Utils.Row justify='center' align='center'>
          <Motion
            defaultStyle={{ balance: 0 }}
            style={{ balance: spring(trxBalance) }}
          >
            {value => (
              <React.Fragment>
                <Utils.Text size='large' marginX={8}>
                  {formatNumber(value.balance.toFixed(0))}
                </Utils.Text>
                <Badge verified>TRX</Badge>
              </React.Fragment>
            )}
          </Motion>
        </Utils.Row>
        <Utils.Row justify='center'>
          <Utils.Content align='center'>
            <Utils.Text size='xsmall' secondary>TRON POWER</Utils.Text>
            <Utils.Text padding={4}>4</Utils.Text>
          </Utils.Content>
          <Utils.Content align='center'>
            <Utils.Text size='xsmall' secondary>TRX PRICE</Utils.Text>
            <Utils.Text padding={4}>0.0331 USD</Utils.Text>
          </Utils.Content>
          <Utils.Content align='center'>
            <Utils.Text size='xsmall' secondary>BANDWIDTH</Utils.Text>
            <Utils.Text padding={4}>134</Utils.Text>
          </Utils.Content>
        </Utils.Row>
        <Utils.Content paddingVertical='xsmall'>
          <Utils.Row>
            <ButtonGradient
              text='RECEIVE'
              size='medium'
              flex={1}
              rightRadius={0}
              onPress={() => {}}
            />
            <Utils.HorizontalSpacer size='tiny' />
            <ButtonGradient
              text='SEND'
              size='medium'
              flex={1}
              leftRadius={0}
              onPress={() => {}}
            />
          </Utils.Row>
        </Utils.Content>
        <Utils.Content paddingVertical='large'>
          <Utils.Row justify='space-between'>
            <Utils.Text size='xsmall' secondary>
              TOKENS
            </Utils.Text>
            <Utils.Text size='xsmall' secondary>
              HOLDINGS
            </Utils.Text>
          </Utils.Row>
          <Utils.VerticalSpacer size='big' />
          {balances && balances.map((item) => (
            <Utils.Content key={item.name} paddingHorizontal='none' paddingVertical='medium'>
              <Utils.Row justify='space-between'>
                <Badge>{item.name}</Badge>
                <Utils.Text>{formatNumber(item.balance)}</Utils.Text>
              </Utils.Row>
            </Utils.Content>
          ))}
        </Utils.Content>
      </Utils.Container>
    )
  }
}

export default BalanceScene
