import React, { Component } from 'react'
import { Linking, KeyboardAvoidingView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import qs from 'qs'

import * as Utils from '../../components/Utils'
import Client from '../../services/client'
import Header from '../../components/Header'
import Card, { CardRow } from '../../components/Card'
import { TronVaultURL, MakeTronMobileURL } from '../../utils/deeplinkUtils'
import { signTransaction } from '../../utils/transactionUtils'

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
    this._didFocusSubscription = this.props.navigation.addListener('didFocus', this.loadData)
  }

  componentWillUnmount () {
    this._didFocusSubscription.remove()
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

  submit = async () => {
    const { amount, trxBalance } = this.state
    this.setState({ loading: true })
    try {
      if (trxBalance < amount) throw new Error('Insufficient TRX balance')
      await this.freezeToken()
    } catch (error) {
      alert(error.message)
    } finally {
      this.setState({ loading: false })
    }
  }

  freezeToken = async () => {
    const { from, amount } = this.state
    try {
      // TronScan
      // const data = await Client.freezeToken(amount)
      // Serverless
      const data = await Client.getFreezeTransaction(amount)

      // Data to deep link, same format as Tron Wallet
      const dataToSend = qs.stringify({
        txDetails: { from, amount, Type: 'FREEZE' },
        pk: from,
        action: 'transaction',
        from: 'mobile',
        URL: MakeTronMobileURL('transaction'),
        data
      })

      this.openTransactionDetails(data)
      // this.openDeepLink(dataToSend)
    } catch (error) {
      alert('Error while building transaction, try again.')
      this.setState({ error: 'Error getting transaction', loadingSign: false })
    }
  }

  openTransactionDetails = async (transactionUnsigned) => {
    try {
      const transactionSigned = await signTransaction(transactionUnsigned)
      this.setState({ loadingSign: false }, () => {
        this.props.navigation.navigate('TransactionDetail', { tx: transactionSigned })
      })
    } catch (error) {
      alert(error.message)
      this.setState({ error: 'Error getting transaction', loadingSign: false })
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
              <Card isEditable loading={loading} buttonLabel='Freeze' onPress={this.submit} onChange={(amount) => this.setState({ amount: Number(amount) })} >
                <CardRow label='New Frozen TRX' value={amount + total} />
              </Card>
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
