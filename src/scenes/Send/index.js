import React, { Component } from 'react'

import {
  ActivityIndicator,
  Clipboard,
  Alert,
  Modal,
  TouchableOpacity
} from 'react-native'

import { Answers } from 'react-native-fabric'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ActionSheet from 'react-native-actionsheet'

import ButtonGradient from '../../components/ButtonGradient'
import Client from '../../services/client'
import Input from '../../components/Input'
import QRScanner from '../../components/QRScanner'
import IconButton from '../../components/IconButton'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import KeyboardScreen from '../../components/KeyboardScreen'
import NavigationHeader from '../../components/Navigation/Header'

import { isAddressValid } from '../../services/address'
import { signTransaction } from '../../utils/transactionUtils'
import { formatNumber } from '../../utils/numberUtils'
import getBalanceStore from '../../store/balance'
import { withContext } from '../../store/context'

class SendScene extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <NavigationHeader
          title='SEND'
          onBack={() => { navigation.goBack() }}
          noBorder
        />
      )
    }
  }
  state = {
    from: '',
    to: '',
    amount: '',
    token: 'TRX',
    addressError: null,
    formattedToken: ``,
    balances: [{
      balance: 0,
      token: 'TRX'
    }],
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

  _changeAddress = (to) => {
    const trimmedTo = to.trim()
    if (isAddressValid(trimmedTo)) {
      this.setState({
        to: trimmedTo,
        addressError: null
      })
    } else {
      this.setState({
        to: trimmedTo,
        addressError: 'Address is either incomplete or invalid.'
      })
    }
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
      Alert.alert('Warning', 'Woops something went wrong. Try again later, If the error persist try to update the network settings.')
      this.setState({
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
      Alert.alert('Warning', 'Woops something went wrong. Try again later, If the error persist try to update the network settings.')
      this.setState({ loadingSign: false })
    }
  }

  _readPublicKey = e => this.setState({ to: e.data }, () => {
    this._closeModal()
    this._nextInput('to')
  })

  _openModal = () => this.setState({ QRModalVisible: true })

  _onPaste = async () => {
    const content = await Clipboard.getString()
    if (content) {
      this._changeAddress(content)
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

  _handleTokenChange = (index, formattedToken) => {
    if (index !== 0) {
      this.setState({
        token: this.state.balances[index - 1].name,
        formattedToken
      }, this._nextInput('token'))
    }
  }

  render () {
    const { loadingSign, loadingData, token, error, to, amount, balances, addressError } = this.state
    const tokenOptions = balances.map(({ name, balance }) => this._formatBalance(name, balance))
    const balanceSelected = balances.find(b => b.name === token)
    tokenOptions.unshift('Cancel')
    return (
      <KeyboardScreen>
        <Utils.Content>
          <ActionSheet
            ref={ref => { this.ActionSheet = ref }}
            title='Please, choose a token below.'
            options={tokenOptions}
            cancelButtonIndex={0}
            onPress={index => this._handleTokenChange(index, tokenOptions[index])}
          />
          <TouchableOpacity onPress={() => this.ActionSheet.show()}>
            <Input
              label='TOKEN'
              value={this.state.formattedToken}
              rightContent={this._rightContentToken}
              editable={false}
            />
          </TouchableOpacity>
          <Utils.VerticalSpacer size='medium' />
          <Input
            innerRef={(input) => { this.to = input }}
            label='TO'
            rightContent={this._rightContentTo}
            value={to}
            onChangeText={to => this._changeAddress(to)}
            onSubmitEditing={() => this._nextInput('to')}
          />
          {addressError && (
            <React.Fragment>
              <Utils.Text size='xsmall' color='#ff5454'>
                {addressError}
              </Utils.Text>
            </React.Fragment>
          )}
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
            value={amount}
            placeholder='0'
            onChangeText={text => this._changeInput(text, 'amount', true)}
            onSubmitEditing={() => this._nextInput('amount')}
            align='right'
            numbersOnly
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
              disabled={Number(amount) < 1 || Number(balanceSelected.balance) < Number(amount) || !isAddressValid(to)}
            />
          )}
        </Utils.Content>
      </KeyboardScreen>
    )
  }
}

export default withContext(SendScene)
