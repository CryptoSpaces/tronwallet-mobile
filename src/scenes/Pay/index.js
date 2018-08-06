import React, { Component } from 'react'
import { Alert } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'

// Design
import * as Utils from '../../components/Utils'
import NavigationHeader from '../../components/Navigation/Header'
import SyncIcon from '../../components/SyncButton'

// Service
import WalletClient, { ONE_TRX } from '../../services/client'

// Utils
import { isAddressValid } from '../../services/address'
import { signTransaction } from '../../utils/transactionUtils'
import withContext from '../../utils/hocs/withContext'
import getBalanceStore from '../../store/balance'

class DataError extends Error {
  constructor (message) {
    super(message)
    this.name = 'DataError'
    this.message = message
  }
}

export class index extends Component {
    static navigationOptions = () => {
      return { header: null }
    }

    state = {
      loading: false,
      balances: []
    }

    componentDidMount () {
      this._loadData()
    }

    _loadData = async () => {
      const store = await getBalanceStore()
      const balances = store.objects('Balance').map(item => Object.assign({}, item))
      this.setState({ balances })
    }

    _checkToken = token => !!this.state.balances.find(b => b.name === token)

    _checkAmount = (amount, token) => (
      amount >= 1 / ONE_TRX && amount && this.state.balances.find(b => b.name === token).balance > amount
    )

    _onRead = event => {
      const { context } = this.props
      const { data } = event
      const from = context.publicKey.value
      try {
        const parseData = JSON.parse(data)
        const { address, amount, token, description } = parseData

        if (!isAddressValid(address) || from === address) throw new DataError('Receiver invalid')
        if (!this._checkToken(token)) throw new DataError('You don\'t have the token to this transaction')
        if (!this._checkAmount(amount, token)) throw new DataError('Not enough balance or invalid amount.')

        const paymentDetail = `Amount:${amount}\nToken:${token}\n\n${description || 'No Description available. Double check the transaction submition'}`
        Alert.alert(
          'Payment Detail',
          paymentDetail,
          [
            {text: 'Cancel', onPress: () => {}, style: 'cancel'},
            {text: 'Continue', onPress: () => this._transferAsset({to: address, amount, token, from})}
          ],
          { cancelable: true }
        )
      } catch (error) {
        if (error.name === 'DataError') Alert.alert('Warning', error.message)
        else Alert.alert('Warning', 'Payment detail invalid. Please, scan a valid one')
      }
    }

    _transferAsset = async ({to, amount, token, from}) => {
      this.setState({ loading: true, error: null })
      try {
        const data = await WalletClient.getTransferTransaction({
          from,
          to,
          amount,
          token
        })
        this._openTransactionDetails(data)
      } catch (error) {
        Alert.alert('Warning', 'Woops something went wrong. Try again or if the error persist try another QRCode payment.')
        this.setState({
          loading: false
        })
      }
    }

    _openTransactionDetails = async transactionUnsigned => {
      try {
        const transactionSigned = await signTransaction(this.props.context.pin, transactionUnsigned)
        this.setState({ loading: false, error: null }, () => {
          this.props.navigation.navigate('SubmitTransaction', {
            tx: transactionSigned
          })
        })
      } catch (error) {
        Alert.alert('Warning', 'Woops something went wrong. Try again or if the error persist try another QRCode payment.')
        this.setState({ loading: false })
      }
    }

    render () {
      const { navigation } = this.props
      const { loading } = this.state
      return (
        <Utils.Container>
          <NavigationHeader
            title='Scan Transaction'
            onBack={() => { navigation.goBack() }}
            rightButton={<SyncIcon disabled loading={loading} />}
            noBorder
          />
          <QRCodeScanner
            showMarker
            fadeIn
            customMarker={
              <Utils.View
                flex={1}
                background='transparent'
                justify='center'
                align='center'
              >
                <Utils.View
                  width={250}
                  height={250}
                  borderWidth={2}
                  borderColor={'white'}
                />
                <Utils.Text marginTop='medium' align='center'>
                  Scan the transaction QRCode
                </Utils.Text>
              </Utils.View>
            }
            cameraStyle={{
              height: '100%',
              width: '100%',
              justifyContent: 'flex-start'
            }}
            permissionDialogMessage='To scan the transaction the app needs your permission to access the camera.'
            onRead={this._onRead}
          />
        </Utils.Container>
      )
    }
}

export default withContext(index)
