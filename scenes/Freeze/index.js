import React, { Component } from 'react'
import { View, ActivityIndicator, Linking, Alert, ScrollView } from 'react-native'
import qs from 'qs'
import { Linking as ExpoLinking } from 'expo'
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

  sendDeepLink = async (data) => {
    const { from, amount } = this.state
    const { navigation } = this.props
    
    console.log(navigation, '<<< nav')

    try {
      // Data to deep link, same format as Tron Wallet
      const dataToSend = qs.stringify({
        txDetails: { from, amount, Type: 'FREEZE' },
        pk: from,
        action: 'transaction',
        from: 'mobile',
        URL: ExpoLinking.makeUrl('/transaction'),
        data
      })

      const url = `tronvault://auth/${dataToSend}`
      
      await Linking.openURL(url)
      console.log(url);
      // const supported = await Linking.canOpenURL(url)
      console.log(supported, '<<< Supported')
      if (supported) {
        console.log('supported?', supported)
        await Linking.openURL(url)
        this.setState({ loadingSign: false })
        
      } else {
        this.setState({ loadingSign: false }, () => {
          this.props.navigation.navigate('GetVault')
        })
      }
    } catch (error) {
      console.log(error, '<<< error');
      this.setState({ signError: error.message || error, loadingSign: false })
    }
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

  freezeToken = async () => {
    const { amount } = this.state;
    
    const transaction = await Client.freezeToken(amount);
    this.sendDeepLink(transaction);
    // alert('FREEZE');
  }

  unfreezeToken = () => {
    // alert('UNFREEZE');
  }

  render () {
    const {
      total,
      bandwidth,
      trxBalance,
      amount
    } = this.state

    return (
      <ScrollView>
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
              <CardRow label="New Frozen TRX" value={amount + total} />
              <CardRow label="New Bandwith" value={bandwidth} />
            </Card>
            <Card buttonLabel='Unfreeze (0)' onPress={this.unfreezeToken}>
              <CardRow label="Frozen TRX" value={total} />
              <CardRow label="Current Bandwith" value={bandwidth} />
            </Card>
          </Utils.Content>
        </Utils.Container>
      </ScrollView>
    )
  }
}

export default FreezeScene
