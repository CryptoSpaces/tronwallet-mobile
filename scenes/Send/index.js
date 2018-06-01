import React, { Component } from 'react'
import { ActivityIndicator, Linking, Alert, KeyboardAvoidingView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import qs from 'qs'
import { Select, Option } from 'react-native-chooser'
import { Linking as ExpoLinking } from 'expo'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import ButtonGradient from '../../components/ButtonGradient'
import Client from '../../src/services/client'
import Header from '../../components/Header'
import PasteInput from '../../components/PasteInput'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import { DeeplinkURL } from '../../utils/deeplinkUtils'
import { isAddressValid } from '../../src/services/address'

class SendScene extends Component {
  state = {
    from: '',
    to: '',
    amount: 0,
    token: 'Select your balance',
    balances: [],
    error: null,
    loadingSign: false,
    loadingData: true,
    trxBalance: 0.0
  }

  componentDidMount () {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this.loadData()
    })
  }

  componentWillUnmount () {
    this._navListener.remove()
  }

  loadData = async () => {
    this.setState({ loading: true })
    try {
      const result = await Promise.all([
        Client.getPublicKey(),
        Client.getBalances()
      ])
      const { balance } = result[1].find(b => b.name === 'TRX')
      this.setState({
        from: result[0],
        balances: result[1],
        loadingData: false,
        trxBalance: balance
      })
    } catch (error) {
      Alert.alert('Error while loading data')
      // TODO - Error handler
      this.setState({
        loadingData: false
      })
    }
  }

  changeInput = (text, field) => {
    this.setState({
      [field]: text,
      error: null
    })
  }

  submit = () => {
    const { amount, to, balances, token } = this.state
    const balanceSelected = balances.find(b => b.name === token)

    if (!isAddressValid(to)) {
      this.setState({ error: 'Invalid receiver address' })
      return
    }
    if (!balanceSelected) {
      this.setState({ error: 'Select a balance first' })
      return
    }

    if (!amount || balanceSelected.balance < amount) {
      this.setState({ error: 'Invalid amount' })
      return
    }
    this.sendDeepLink()
  }

  onSelectToken = (value, label) => {
    this.setState({ token: value })
  }

  clearInput = () => {
    this.setState({
      to: '',
      amount: 0,
      token: 'Select your balance'
    })
  }

  renderTokens = () => {
    const { balances } = this.state
    return balances.map(bl => (
      <Option key={bl.name} value={bl.name}>{`${bl.balance} ${
        bl.name
      }`}</Option>
    ))
  }

  sendDeepLink = async () => {
    const { from, to, amount, token } = this.state
    this.setState({ loadingSign: true })
    try {
      // Transaction String
      const data = await Client.getTransactionString({
        from,
        to,
        amount,
        token
      })
      // Data to deep link, same format as Tron Wallet
      const dataToSend = qs.stringify({
        txDetails: { from, to, amount, Type: 'SEND' },
        pk: from,
        action: 'transaction',
        from: 'mobile',
        URL: ExpoLinking.makeUrl('/transaction'),
        data
      })
      this.openDeepLink(dataToSend)
    } catch (error) {
      this.setState({ error: 'Error getting transaction', loadingSign: false })
    } finally {
      this.clearInput()
    }
  }

  openDeepLink = async (dataToSend) => {
    try {
      const url = `${DeeplinkURL}auth/${dataToSend}`
      await Linking.openURL(url)
      this.setState({ loadingSign: false })
    } catch (error) {
      this.setState({ loadingSign: false }, () => {
        this.props.navigation.navigate('GetVault')
      })
    }
  }

  renderHeader = () => {
    const { trxBalance } = this.state
    const { noNavigation } = this.props

    if (noNavigation) {
      return (
        <Utils.View>
          <Utils.View align='center'>
            <Utils.Text size='xsmall' secondary>
              Send Transaction
            </Utils.Text>
            <Utils.Text size='medium'>{trxBalance.toFixed(2)} TRX</Utils.Text>
          </Utils.View>
        </Utils.View>
      )
    } else {
      return (
        <Header
          leftIcon={
            <Ionicons name='md-menu' color={Colors.primaryText} size={24} />
          }
          onLeftPress={() => { }}
          rightIcon={
            <Ionicons name='ios-close' color={Colors.primaryText} size={40} />
          }
          onRightPress={() => this.props.navigation.goBack()}
        >
          <Utils.View align='center'>
            <Utils.Text size='xsmall' secondary>
              Send Transaction
            </Utils.Text>
            <Utils.Text size='medium'>{trxBalance.toFixed(2)} TRX</Utils.Text>
          </Utils.View>
        </Header>
      )
    }
  }

  render () {
    const { loadingSign, loadingData, error, to, trxBalance } = this.state

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
            <Utils.View align='center'>
              <Utils.Text size='xsmall' secondary>
                Send Transaction
              </Utils.Text>
              <Utils.Text size='medium'>{trxBalance.toFixed(2)} TRX</Utils.Text>
            </Utils.View>
            <Utils.Content>
              <Utils.Text size='xsmall' secondary>
                To
              </Utils.Text>
              <PasteInput
                value={to}
                field='from'
                onChangeText={text => this.changeInput(text, 'to')}
              />
              <Utils.VerticalSpacer size='medium' />
              <Utils.Text size='xsmall' secondary>
                Token
              </Utils.Text>
              <Select
                onSelect={this.onSelectToken}
                defaultText={this.state.token}
                style={{
                  width: '100%',
                  borderWidth: 0.5,
                  marginVertical: 10,
                  borderRadius: 5,
                  padding: 12,
                  borderColor: Colors.secondaryText
                }}
                textStyle={{ color: Colors.primaryText }}
                transparent
                animationType='fade'
                optionListStyle={{
                  borderRadius: 10,
                  backgroundColor: Colors.secondaryText
                }}
              >
                {this.renderTokens()}
              </Select>
              <Utils.VerticalSpacer size='medium' />
              <Utils.Text size='xsmall' secondary>
                Amount
              </Utils.Text>
              <Utils.Row align='center' justify='flex-start'>
                <Utils.FormInput
                  underlineColorAndroid='transparent'
                  keyboardType='numeric'
                  onChangeText={text => this.changeInput(text, 'amount')}
                  placeholderTextColor='#fff'
                  style={{ marginRight: 15, width: '100%' }}
                />
              </Utils.Row>
            </Utils.Content>
            {error && <Utils.Error>{error}</Utils.Error>}
            <Utils.Content justify='center' align='center'>
              {loadingSign || loadingData ? (
                <ActivityIndicator size='small' color={Colors.primaryText} />
              ) : (
                <ButtonGradient text='Send Token' onPress={this.submit} size='small' />
              )}
              <Utils.VerticalSpacer size='medium' />
            </Utils.Content>
          </Utils.Container>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    )
  }
}

export default SendScene
