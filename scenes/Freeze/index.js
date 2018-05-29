import React, { Component } from 'react'
import { ActivityIndicator, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import qs from 'qs'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'
import Client from '../../src/services/client'
import Header from '../../components/Header'
import PasteInput from '../../components/PasteInput'
import Card from './../../components/Card'
import { Select, Option } from 'react-native-chooser'

class ReceiveScene extends Component {
  state = {
    from: '',
    balances: [],
    trxBalance: 25000
  }

  componentDidMount () {
    this.loadData()
  }

  loadData = async () => {
    try {
      const result = await Promise.all([Client.getPublicKey(), Client.getBalances()])
      const { balance } = result[1].find(b => b.name === 'TRX')
      this.setState({
        from: result[0],
        balances: result[1],
        trxBalance: balance
      })
    } catch (error) {
      Alert.alert('Error while loading data')
      // TODO - Error handler
      this.setState({
        loadingData: false
      })
    }
  }

  render () {
    const {
      trxBalance
    } = this.state

    return (
      <Utils.Container>
        <Utils.StatusBar />
        <Header>
          <Utils.View align='center'>
            <Utils.Text size='xsmall' secondary>Freeze</Utils.Text>
            <Utils.Text size='medium'>{trxBalance.toFixed(2)} TRX</Utils.Text>
          </Utils.View>
        </Header>
        <Utils.Content style={{ backgroundColor: 'transparent', backgroundColor: 'transparent' }}>
          <Card isEditable buttonLabel="Freeze" />

          <Card buttonLabel="Unfreeze (0)" />
        </Utils.Content>
      </Utils.Container >
    )
  }
}

export default ReceiveScene
