import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import numeral from 'numeral'
import qs from 'qs'
import Feather from 'react-native-vector-icons/Feather'
import Config from 'react-native-config'
import { ActivityIndicator, SafeAreaView, Linking } from 'react-native'

import ButtonGradient from '../../components/ButtonGradient'
import * as Utils from '../../components/Utils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Client, { ONE_TRX } from '../../services/client'
import { TronVaultURL, MakeTronMobileURL } from '../../utils/deeplinkUtils'
import { signTransaction } from '../../utils/transactionUtils';
import { getUserPublicKey } from '../../utils/userAccountUtils'
import formatNumber from '../../utils/formatNumber'

class ParticipateScene extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <SafeAreaView style={{ backgroundColor: 'black' }}>
          <Utils.Header>
            <Utils.TitleWrapper>
              <Utils.Title>Participate</Utils.Title>
            </Utils.TitleWrapper>
            <Utils.LoadButtonWrapper>
              <Utils.LoadButton onPress={() => navigation.goBack()}>
                <Feather name='x' color='white' size={32} />
              </Utils.LoadButton>
            </Utils.LoadButtonWrapper>
          </Utils.Header>
        </SafeAreaView>
      )
    }
  }

  state = {
    value: '',
    loading: false,
    error: null,
  }

  _submit = async () => {
    const { navigation } = this.props;
    try {
      this.setState({ loading: true });

      if (navigation.state.params.trxBalance < this.state.value) {
        alert('Insufficient TRX balance');
        throw new Error('Insufficient TRX balance');
      }
      const pk = await getUserPublicKey()
      const data = await Client.getParticipateTransaction({
        participateAddress: navigation.state.params.token.ownerAddress,
        participateToken: navigation.state.params.token.name,
        participateAmount: Number(this.state.value)
      });

      const dataToSend = qs.stringify({
        txDetails: {
          from: pk,
          issuer: navigation.state.params.token.ownerAddress,
          token: navigation.state.params.token.name,
          amount: Number(this.state.value),
          Type: 'PARTICIPATE'
        },
        pk: pk,
        from: 'mobile',
        action: 'transaction',
        URL: MakeTronMobileURL('transaction'),
        data
      })

      // this.openDeepLink(dataToSend)]
      this.openTransactionDetails(data)

    } catch (err) {
      alert("Error while building transaction, try again.");
      console.warn(err.response);
    } finally {
      this.setState({ loading: false })
    }
  }

  openDeepLink = async (dataToSend) => {
    try {
      const url = `${TronVaultURL}auth/${dataToSend}`
      await Linking.openURL(url)
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false }, () => {
        this.props.navigation.navigate('GetVault')
      })
    }
  }

  openTransactionDetails = async (transactionUnsigned) => {
    try {
      const transactionSigned = await signTransaction(transactionUnsigned);
      this.setState({ loading: false }, () => {
        this.props.navigation.navigate('TransactionDetail', { tx: transactionSigned })
      })
    } catch (error) {
      this.setState({ error: 'Error getting transaction', loading: false })
    }
  }


  formatPercentage = (percentage) => numeral(percentage).format('0.[00]') + '%'

  formatCurrency = value => numeral(value).format('0,0[.]00')

  formatValue = (value) => {
    const price = value / ONE_TRX;
    const formattedValue = formatNumber(price.toFixed(2));
    return formattedValue;
  }

  formatDate = date => moment(date).format('YYYY-MM-DD h:mm:ss')

  renderConfirmButtom = () => {
    if (this.state.loading) return <ActivityIndicator color={'#ffffff'} />

    return (
      <ButtonGradient onPress={this._submit} text='Confirm' size='xsmall' />
    )
  }

  render() {
    const token = this.props.navigation.getParam('token')
    return (
      <KeyboardAwareScrollView>
        <Utils.Container>
          <Utils.Content>
            <Utils.View >
              <Utils.Content justify='center'>
                <Utils.Row justify='space-between'>
                  <Utils.Text size='medium'>{token.name}</Utils.Text>
                </Utils.Row>
                <Utils.VerticalSpacer size='medium' />
                <Utils.Text size='xsmall' secondary>
                  AMOUNT
                </Utils.Text>
                <Utils.FormInput
                  keyboardType='numeric'
                  placeholder='0'
                  value={this.state.value}
                  onChangeText={value => this.setState({ value })}
                  underlineColorAndroid='transparent'
                  returnKeyType={'send'}
                />
                <Utils.Text>
                  {Number(this.state.value) * token.price / ONE_TRX} TRX
                </Utils.Text>
                <Utils.VerticalSpacer />
                {this.renderConfirmButtom()}
              </Utils.Content>
              <Utils.Row justify='space-between'>
                <Utils.View>
                  <Utils.Text size='xsmall' secondary>PRICE PER TOKEN</Utils.Text>
                  <Utils.Text>{`${this.formatValue(token.price)} TRX`}</Utils.Text>
                </Utils.View>
                <Utils.View>
                  <Utils.Text size='xsmall' secondary>FROZEN</Utils.Text>
                  <Utils.Text>{token.frozenPercentage}%</Utils.Text>
                </Utils.View>
              </Utils.Row>
              <Utils.VerticalSpacer size='medium' />
              <Utils.Row justify='space-between'>
                <Utils.View>
                  <Utils.Text size='xsmall' secondary>PERCENTAGE</Utils.Text>
                  <Utils.Text>{this.formatPercentage(token.percentage)}</Utils.Text>
                </Utils.View>
                <Utils.View>
                  <Utils.Text size='xsmall' secondary>ISSUED</Utils.Text>
                  <Utils.Text>{token.issued}</Utils.Text>
                </Utils.View>
                <Utils.View>
                  <Utils.Text size='xsmall' secondary>TOTALSUPPLY</Utils.Text>
                  <Utils.Text>{token.totalSupply}</Utils.Text>
                </Utils.View>
              </Utils.Row>
              <Utils.VerticalSpacer size='medium' />
              <Utils.Text size='xsmall' secondary>DESCRIPTION</Utils.Text>
              <Utils.Text size='xsmall'>{token.description}</Utils.Text>
              <Utils.VerticalSpacer size='medium' />
              <Utils.Text size='xsmall' secondary>TRANSACTION</Utils.Text>
              <Utils.Text size='xsmall'>{token.transaction}</Utils.Text>
              <Utils.VerticalSpacer size='medium' />
              <Utils.Text size='xsmall' secondary>OWNER ADDRESS</Utils.Text>
              <Utils.Text size='xsmall'>{token.ownerAddress}</Utils.Text>
              <Utils.VerticalSpacer size='medium' />
              <Utils.Row justify='space-between'>
                <Utils.View>
                  <Utils.Text size='xsmall' secondary>TRXNUM</Utils.Text>
                  <Utils.Text>{token.trxNum / ONE_TRX}</Utils.Text>
                </Utils.View>
                <Utils.View>
                  <Utils.Text size='xsmall' secondary>NUM</Utils.Text>
                  <Utils.Text>{token.num}</Utils.Text>
                </Utils.View>
                <Utils.View>
                  <Utils.Text size='xsmall' secondary>BLOCK</Utils.Text>
                  <Utils.Text>{token.block}</Utils.Text>
                </Utils.View>
              </Utils.Row>
              <Utils.VerticalSpacer size='medium' />
              <Utils.Row justify='space-between'>
                <Utils.View width='50%'>
                  <Utils.Text size='xsmall' secondary>STARTTIME</Utils.Text>
                  <Utils.Text size='xsmall'>{this.formatDate(token.startTime)}</Utils.Text>
                </Utils.View>
                <Utils.View width='50%'>
                  <Utils.Text size='xsmall' secondary>ENDTIME</Utils.Text>
                  <Utils.Text size='xsmall'>{this.formatDate(token.endTime)}</Utils.Text>
                </Utils.View>
              </Utils.Row>
              <Utils.VerticalSpacer size='medium' />
              <Utils.Row>
                <Utils.View width='50%'>
                  <Utils.Text size='xsmall' secondary>DATECREATED</Utils.Text>
                  <Utils.Text size='xsmall'>{this.formatDate(token.dateCreated)}</Utils.Text>
                </Utils.View>
                <Utils.View width='50%'>
                  <Utils.Text size='xsmall' secondary>VOTESCORE</Utils.Text>
                  <Utils.Text>{token.voteScore}</Utils.Text>
                </Utils.View>
              </Utils.Row>
              <Utils.VerticalSpacer size='medium' />
              <Utils.Text size='xsmall' secondary>URL</Utils.Text>
              <Utils.Text>{token.url}</Utils.Text>
              <Utils.VerticalSpacer size='medium' />
            </Utils.View>
          </Utils.Content>
        </Utils.Container>
      </KeyboardAwareScrollView>
    )
  }
}

export default ParticipateScene
