import React, { Component } from 'react'
import { ActivityIndicator, Linking, Alert, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import qs from 'qs'
import { Select, Option } from 'react-native-chooser'
import { Linking as ExpoLinking } from 'expo'

import ButtonGradient from '../../components/ButtonGradient'
import Client from '../../src/services/client'
import Header from '../../components/Header'
import PasteInput from '../../components/PasteInput'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import { DeeplinkURL } from '../../utils/deeplinkUtils'

class SendScene extends Component {
  state = {
    from: '',
    to: '',
    amount: 0,
    token: 'Select your balance',
    balances: [],
    signError: null,
    loadingSign: false,
    loadingData: true,
    trxBalance: 0.0
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
      [field]: text
    })
  }
  changeAmount = () => {
    this.setState({
      amount: this.state.amount + 100
    })
  }

  onSelectToken = (value, label) => {
    this.setState({ token: value })
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

      const url = `${DeeplinkURL}auth/${dataToSend}`
      await Linking.openURL(url)
      this.setState({ loadingSign: false })
    } catch (error) {
      this.setState({ signError: error.message || error, loadingSign: false })
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
    const { loadingSign, loadingData, signError, to, trxBalance } = this.state

    return (
      <ScrollView>
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
                value={String(this.state.amount)}
                onChangeText={text => this.changeInput(text, 'amount')}
                placeholderTextColor='#fff'
                style={{ marginRight: 15, width: '100%' }}
              />
            </Utils.Row>
          </Utils.Content>
          <Utils.Content justify='center' align='center'>
            {signError && <Utils.Error>{signError}</Utils.Error>}
            {loadingSign || loadingData ? (
              <ActivityIndicator size='small' color={Colors.yellow} />
            ) : (
              <ButtonGradient text='Send Token' onPress={this.sendDeepLink} size='small' />
            )}
            <Utils.VerticalSpacer size='medium' />
          </Utils.Content>
        </Utils.Container>
      </ScrollView>
    )
  }
}

export default SendScene
