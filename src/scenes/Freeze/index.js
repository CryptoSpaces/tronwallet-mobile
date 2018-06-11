import React, { Component } from 'react'
import { Linking, KeyboardAvoidingView } from 'react-native'
import { Linking as ExpoLinking } from 'expo'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import qs from 'qs'

import * as Utils from '../../components/Utils'
import Client from '../../services/client'
import Header from '../../components/Header'
import Card, { CardRow } from '../../components/Card'
import { DeeplinkURL } from '../../utils/deeplinkUtils'

class FreezeScene extends Component {
  state = {
    from: '',
    balances: [],
    trxBalance: 0,
    bandwidth: 0,
    total: 0,
    amount: 0,
    loading: true
  }

  componentDidMount () {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this.loadData()
    })
  }

  componentWillUnmount () {
    this._navListener.remove()
  }

  sendDeepLink = async (data) => {
    const { from, amount } = this.state
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
      this.openDeepLink(dataToSend)
    } catch (error) {
      this.setState({ loading: false }, () => {
        this.props.navigation.navigate('GetVault')
      })
    }
  }

  openDeepLink = async (dataToSend) => {
    try {
      const url = `${DeeplinkURL}auth/${dataToSend}`
      await Linking.openURL(url)
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false }, () => {
        this.props.navigation.navigate('GetVault')
      })
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
        total: result[1].total,
        loading: false
      })
    } catch (error) {
      // console.log('ERROR', error)
      // TODO - Error handler
      this.setState({
        loading: false
      })
    }
  }

  freezeToken = async () => {
    const { amount } = this.state
    this.setState({ loading: true })
    const transaction = await Client.freezeToken(amount)
    this.sendDeepLink(transaction)
  }

  unfreezeToken = () => {
    // const { amount } = this.state
    // alert('UNFREEZE');
  }

  render () {
    const {
      total,
      bandwidth,
      trxBalance,
      amount,
      loading
    } = this.state

    return (
      <KeyboardAvoidingView
        // behavior='padding'
        // keyboardVerticalOffset={150}
        style={{ flex: 1 }}
        enabled
      >
        <KeyboardAwareScrollView>
          <Utils.StatusBar />
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
              <Card isEditable loading={loading} buttonLabel='Freeze' onPress={this.freezeToken} onChange={(amount) => this.setState({ amount: Number(amount) })} >
                <CardRow label='New Frozen TRX' value={amount + total} />
              </Card>
              {/* <Card buttonLabel='Unfreeze (0)' onPress={this.unfreezeToken}> */}
              <Card>
                <CardRow label='Frozen TRX' value={total} />
                <CardRow label='Current Bandwidth' value={bandwidth} />
              </Card>
            </Utils.Content>
          </Utils.Container>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    )
  }
}

export default FreezeScene
