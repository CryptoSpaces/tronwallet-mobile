import React, { Component } from 'react'
import axios from 'axios'
import { ActivityIndicator, KeyboardAvoidingView, View } from 'react-native'
import moment from 'moment'
import qs from 'qs'
import { Linking } from 'expo'

import * as Utils from '../../components/Utils'
import { Spacing, Colors } from './../../components/DesignSystem'
import ButtonGradient from './../../components/ButtonGradient'

class ParticipateScene extends Component {
  state = {
    value: '',
    loading: false
  }

  _confirm = async () => {
    try {
      this.setState({ loading: true })
      const response = await axios.post('https://tronnotifier-dev.now.sh/v1/wallet/participate', {
        from: '27dAbjameXqs7U259Fe15WjQvgLyJB2pCWu',
        issuer: this.props.navigation.state.params.token.ownerAddress,
        token: this.props.navigation.state.params.token.name,
        amount: Number(this.state.value)
      })
      const dataToSend = qs.stringify({
        txDetails: {
          from: '27dAbjameXqs7U259Fe15WjQvgLyJB2pCWu',
          issuer: this.props.navigation.state.params.token.ownerAddress,
          token: this.props.navigation.state.params.token.name,
          amount: Number(this.state.value),
          Type: 'PARTICIPATE'
        },
        pk: '27dAbjameXqs7U259Fe15WjQvgLyJB2pCWu',
        from: 'mobile',
        URL: Linking.makeUrl('transaction'),
        data: response.data.transaction
      })
      const url = `tronvault://tronvault/auth/${dataToSend}`
      const supported = await Linking.canOpenURL(url)
      if (supported) await Linking.openURL(url)
    } catch (err) {
      console.log(err)
    }
    this.setState({ loading: false })
  }

  renderConfirmButtom = () => {
    if (this.state.loading) return (<ActivityIndicator />)

    return (<ButtonGradient onPress={this._confirm} text='Confirm' size='small' />)
  }

  render () {
    const token = this.props.navigation.getParam('token')
    return (
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
        <Utils.KeyboardAwareContainer enableOnAndroid>
          <Utils.StatusBar />
          <Utils.Button onPress={this.props.navigation.goBack}>BACK</Utils.Button>
          <Utils.VerticalSpacer />

          <View style={{ padding: Spacing.small }}>
            <Utils.Card>
              <Utils.Text>ParticipateSceneModal</Utils.Text>
              <Utils.VerticalSpacer />

              <Utils.Column>
                <Utils.Text size='xsmall' success>block</Utils.Text>
                <Utils.Text>{token.block}</Utils.Text>
                <Utils.VerticalSpacer />

                <Utils.Text size='xsmall' success>transaction</Utils.Text>
                <Utils.Text>{token.transaction}</Utils.Text>
                <Utils.VerticalSpacer />

                <Utils.Text size='xsmall' success>ownerAddress</Utils.Text>
                <Utils.Text>{token.ownerAddress}</Utils.Text>
                <Utils.VerticalSpacer />

                <Utils.Text size='xsmall' success>name</Utils.Text>
                <Utils.Text>{token.name}</Utils.Text>
                <Utils.VerticalSpacer />

                <Utils.Row style={{ justifyContent: 'space-between' }}>

                  <Utils.Column>
                    <Utils.Text size='xsmall' success>trxNum</Utils.Text>
                    <Utils.Text>{token.trxNum}</Utils.Text>
                  </Utils.Column>

                  <Utils.Column>
                    <Utils.Text size='xsmall' success>num</Utils.Text>
                    <Utils.Text>{token.num}</Utils.Text>
                  </Utils.Column>

                </Utils.Row>
                <Utils.VerticalSpacer />

                <Utils.Row style={{ justifyContent: 'space-between' }}>
                  <Utils.Column>
                    <Utils.Text size='xsmall' success>startTime</Utils.Text>
                    <Utils.Text size='xsmall'>{moment(token.startTime).format('YYYY-MM-DD h:mm:ss')}</Utils.Text>
                  </Utils.Column>
                  <Utils.Column>
                    <Utils.Text size='xsmall' success>endTime</Utils.Text>
                    <Utils.Text size='xsmall'>{moment(token.endTime).format('YYYY-MM-DD h:mm:ss')}</Utils.Text>
                  </Utils.Column>
                </Utils.Row>
                <Utils.VerticalSpacer />

                <Utils.Text size='xsmall' success>voteScore</Utils.Text>
                <Utils.Text>{token.voteScore}</Utils.Text>
                <Utils.VerticalSpacer />

                <Utils.Text size='xsmall' success>description</Utils.Text>
                <Utils.Text>{token.description}</Utils.Text>
                <Utils.VerticalSpacer />

                <Utils.Text size='xsmall' success>url</Utils.Text>
                <Utils.Text>{token.url}</Utils.Text>
                <Utils.VerticalSpacer />

                <Utils.Text size='xsmall' success>dateCreated</Utils.Text>
                <Utils.Text>{token.dateCreated}</Utils.Text>
                <Utils.VerticalSpacer />

                <Utils.Row style={{ justifyContent: 'space-between' }}>

                  <Utils.Column>
                    <Utils.Text size='xsmall' success>frozen</Utils.Text>
                    <Utils.Text>{token.frozen}</Utils.Text>
                  </Utils.Column>

                  <Utils.Column>
                    <Utils.Text size='xsmall' success>price</Utils.Text>
                    <Utils.Text>{token.price}</Utils.Text>
                  </Utils.Column>

                </Utils.Row>
                <Utils.VerticalSpacer />

                <Utils.Row style={{ justifyContent: 'space-between' }}>
                  <Utils.Column>
                    <Utils.Text size='xsmall' success>percentage</Utils.Text>
                    <Utils.Text>{token.percentage}%</Utils.Text>
                  </Utils.Column>

                  <Utils.Column>
                    <Utils.Text size='xsmall' success>issued</Utils.Text>
                    <Utils.Text>{token.issued}</Utils.Text>
                  </Utils.Column>

                  <Utils.Column>
                    <Utils.Text size='xsmall' success>totalSupply</Utils.Text>
                    <Utils.Text>{token.totalSupply}</Utils.Text>
                  </Utils.Column>

                </Utils.Row>
                <Utils.VerticalSpacer />

              </Utils.Column>
            </Utils.Card>
          </View>
        </Utils.KeyboardAwareContainer>
        <Utils.View background={Colors.background} style={{ padding: Spacing.small }}>
          <Utils.FormInput
            keyboardType='numeric'
            placeholder='0'
            value={this.state.value}
            onChangeText={value => this.setState({ value })}
            underlineColorAndroid='transparent'
            returnKeyType={'send'}
          />
          <Utils.Text>Value: {Number(this.state.value) * token.price} TRX</Utils.Text>
          <Utils.VerticalSpacer />
          {this.renderConfirmButtom()}
        </Utils.View>
      </KeyboardAvoidingView >
    )
  }
}

export default ParticipateScene
