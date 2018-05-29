import React, { Component } from 'react'
import * as Utils from '../../components/Utils'
import Client from '../../src/services/client'
import Header from '../../components/Header'
import Card, { CardRow } from './../../components/Card'

class FreezeScene extends Component {
  state = {
    from: '',
    balances: [],
    trxBalance: 0,
    bandwidth: 0,
    total: 0,
    amount: 0
  }

  componentDidMount () {
    this.loadData()
  }

  loadData = async () => {
    try {
      const result = await Promise.all([Client.getPublicKey(), Client.getFreeze()])

      const { balance } = result[1].balances.find(b => b.name === 'TRX')

      this.setState({
        from: result[0],
        balances: result[1],
        trxBalance: balance,
        bandwidth: result[1].bandwidth.netRemaining,
        total: result[1].total
      })
    } catch (error) {
      console.log('ERROR', error)
      // TODO - Error handler
      this.setState({
        loadingData: false
      })
    }
  }

  freezeToken = () => {
    const { amount } = this.state

    Client.freezeToken(amount)
    alert('FREEZE')
  }

  unfreezeToken = () => {
    alert('UNFREEZE')
  }

  render () {
    const {
      total,
      bandwidth,
      trxBalance,
      amount
    } = this.state

    return (
      <Utils.Container>
        <Utils.StatusBar />
        <Header>
          <Utils.View align='center'>
            <Utils.Text size='xsmall' secondary>Freeze</Utils.Text>
            <Utils.Text size='medium'>{trxBalance.toFixed(2)} TRX</Utils.Text>
          </Utils.View>
        </Header>
        <Utils.Content style={{ backgroundColor: 'transparent' }}>
          <Card isEditable buttonLabel='Freeze' onPress={this.freezeToken} onChange={(amount) => this.setState({ amount: Number(amount) })} >
            <CardRow label='New Frozen TRX' value={amount + total} />
            <CardRow label='New Bandwith' value={bandwidth} />
          </Card>
          <Card buttonLabel='Unfreeze (0)' onPress={this.unfreezeToken}>
            <CardRow label='Frozen TRX' value={total} />
            <CardRow label='Current Bandwith' value={bandwidth} />
          </Card>
        </Utils.Content>
      </Utils.Container >
    )
  }
}

export default FreezeScene
