import React, { Component } from 'react'
import { ActivityIndicator, Linking } from 'react-native'
import qs from 'qs'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'

class SendScene extends Component {
  state = {
    email: '',
    password: '',
    signError: null,
    isSubmitting: false,
    signedTransaction: null,
    loadingSign: false
  }

  componentDidMount () {
    Linking.addEventListener('url', this.handleOpenURL)
    // let redirectUrl = Expo.Linking.makeUrl('path/into/app', { hello: 'world', goodbye: 'now' });
    // console.log(">?!?!", redirectUrl);
  }

  handleOpenURL = (event) => { // D
    console.log('>>', event.url)
    try {
      const tx = qs.parse(event.url.replace('exp://localhost:19000/--/?', ''))
      console.log('>>TX', tx)
      this.setState({ isSubmitting: true, signedTransaction: tx.signedTx })
    } catch (error) {
      // alert('Invalid Transaction! Please contact the support.')
    }
  }

  changeInput = (text, field) => {
    this.setState({
      [field]: text
    })
  }

  sendDeepLink = async () => {
    const dataToSend = qs.stringify({
      txDetails: {
        from: 'test', to: 'test', amount: 123123
      },
      data: '1AUIDHasuiDH1231USAHuiadshu',
      pk: '27YANsgphrSWUiuwMTwwE13jHWt6dYgLwG6',
      from: 'mobile'
    })
    const url = `tronvault://tronvault/Auth/${dataToSend}`
    try {
      const supported = await Linking.canOpenURL(url)
      if (supported) await Linking.openURL(url)
    } catch (error) {
      console.log('error', error)
    }
  }

  submitTransaction = async () => {
    // alert('TransactionSigned>' + this.state.signedTransaction)
  }

  render () {
    const { loadingSign, isSubmitting } = this.state
    return (
      <Utils.Container>
        <Utils.Content height={100} justify='center' align='center'>
          <Utils.Text size='large'>Send Form</Utils.Text>
        </Utils.Content>
        <Utils.VerticalSpacer size='small' />
        <Utils.Content>
          <Utils.Text size='xsmall' secondary>From</Utils.Text>
          <Utils.FormInput underlineColorAndroid='transparent' keyboardType='email-address' onChangeText={(text) => this.changeInput(text, 'email')} />
          <Utils.Text size='xsmall' secondary>To</Utils.Text>
          <Utils.FormInput underlineColorAndroid='transparent' secureTextEntry letterSpacing={10} onChangeText={(text) => this.changeInput(text, 'password')} />
          <Utils.Text size='xsmall' secondary>Amount</Utils.Text>
          <Utils.FormInput underlineColorAndroid='transparent' secureTextEntry letterSpacing={10} onChangeText={(text) => this.changeInput(text, 'password')} />
          {loadingSign && !isSubmitting ? <ActivityIndicator size='small' color={Colors.yellow} />
            : <ButtonGradient text='Send TRX' onPress={this.sendDeepLink} />}
          <Utils.VerticalSpacer size='small' />
          {!loadingSign && isSubmitting && <ButtonGradient text='Submit Transaction' onPress={this.submitTransaction} />}
        </Utils.Content>
      </Utils.Container >
    )
  }
}

export default SendScene
