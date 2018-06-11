import React, { PureComponent } from 'react'
import { Dimensions, Clipboard, ScrollView } from 'react-native'
import Toast from 'react-native-easy-toast'
import { tint } from 'polished'
import { Feather } from '@expo/vector-icons'

import QRCode from '../../components/QRCode'
import Client from '../../services/client'
import LoadingScene from '../../components/LoadingScene'
import * as Utils from '../../components/Utils'
import { Colors, FontSize } from '../../components/DesignSystem'

class ReceiveScreen extends PureComponent {
  state = {
    accountSelected: null,
    publicKey: null,
    loading: true
  }

  componentDidMount () {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this._loadPublicKey()
    })
  }

  componentWillUnmount () {
    this._navListener.remove()
  }

  _copy = async () => {
    const { publicKey } = this.state
    try {
      await Clipboard.setString(publicKey)
      this.refs.toast.show('Public Key copied to the clipboard')
    } catch (error) {
      this.refs.toast.show('Something wrong while copying')
    }
  }

  _loadPublicKey = async () => {
    this.setState({ loading: true })
    const publicKey = await Client.getPublicKey()
    this.setState({ publicKey, loading: false })
  }

  render () {
    const { width } = Dimensions.get('window')
    const { publicKey, loading } = this.state

    if (loading) return <LoadingScene />

    return (
      <ScrollView>
        <Utils.Container>
          <Utils.StatusBar />
          <Utils.Content align='center'>
            {!!publicKey && <QRCode value={publicKey} size={width * 0.6} />}
            <Utils.VerticalSpacer size='large' />

            <Utils.Label color={tint(0.9, Colors.background)}>
              <Utils.Text size='xsmall'>{publicKey}</Utils.Text>
            </Utils.Label>
            <Utils.VerticalSpacer size='medium' />

            <Utils.PasteButton onPress={this._copy}>
              <Feather
                name='clipboard'
                size={FontSize['small']}
                color={Colors.primaryText}
              />
            </Utils.PasteButton>
            <Toast
              ref='toast'
              position='center'
              fadeInDuration={750}
              fadeOutDuration={1000}
              opacity={0.8}
            />
          </Utils.Content>
        </Utils.Container>
      </ScrollView>
    )
  }
}

export default ReceiveScreen
