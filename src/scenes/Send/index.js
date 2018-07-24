import React, { Component } from 'react'

import {
  ActivityIndicator,
  Clipboard,
  Alert,
  Modal
} from 'react-native'

import { Answers } from 'react-native-fabric'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ModalSelector from 'react-native-modal-selector'

import ButtonGradient from '../../components/ButtonGradient'
import Client from '../../services/client'
import Input from '../../components/Input'
import QRScanner from '../../components/QRScanner'
import IconButton from '../../components/IconButton'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import KeyboardScreen from '../../components/KeyboardScreen'

import { isAddressValid } from '../../services/address'
import { signTransaction } from '../../utils/transactionUtils'
import { formatNumber } from '../../utils/numberUtils'
import getBalanceStore from '../../store/balance'
import { withContext } from '../../store/context'

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
    Answers.logContentView('Page', 'Send')
    this._navListener = this.props.navigation.addListener(
      'didFocus',
      this._loadData
    )
  }

  componentWillUnmount () {
    this._navListener.remove()
  }

  _orderBalances = balances => {
    let orderedBalances = []
    balances.forEach((balance) => {
      if (balance.name === 'TRX') {
        orderedBalances[0] = balance
      } else if (balance.name === 'TWX') {
        orderedBalances[1] = balance
      }
    })
    return [...orderedBalances, ...balances.filter((balance) => balance.name !== 'TRX' && balance.name !== 'TWX')]
  }

  _getBalancesFromStore = async () => {
    const store = await getBalanceStore()
    return store.objects('Balance').map(item => Object.assign({}, item))
  }

  _loadData = async () => {
    this.setState({ loading: true })
    try {
      const balances = await this._getBalancesFromStore()
      const userPublicKey = this.props.context.publicKey.value
      let orderedBalances = []
      let balance = 0

      if (balances.length) {
        balance = balances.find(b => b.name === 'TRX').balance
        orderedBalances = this._orderBalances(balances)
      }

      this.setState({
        from: userPublicKey,
        balances: orderedBalances,
        loadingData: false,
        trxBalance: balance,
        formattedToken: this._formatBalance('TRX', balance),
        warning: balance === 0 ? 'Not enough balance.' : null
      })
    } catch (error) {
      Alert.alert('Error while getting balance data')
      // TODO - Error handler
      this.setState({
        loadingData: false
      })
    }
  }

  _changeInput = (text, field) => {
    this.setState({
      [field]: text,
      error: null
    })
  }

  _submit = () => {
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

    if (!amount || balanceSelected.balance < amount || amount < 1) {
      this.setState({ error: 'Invalid amount' })
      return
    }

    this._transferAsset()
  }

  clearInput = () => {
    this.setState({
      to: '',
      token: 'TRX',
      amount: ''
    })
  }

  _transferAsset = async () => {
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
      this._openTransactionDetails(data)
      this.clearInput()
    } catch (error) {
      this.setState({
        error: 'Oops. Something wrong while building transaction. Please Try Again',
        loadingSign: false
      })
    }
  }

  _openTransactionDetails = async transactionUnsigned => {
    try {
      const transactionSigned = await signTransaction(this.props.context.pin, transactionUnsigned)
      this.setState({ loadingSign: false, error: null }, () => {
        this.props.navigation.navigate('SubmitTransaction', {
          tx: transactionSigned
        })
      })
    } catch (error) {
      this.setState({ error: 'Oops. Something wrong while building transaction. Please Try Again', loadingSign: false })
    }
  }

  _readPublicKey = e => this.setState({ to: e.data }, () => {
    this.closeModal()
    this._nextInput('to')
  })

  _openModal = () => this.setState({ QRModalVisible: true })

  _onPaste = async () => {
    const content = await Clipboard.getString()
    if (content) {
      this._changeInput(content, 'to')
      this._nextInput('to')
    }
  }

  _closeModal = () => {
    if (this.state.QRModalVisible) {
      this.setState({ QRModalVisible: false })
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
      this._submit()
    }
  }

  render () {
    const { loadingSign, loadingData, error, to, trxBalance, amount, balances } = this.state
    return (
      <KeyboardScreen>
        <Utils.Container style={{ borderColor: Colors.secondaryText, borderTopWidth: 0.5 }}>
          <Utils.Content>
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
            <Utils.VerticalSpacer size='medium' />
            <Input
              innerRef={(input) => { this.to = input }}
              label='TO'
              rightContent={this._rightContentTo}
              value={to}
              onChangeText={text => this._changeInput(text, 'to')}
              onSubmitEditing={() => this._nextInput('to')}
            />
            <Modal
              visible={this.state.QRModalVisible}
              onRequestClose={this._closeModal}
              animationType='slide'
            >
              <QRScanner
                onRead={this._readPublicKey}
                onClose={this._closeModal}
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
              onChangeText={text => this._changeInput(text, 'amount')}
              onSubmitEditing={() => this._nextInput('amount')}
              align='right'
            />
            <Utils.Text size='xsmall' secondary>
              The minimum amount for any send transaction is 1.
            </Utils.Text>
            <Utils.VerticalSpacer size='large' />
            {error && (
              <React.Fragment>
                <Utils.Error>{error}</Utils.Error>
                <Utils.VerticalSpacer size='large' />
              </React.Fragment>
            )}
            {loadingSign || loadingData ? (
              <ActivityIndicator size='small' color={Colors.primaryText} />
            ) : (
              <ButtonGradient
                font='bold'
                text='SEND'
                onPress={this._submit}
                disabled={Number(amount) < 1 || trxBalance < Number(amount)}
              />
            )}
          </Utils.Content>
        </Utils.Container>
      </KeyboardScreen>
    )
  }
}

export default withContext(SendScene)
