import React, { Component } from 'react'
import {
  ActivityIndicator,
  Clipboard,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Modal
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ModalSelector from 'react-native-modal-selector'

import ButtonGradient from '../../components/ButtonGradient'
import Client from '../../services/client'
import Header from '../../components/Header'
import Input from '../../components/Input/Input'
import QRScanner from '../../components/QRScanner'
import * as Utils from '../../components/Utils'
import { Colors, FontSize } from '../../components/DesignSystem'

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
        error: 'Error getting transaction',
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

  _openModal = () => this.setState({ QRModalVisible: true })

  _onPaste = async () => {
    const content = await Clipboard.getString()
    this.changeInput(content, 'to')
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

  _rightContent = () => (
    <React.Fragment>
      <Utils.FormButton onPress={this._onPaste}>
        <Ionicons
          name='md-clipboard'
          size={FontSize['medium']}
          color={Colors.buttonText}
        />
      </Utils.FormButton>
      <Utils.HorizontalSpacer />
      <Utils.FormButton onPress={this._openModal}>
        <Ionicons
          name='ios-qr-scanner'
          size={FontSize['medium']}
          color={Colors.buttonText}
        />
      </Utils.FormButton>
    </React.Fragment>
  )

  render () {
    const { loadingSign, loadingData, error, to, trxBalance } = this.state
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: Colors.background }}
        enabled
      >
        <KeyboardAwareScrollView>
          <Utils.StatusBar />
          <Utils.Container>
            <Header>
              <Utils.View align='center'>
                <Utils.Text size='xsmall' secondary>
                  BALANCE
                </Utils.Text>
                <Utils.Row align='center'>
                  <Utils.Text size='huge'>{trxBalance.toFixed(2)}</Utils.Text>
                  <Utils.HorizontalSpacer size='xsmall' />
                  <Utils.View
                    style={{
                      backgroundColor: Colors.lighterBackground,
                      borderRadius: 3,
                      paddingHorizontal: 8,
                      paddingVertical: 6
                    }}
                  >
                    <Utils.Text size='small'>TRX</Utils.Text>
                  </Utils.View>
                </Utils.Row>
              </Utils.View>
            </Header>
            <Utils.Content>
              <Input
                label='TO'
                type='default'
                leftContent={this._leftContent}
                rightContent={this._rightContent}
                value={to}
                onChange={text => this.changeInput(text, 'to')}
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
              <ModalSelector
                data={this.state.balances.map(item => ({
                  key: item.name,
                  label: item.name
                }))}
                onChange={option => this.setState({ token: option.label })}
              >
                <Input
                  label='TOKEN'
                  value={this.state.token}
                />
              </ModalSelector>
              <Utils.VerticalSpacer size='medium' />
              <Input
                label='AMOUNT'
                type='numeric'
                placeholder='0'
                value={to}
                onChange={text => this.changeInput(text, 'amount')}
              />
            </Utils.Content>
            {error && <Utils.Error>{error}</Utils.Error>}
            <Utils.Content justify='center'>
              {loadingSign || loadingData ? (
                <ActivityIndicator size='small' color={Colors.primaryText} />
              ) : (
                <ButtonGradient
                  text='SEND'
                  onPress={this.submit}
                  size='medium'
                  marginVertical='large'
                  font='bold'
                />
              )}
              <Utils.VerticalSpacer />
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
