import React, { Component } from 'react'
import {
  ActivityIndicator,
  Clipboard,
  Linking,
  Alert,
  Modal
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ModalSelector from 'react-native-modal-selector'

import ButtonGradient from '../../components/ButtonGradient'
import Client from '../../services/client'
import Header from '../../components/Header'
import Input from '../../components/Input'
import QRScanner from '../../components/QRScanner'
import IconButton from '../../components/IconButton'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'

import { TronVaultURL } from '../../utils/deeplinkUtils'
import { isAddressValid } from '../../services/address'
import { signTransaction } from '../../utils/transactionUtils'
import getBalanceStore from '../../store/balance'
import { Context } from '../../store/context'
import { getUserPublicKey } from '../../utils/userAccountUtils'
import KeyboardScreen from '../../components/KeyboardScreen'
import { formatNumber } from '../../utils/numberUtils'

class SendScene extends Component {
  state = {
    from: '',
    to: '',
    amount: '',
    token: 'TRX',
    formattedToken: ``,
    balances: [],
    error: null,
    warning: null,
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
        trxBalance: balance,
        formattedToken: this._formatBalance('TRX', balance),
        warning: balance === 0 ? 'NO BALANCE' : null
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

  clearInput = () => {
    this.setState({
      to: '',
      token: 'TRX',
      amount: ''
    })
  }

  transferAsset = async () => {
    const { from, to, amount, token } = this.state
    this.setState({ loadingSign: true, error: null })
    try {
      // Serverless
      const data = await Client.getTransferTransaction({
        from,
        to,
        amount,
        token
      })
      this.openTransactionDetails(data)
      this.clearInput()
    } catch (error) {
      this.setState({
        error: 'Oops. Something wrong while building transaction. Please Try Again',
        loadingSign: false
      })
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
      this.setState({ error: 'Oops. Something wrong while building transaction. Please Try Again', loadingSign: false })
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

  readPublicKey = e => this.setState({ to: e.data }, () => {
    this.closeModal()
    this._nextInput('to')
  })

  _openModal = () => this.setState({ QRModalVisible: true })

  _onPaste = async () => {
    const content = await Clipboard.getString()
    if (content) {
      this.changeInput(content, 'to')
      this._nextInput('to')
    }
  }

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

  _formatBalance = (token, balance) => `${token} (${formatNumber(balance)} available)`

  _rightContentTo = () => (
    <React.Fragment>
      <IconButton onPress={this._onPaste} icon='md-clipboard' />
      <Utils.HorizontalSpacer />
      <IconButton onPress={this._openModal} icon='ios-qr-scanner' />
    </React.Fragment>
  )

  _rightContentToken = () => (
    <Utils.View paddingX='small'>
      <Ionicons name='ios-arrow-down' color={Colors.primaryText} size={24} />
    </Utils.View>
  )

  _nextInput = currentInput => {
    if (currentInput === 'token') {
      this.to.focus()
      return
    }

    if (currentInput === 'to') {
      this.amount.focus()
      return
    }

    if (currentInput === 'amount' && this.state.trxBalance !== 0) {
      this.submit()
    }
  }

  render () {
    const { loadingSign, loadingData, error, to, trxBalance, amount, balances } = this.state
    return (
      <KeyboardScreen>
        <Utils.Container style={{borderColor: Colors.secondaryText, borderTopWidth: 0.5}}>
          <Utils.Content>
            {balances.length !== 0 &&
              <ModalSelector
                data={balances.map(item => ({
                  key: item.name,
                  label: this._formatBalance(item.name, item.balance)
                }))}
                onChange={option => this.setState({
                  token: option.key,
                  formattedToken: option.label
                },
                this._nextInput('token'))}
                disabled={trxBalance === 0}
              >
                <Input
                  label='TOKEN'
                  value={this.state.formattedToken}
                  rightContent={this._rightContentToken}
                />
              </ModalSelector>
            }
            <Utils.VerticalSpacer size='medium' />
            <Input
              innerRef={(input) => { this.to = input }}
              label='TO'
              rightContent={this._rightContentTo}
              value={to}
              onChangeText={text => this.changeInput(text, 'to')}
              onSubmitEditing={() => this._nextInput('to')}
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
            <Input
              innerRef={(input) => { this.amount = input }}
              label='AMOUNT'
              keyboardType='numeric'
              placeholder='0'
              value={amount}
              onChangeText={text => this.changeInput(text, 'amount')}
              onSubmitEditing={() => this._nextInput('amount')}
              align='right'
            />
            <Utils.VerticalSpacer size='medium' />
            <Utils.VerticalSpacer />
            {error && <Utils.Error>{error}</Utils.Error>}
            {loadingSign || loadingData ? (
              <ActivityIndicator size='small' color={Colors.primaryText} />
            ) : (
              <ButtonGradient
                font='bold'
                text='SEND'
                onPress={this.submit}
                disabled={trxBalance === 0}
              />
            )}
          </Utils.Content>
        </Utils.Container>
      </KeyboardScreen>
    )
  }
}

export default props => (
  <Context.Consumer>
    {context => <SendScene context={context} {...props} />}
  </Context.Consumer>
)
