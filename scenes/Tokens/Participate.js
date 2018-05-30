import React, { Component } from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'
import axios from 'axios'
import moment from 'moment'
import numeral from 'numeral'
import qs from 'qs'
import { Linking } from 'expo'
import { Ionicons } from '@expo/vector-icons'

import ButtonGradient from './../../components/ButtonGradient'
import * as Utils from '../../components/Utils'
import { Colors } from './../../components/DesignSystem'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Client from '../../src/services/client'
import { DeeplinkURL } from '../../utils/deeplinkUtils'

class ParticipateScene extends Component {
  state = {
    value: '',
    loading: false
  }

  _confirm = async () => {
    try {
      const pk = await Client.getPublicKey()
      this.setState({ loading: true })

      const response = await axios.post(
        'https://tronnotifier-dev.now.sh/v1/wallet/participate',
        {
          from: pk,
          issuer: this.props.navigation.state.params.token.ownerAddress,
          token: this.props.navigation.state.params.token.name,
          amount: Number(this.state.value)
        }
      )
      const dataToSend = qs.stringify({
        txDetails: {
          from: pk,
          issuer: this.props.navigation.state.params.token.ownerAddress,
          token: this.props.navigation.state.params.token.name,
          amount: Number(this.state.value),
          Type: 'PARTICIPATE'
        },
        pk: pk,
        from: 'mobile',
        action: 'transaction',
        URL: Linking.makeUrl('transaction'),
        data: response.data.transaction
      })

      this.openDeepLink(dataToSend)
    } catch (err) {
      console.log(err)
    }
    this.setState({ loading: false })
  }

  openDeepLink = async (dataToSend) => {
    try {
      const url = `${DeeplinkURL}auth/${dataToSend}`
      await Linking.openURL(url)
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false }, () => {
        this.props.navigation.navigate('GetVault')
      })
    }
  }

  formatPercentage = (percentage) => numeral(percentage).format('0.[00]') + '%'

  formatCurrency = (value) => '$' + numeral(value).format('0,0[.]00')

  formatDate = (date) => moment(date).format('YYYY-MM-DD h:mm:ss')

  renderConfirmButtom = () => {
    if (this.state.loading) return <ActivityIndicator />

    return (
      <ButtonGradient onPress={this._confirm} text='Confirm' size='small' />
    )
  }

  render () {
    const token = this.props.navigation.getParam('token')
    console.log('TOKEN CHEGANDO>>', token)
    return (
      <KeyboardAwareScrollView>
        <Utils.StatusBar />
        <Utils.Container>
          <Utils.Content paddingSize='small'>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Ionicons name='ios-close' color={Colors.primaryText} size={40} />
            </TouchableOpacity>
            <Utils.VerticalSpacer />
            <Utils.Card paddingSize={'medium'}>
              <Utils.View >
                <Utils.Text size='medium'>{token.name}</Utils.Text>
                <Utils.VerticalSpacer size='large' />

                <Utils.Text size='xsmall' success>BLOCK</Utils.Text>
                <Utils.Text>{token.block}</Utils.Text>
                <Utils.VerticalSpacer size='medium' />

                <Utils.Text size='xsmall' success>TRANSACTION</Utils.Text>
                <Utils.Text>{token.transaction}</Utils.Text>
                <Utils.VerticalSpacer size='medium' />

                <Utils.Text size='xsmall' success>OWNERADDRESS</Utils.Text>
                <Utils.Text>{token.ownerAddress}</Utils.Text>
                <Utils.VerticalSpacer size='medium' />

                <Utils.Row>
                  <Utils.View width='50%'>
                    <Utils.Text size='xsmall' success>TRXNUM</Utils.Text>
                    <Utils.Text>{token.trxNum}</Utils.Text>
                  </Utils.View>
                  <Utils.View width='50%'>
                    <Utils.Text size='xsmall' success>NUM</Utils.Text>
                    <Utils.Text>{token.num}</Utils.Text>
                  </Utils.View>
                </Utils.Row>
                <Utils.VerticalSpacer size='medium' />

                <Utils.Row justify='space-between'>
                  <Utils.View width='50%'>
                    <Utils.Text size='xsmall' success>STARTTIME</Utils.Text>
                    <Utils.Text size='xsmall'>{this.formatDate(token.startTime)}</Utils.Text>
                  </Utils.View>
                  <Utils.View width='50%'>
                    <Utils.Text size='xsmall' success>ENDTIME</Utils.Text>
                    <Utils.Text size='xsmall'>{this.formatDate(token.endTime)}</Utils.Text>
                  </Utils.View>
                </Utils.Row>
                <Utils.VerticalSpacer size='medium' />

                <Utils.Row>
                  <Utils.View width='50%'>
                    <Utils.Text size='xsmall' success>DATECREATED</Utils.Text>
                    <Utils.Text size='xsmall'>{this.formatDate(token.dateCreated)}</Utils.Text>
                  </Utils.View>
                  <Utils.View width='50%'>
                    <Utils.Text size='xsmall' success>VOTESCORE</Utils.Text>
                    <Utils.Text>{token.voteScore}</Utils.Text>
                  </Utils.View>
                </Utils.Row>
                <Utils.VerticalSpacer size='medium' />

                <Utils.Text size='xsmall' success>DESCRIPTION</Utils.Text>
                <Utils.Text>{token.description}</Utils.Text>
                <Utils.VerticalSpacer size='medium' />

                <Utils.Text size='xsmall' success>URL</Utils.Text>
                <Utils.Text>{token.url}</Utils.Text>
                <Utils.VerticalSpacer size='medium' />

                <Utils.Row justify='space-between'>
                  <Utils.View width='50%'>
                    <Utils.Text size='xsmall' success>FROZEN</Utils.Text>
                    <Utils.Text>{token.frozen[0] ? token.frozen[0].amount : 0}</Utils.Text>
                  </Utils.View>
                  <Utils.View width='50%'>
                    <Utils.Text size='xsmall' success>PRICE</Utils.Text>
                    <Utils.Text>{this.formatCurrency(token.price)}</Utils.Text>
                  </Utils.View>
                </Utils.Row>
                <Utils.VerticalSpacer size='medium' />

                <Utils.Row justify='space-between'>
                  <Utils.View>
                    <Utils.Text size='xsmall' success>PERCENTAGE</Utils.Text>
                    <Utils.Text>{this.formatPercentage(token.percentage)}</Utils.Text>
                  </Utils.View>
                  <Utils.View>
                    <Utils.Text size='xsmall' success>ISSUED</Utils.Text>
                    <Utils.Text>{token.issued}</Utils.Text>
                  </Utils.View>
                  <Utils.View>
                    <Utils.Text size='xsmall' success>TOTALSUPPLY</Utils.Text>
                    <Utils.Text>{token.totalSupply}</Utils.Text>
                  </Utils.View>
                </Utils.Row>
                <Utils.VerticalSpacer size='medium' />
              </Utils.View>
              <Utils.Content>
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
                  Value: {Number(this.state.value) * token.price} TRX
                </Utils.Text>
                <Utils.VerticalSpacer />
                {this.renderConfirmButtom()}
              </Utils.Content>
            </Utils.Card>
          </Utils.Content>
        </Utils.Container>
      </KeyboardAwareScrollView >
    )
  }
}

export default ParticipateScene
