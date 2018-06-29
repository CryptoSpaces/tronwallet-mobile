import React, { Component } from 'react'
import { Linking, KeyboardAvoidingView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import qs from 'qs'

import * as Utils from '../../components/Utils'
import Client from '../../services/client'
import Header from '../../components/Header'
import Card, { CardRow } from '../../components/Card'
import { TronVaultURL, MakeTronMobileURL } from '../../utils/deeplinkUtils'
import GoBackButton from '../../components/GoBackButton'

import { Context } from '../../store/context'

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
        URL: MakeTronMobileURL('transaction'),
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
      const url = `${TronVaultURL}auth/${dataToSend}`
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
      const { freeze, publicKey } = this.props.context
      const { balance } = freeze.value.balances.find(b => b.name === 'TRX')

      this.setState({
        from: publicKey.value,
        balances: freeze,
        trxBalance: balance,
        bandwidth: freeze.value.bandwidth.netReimaining,
        total: freeze.value.total,
        loading: false
      })
    } catch (error) {
      this.setState({
        loading: false
      })
    }
  }

  freezeToken = async () => {
    const { amount, trxBalance } = this.state
    this.setState({ loading: true })
    try{
      if(trxBalance < amount){
        alert('Insufficient TRX balance');
        throw new Error('Insufficient TRX balance');
    }
      const transaction = await Client.freezeToken(amount)
      this.sendDeepLink(transaction)
      this.props.navigation.goBack()
    } catch(error){
      console.log(error.message);
    } finally{
      this.setState({loading: false});
    }

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
        style={{ flex: 1 }}
        enabled
      >
        <KeyboardAwareScrollView
          contentContainerStyle={{ flex: 1 }}
        >
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
              <GoBackButton navigation={this.props.navigation} />
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

export default props => (
  <Context.Consumer>
    {context => <FreezeScene context={context} {...props} />}
  </Context.Consumer>
)
