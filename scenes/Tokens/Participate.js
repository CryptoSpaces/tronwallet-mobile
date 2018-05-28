import React, { Component } from 'react'
import axios from 'axios'
import { ActivityIndicator } from 'react-native'
import qs from 'qs'
import { Linking } from 'expo'

import * as Utils from '../../components/Utils'

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

  render () {
    return (
      <Utils.KeyboardAwareContainer enableOnAndroid>
        <Utils.StatusBar />
        <Utils.Content>
          <Utils.Button onPress={this.props.navigation.goBack}>BACK</Utils.Button>
          <Utils.VerticalSpacer />
          <Utils.Text>ParticipateSceneModal</Utils.Text>
          <Utils.Text>position: {this.props.navigation.state.params.position}</Utils.Text>
          <Utils.Text>block: {this.props.navigation.state.params.token.block}</Utils.Text>
          <Utils.Text>transaction: {this.props.navigation.state.params.token.transaction}</Utils.Text>
          <Utils.Text>ownerAddress: {this.props.navigation.state.params.token.ownerAddress}</Utils.Text>
          <Utils.Text>name: {this.props.navigation.state.params.token.name}</Utils.Text>
          <Utils.Text>totalSupply: {this.props.navigation.state.params.token.totalSupply}</Utils.Text>
          <Utils.Text>trxNum: {this.props.navigation.state.params.token.trxNum}</Utils.Text>
          <Utils.Text>num: {this.props.navigation.state.params.token.num}</Utils.Text>
          <Utils.Text>startTime: {this.props.navigation.state.params.token.startTime}</Utils.Text>
          <Utils.Text>endTime: {this.props.navigation.state.params.token.endTime}</Utils.Text>
          <Utils.Text>voteScore: {this.props.navigation.state.params.token.voteScore}</Utils.Text>
          <Utils.Text>description: {this.props.navigation.state.params.token.description}</Utils.Text>
          <Utils.Text>url: {this.props.navigation.state.params.token.url}</Utils.Text>
          <Utils.Text>dateCreated: {this.props.navigation.state.params.token.dateCreated}</Utils.Text>
          <Utils.Text>frozen: {this.props.navigation.state.params.token.frozen}</Utils.Text>
          <Utils.Text>price: {this.props.navigation.state.params.token.price}</Utils.Text>
          <Utils.Text>issued: {this.props.navigation.state.params.token.issued}</Utils.Text>
          <Utils.Text>percentage: {this.props.navigation.state.params.token.percentage}</Utils.Text>
          <Utils.VerticalSpacer />
          <Utils.FormInput
            keyboardType='numeric'
            placeholder='0'
            value={this.state.value}
            onChangeText={value => this.setState({ value })}
          />
          <Utils.Text>Value: {Number(this.state.value) * this.props.navigation.state.params.token.price} TRX</Utils.Text>
          <Utils.VerticalSpacer />
          {
            this.state.loading ? (
              <ActivityIndicator />
            ) : (
              <Utils.Button onPress={this._confirm}>Confirm</Utils.Button>
            )
          }
        </Utils.Content>
      </Utils.KeyboardAwareContainer>
    )
  }
}

export default ParticipateScene
