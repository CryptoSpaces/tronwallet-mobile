import React, { Component } from 'react'
import {
  ActivityIndicator,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Modal
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import ButtonGradient from '../../components/ButtonGradient'
import Client from '../../services/client'
import Header from '../../components/Header'
import PasteInput from '../../components/PasteInput'
import QRScanner from '../../components/QRScanner'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'

import { TronVaultURL } from '../../utils/deeplinkUtils'
import { isAddressValid } from '../../services/address'
import { signTransaction } from '../../utils/transactionUtils'
import getBalanceStore from '../../store/balance'
import { Context } from '../../store/context'
import { getUserPublicKey } from '../../utils/userAccountUtils'

class SendScene extends Component {
  state = {
    from: '',
    to: '',
    amount: '',
    token: 'TRX',
    balances: [],
    error: null,
    loadingSign: false,
    loadingData: true,
    trxBalance: 0.0,
    QRModalVisible: false
  }

  componentDidMount () {
    this._navListener = this.props.navigation.addListener(
      'didFocus',
      this.loadData
    )
  }

  componentWillUnmount () {
    this._navListener.remove()
  }

  getBalancesFromStore = async () => {
    const store = await getBalanceStore()
    return store.objects('Balance').map(item => Object.assign({}, item))
  }

  loadData = async () => {
    this.setState({ loading: true })
    try {
      const balances = await this.getBalancesFromStore()
      const userPublicKey = await getUserPublicKey()
      const { balance } = balances.find(b => b.name === 'TRX')
      this.setState({
        from: userPublicKey,
        balances,
        loadingData: false,
        trxBalance: balance
      })
    } catch (error) {
      Alert.alert('Error while getting balance data')
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
    const { amount, to, balances, token, from } = this.state
    const balanceSelected = balances.find(b => b.name === token)

    if (!isAddressValid(to) || from === to) {
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

    this.transferAsset()
  }

  onSelectToken = value => {
    this.setState({ token: value })
  }

  clearInput = () => {
    this.setState({
      to: '',
      token: 'TRX',
      amount: ''
    })
  }

  renderTokens = () => {
    const { balances } = this.state
    return balances.map(bl => {
      const balanceValue =
        bl.balance > 1 ? bl.balance.toFixed(2) : bl.balance.toFixed(4)
      return (
        <Utils.PickerInput.Item
          key={bl.name}
          label={`${bl.name} ${balanceValue}`}
          value={bl.name}
        />
      )
    })
  }

  transferAsset = async () => {
    const { from, to, amount, token } = this.state
    this.setState({ loadingSign: true, error: null })
    try {
      // TronScan
      // const data = await Client.getTransactionString({from,to,amount,token});
      // Serverless
      const data = await Client.getTransferTransaction({
        from,
        to,
        amount,
        token
      })

      // Data to deep link, same format as Tron Wallet
      // const dataToSend = qs.stringify({
      //   txDetails: { from, to, amount, Type: 'SEND' },
      //   pk: from,
      //   action: 'transaction',
      //   from: 'mobile',
      //   URL: MakeTronMobileURL('transaction'),
      //   data
      // })

      this.openTransactionDetails(data)
      // this.openDeepLink(dataToSend)
      this.clearInput()
    } catch (error) {
      this.setState({ error: 'Error getting transaction', loadingSign: false })
    }
  }

  openTransactionDetails = async transactionUnsigned => {
    try {
      const transactionSigned = await signTransaction(transactionUnsigned)
      this.setState({ loadingSign: false, error: null }, () => {
        this.props.navigation.navigate('TransactionDetail', {
          tx: transactionSigned
        })
      })
    } catch (error) {
      this.setState({ error: 'Error getting transaction', loadingSign: false })
    }
  }

  openDeepLink = async dataToSend => {
    try {
      const url = `${TronVaultURL}auth/${dataToSend}`
      await Linking.openURL(url)
      this.setState({ loadingSign: false })
    } catch (error) {
      this.setState({ loadingSign: false }, () => {
        this.props.navigation.navigate('GetVault')
      })
    }
  }

  readPublicKey = e => this.setState({ to: e.data }, this.closeModal)

  openModal = () => this.setState({ QRModalVisible: true })

  closeModal = () => {
    if (this.state.QRModalVisible) {
      this.setState({ QRModalVisible: false })
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
          onLeftPress={() => {}}
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
      <KeyboardAvoidingView style={{ flex: 1 }} enabled>
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
                qrScan={this.openModal}
              />
              <Modal
                visible={this.state.QRModalVisible}
                onRequestClose={this.closeModal}
                animationType='slide'
              >
                <QRScanner
                  onRead={this.readPublicKey}
                  onClose={this.closeModal}
                  checkAndroid6Permissions
                />
              </Modal>
              <Utils.VerticalSpacer size='medium' />
              <Utils.Text size='xsmall' secondary>
                Token
              </Utils.Text>
              <Utils.PickerInput
                selectedValue={this.state.token}
                onValueChange={this.onSelectToken}
                placeholder={this.state.token}
              >
                {this.renderTokens()}
              </Utils.PickerInput>
              <Utils.VerticalSpacer size='medium' />
              <Utils.Text size='xsmall' secondary>
                Amount
              </Utils.Text>
              <Utils.Row align='center' justify='flex-start'>
                <Utils.FormInput
                  underlineColorAndroid='transparent'
                  keyboardType='numeric'
                  autoCapitalize='none'
                  onChangeText={text => this.changeInput(text, 'amount')}
                  placeholderTextColor='#fff'
                  style={{ marginRight: 15, width: '100%' }}
                >
                  <Utils.Text>{this.state.amount}</Utils.Text>
                </Utils.FormInput>
              </Utils.Row>
            </Utils.Content>
            {error && <Utils.Error>{error}</Utils.Error>}
            <Utils.Content justify='center' align='center'>
              {loadingSign || loadingData ? (
                <ActivityIndicator size='small' color={Colors.primaryText} />
              ) : (
                <ButtonGradient
                  text='Send'
                  onPress={this.submit}
                  size='small'
                />
              )}
              <Utils.VerticalSpacer size='medium' />
            </Utils.Content>
          </Utils.Container>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    )
  }
}

export default props => (
  <Context.Consumer>
    {context => <SendScene context={context} {...props} />}
  </Context.Consumer>
)
