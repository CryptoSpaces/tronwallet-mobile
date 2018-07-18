import React, { PureComponent } from 'react'
import { Dimensions, Clipboard } from 'react-native'
import Toast from 'react-native-easy-toast'
import { tint } from 'polished'
import Feather from 'react-native-vector-icons/Feather'

import NavigationHeader from '../../components/Navigation/Header'
import QRCode from '../../components/QRCode'
import * as Utils from '../../components/Utils'
import { Colors, FontSize } from '../../components/DesignSystem'
import { getUserPublicKey } from '../../utils/userAccountUtils'
import KeyboardScreen from '../../components/KeyboardScreen'

class ReceiveScreen extends PureComponent {
  static navigationOptions = () => {
    return {
      header: <NavigationHeader title='RECEIVE' />
    }
  }

  state = {
    accountSelected: null,
    publicKey: null,
    loading: true
  }

  componentDidMount () {
    this._navListener = this.props.navigation.addListener(
      'didFocus',
      this._loadPublicKey
    )
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
    const publicKey = await getUserPublicKey()
    this.setState({ publicKey, loading: false })
  }

  render () {
    const { width } = Dimensions.get('window')
    const { publicKey } = this.state

    return (
      <Utils.Container>
        <KeyboardScreen>
          <Utils.StatusBar />
          <Utils.Content marginY='20' align='center'>
            {!!publicKey && <QRCode value={publicKey} size={width * 0.6} />}
            <Utils.VerticalSpacer size='large' />

            <Utils.Label color={tint(0.9, Colors.background)}>
              <Utils.Text size='xsmall'>{publicKey}</Utils.Text>
            </Utils.Label>
            <Utils.VerticalSpacer size='medium' />

            <Utils.PasteButton onPress={this._copy}>
              <Utils.Text>
                <Feather
                  name='clipboard'
                  size={FontSize['small']}
                  color={Colors.primaryText}
                />

                {` Copy My Address`}
              </Utils.Text>
            </Utils.PasteButton>
            <Toast
              ref='toast'
              position='center'
              fadeInDuration={750}
              fadeOutDuration={1000}
              opacity={0.8}
            />
          </Utils.Content>
        </KeyboardScreen>
      </Utils.Container>
    )
  }
}

export default ReceiveScreen
