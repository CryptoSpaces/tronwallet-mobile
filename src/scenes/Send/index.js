import React, { Component } from 'react'
import { ActivityIndicator, Linking, Alert, KeyboardAvoidingView, Modal } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import qs from 'qs'
import { Select, Option } from 'react-native-chooser'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import ButtonGradient from '../../components/ButtonGradient'
import Client from '../../services/client'
import Header from '../../components/Header'
import PasteInput from '../../components/PasteInput'
import QRScanner from '../../components/QRScanner'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import { TronVaultURL, MakeTronMobileURL } from '../../utils/deeplinkUtils'
import { isAddressValid } from '../../services/address'
import { signTransaction } from '../../utils/transactionUtils';

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
    trxBalance: 0.0,
    QRModalVisible: false
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this.loadData()
    })
  }

  componentWillUnmount() {
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

  onSelectToken = (value, label) => {
    this.setState({ token: value })
  }

  clearInput = () => {
    this.setState({
      to: '',
      token: 'Select your balance',
      amount: 0,
    });
  }

  renderTokens = () => {
    const { balances } = this.state
    return balances.map(bl => (
      <Option key={bl.name} value={bl.name}>{`${bl.balance} ${
        bl.name
        }`}</Option>
    ))
  }

  transferAsset = async () => {
    const { from, to, amount, token } = this.state
    this.setState({ loadingSign: true })
    try {
      //TronScan
      // const data = await Client.getTransactionString({from,to,amount,token});
      //Serverless
      const data = await Client.getTransferTransaction({ from, to, amount, token });

      // Data to deep link, same format as Tron Wallet
      const dataToSend = qs.stringify({
        txDetails: { from, to, amount, Type: 'SEND' },
        pk: from,
        action: 'transaction',
        from: 'mobile',
        URL: MakeTronMobileURL('transaction'),
        data
      })

      this.openTransactionDetails(data)
      //this.openDeepLink(dataToSend)

    } catch (error) {
      this.setState({ error: 'Error getting transaction', loadingSign: false })
    } finally {
      this.clearInput()
    }
  }

  openTransactionDetails = async (transactionUnsigned) => {
    try {
      const transactionSigned = await signTransaction(transactionUnsigned);
      this.setState({ loadingSign: false }, () => {
        this.props.navigation.navigate('TransactionDetail', { tx: transactionSigned })
      })
    } catch (error) {
      this.setState({ error: 'Error getting transaction', loadingSign: false })
    }
  }

  openDeepLink = async (dataToSend) => {
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


  /*
    TODO: Weird behavior happening here. After read, the modal closes and somewhere somehow some function is trying
    to set state on the QRCodescanner component. Probably a bug on QRScanner library. Gotta investigate this later.
  */
  readPublicKey = (e) => this.setState({ to: e.data }, this.closeModal)

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

  render() {
    const { loadingSign, loadingData, error, to, trxBalance } = this.state
    return (
      <KeyboardAvoidingView
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
                qrScan={this.openModal}
              />
              <Modal
                visible={this.state.QRModalVisible}
                onRequestClose={this.closeModal}
                animationType='slide'
              >
                <QRScanner onRead={this.readPublicKey} onClose={this.closeModal} checkAndroid6Permissions />
              </Modal>
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
                  ref={i => this.amount = i}
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
                  <ButtonGradient text='Send' onPress={this.submit} size='small' />
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
