import React, { PureComponent } from 'react'
import { Dimensions, Clipboard } from 'react-native'
import Toast from 'react-native-easy-toast'
import { tint } from 'polished'
import Feather from 'react-native-vector-icons/Feather'
import { Answers } from 'react-native-fabric'

import NavigationHeader from '../../components/Navigation/Header'
import QRCode from '../../components/QRCode'
import * as Utils from '../../components/Utils'
import { Colors, FontSize } from '../../components/DesignSystem'
import KeyboardScreen from '../../components/KeyboardScreen'
import ShareButton from '../../components/Share/ShareButton'
import Share from '../../components/Share'

import { withContext } from '../../store/context'

class ReceiveScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <NavigationHeader title='RECEIVE'
          onBack={() => { navigation.goBack() }}
          rightButton={<ShareButton openShare={this._openShare} />}
        />
      )
    }
  }

  state = {
    loading: true,
    shareOpen: true
  }

  _openShare = () => {
    this.setState(state => ({
      shareOpen: !(state.shareOpen)
    }))
  }

  componentDidMount () {
    Answers.logContentView('Page', 'Receive')
  }

  _onLoad = () => {
    setTimeout(() => this.setState({ loading: false }), 1000)
  }

  _copy = async () => {
    try {
      await Clipboard.setString(this.props.context.publicKey.value)
      this.refs.toast.show('Public Key copied to the clipboard')
    } catch (error) {
      this.refs.toast.show('Something wrong while copying')
    }
  }

  render () {
    const { width } = Dimensions.get('window')
    const { context } = this.props
    const publicKey = context.publicKey.value

    return (
      <Utils.Container>
        <KeyboardScreen>
          <Utils.StatusBar />
          <Utils.Content marginY='20' align='center'>
            {!!publicKey && <QRCode value={publicKey} onLoad={this._onLoad} loading={this.state.loading} size={width * 0.6} />}
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
        <Share visible={context.shareModal} publicKey={publicKey} close={context.closeShare} />
      </Utils.Container>
    )
  }
}

export default withContext(ReceiveScreen)
