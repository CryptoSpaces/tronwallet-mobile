import React, { Component } from 'react'

import * as Utils from '../../components/Utils'
import { Motion, spring } from 'react-motion'
import { formatNumber } from '../../utils/numberUtils'

import Client from '../../services/client'
import getBalanceStore from '../../store/balance'

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
      const store = await this._getBalancesFromStore()
      const { balance } = store.find(item => item.name === 'TRX')
      this.setState({
        trxBalance: balance || 0
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
    const { trxBalance } = this.state
    return (
      <Utils.Container justify='flex-start'>
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
                <Badge>TRX</Badge>
              </React.Fragment>
            )}
          </Motion>
        </Utils.Row>
        <Utils.Row>
          <Utils.Content>
            <Utils.Text>TRON POWER</Utils.Text>
            <Utils.Text>4</Utils.Text>
          </Utils.Content>
          <Utils.Content>
            <Utils.Text>TRX PRICE</Utils.Text>
            <Utils.Text>0.0331 USD</Utils.Text>
          </Utils.Content>
          <Utils.Content>
            <Utils.Text>BANDWIDTH</Utils.Text>
            <Utils.Text>134</Utils.Text>
          </Utils.Content>
        </Utils.Row>
      </Utils.Container>
    )
  }
}

export default BalanceScene
