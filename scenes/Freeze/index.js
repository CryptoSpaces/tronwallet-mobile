import React, { Component } from 'react'
import { ScrollView } from 'react-native'

import Client from '../../src/services/client'
import Header from '../../components/Header'
import Card from './../../components/Card'
import * as Utils from '../../components/Utils'

class FreezeScene extends Component {
  state = {
    from: '',
    balances: [],
    trxBalance: 25000
  }

  componentDidMount () {
    this.loadData()
  }

  loadData = async () => {
    try {
      const result = await Promise.all([
        Client.getPublicKey(),
        Client.getBalances()
      ])
      const { balance } = result[1].find(b => b.name === 'TRX')
      this.setState({
        from: result[0],
        balances: result[1],
        trxBalance: balance
      })
    } catch (error) {
      // TODO - Error handler
      this.setState({
        loadingData: false
      })
    }
  }

  render () {
    const { trxBalance } = this.state

    return (
      <ScrollView>
        <Utils.Container>
          <Utils.StatusBar />
          <Header>
            <Utils.View align='center'>
              <Utils.Text size='xsmall' secondary>
                Freeze
              </Utils.Text>
              <Utils.Text size='medium'>{trxBalance.toFixed(2)} TRX</Utils.Text>
            </Utils.View>
          </Header>
          <Utils.Content style={{ backgroundColor: 'transparent' }}>
            <Card isEditable buttonLabel='Freeze' />

            <Card buttonLabel='Unfreeze (0)' />
          </Utils.Content>
        </Utils.Container>
      </ScrollView>
    )
  }
}

export default FreezeScene
