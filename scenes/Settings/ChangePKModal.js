import React, { PureComponent} from 'react'
import { Modal, View } from 'react-native'
import * as Utils from './../../components/Utils'
import Header from '../../components/Header'
import { Colors } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'
import { isAddressValid } from '../../src/services/address'
import Client from '../../src/services/client'

import { createIconSetFromFontello } from '@expo/vector-icons'
import fontelloConfig from '../../assets/icons/config.json'

const Icon = createIconSetFromFontello(fontelloConfig, 'tronwallet')

class ChangePKModal extends PureComponent {
  state = {
    newPk: '',
    errorMessage: ''
  }

  setUser = async () => {
    const { newPk } = this.state
    const { onLoadData } = this.props
    try {
      if (isAddressValid(newPk)) {
        await Client.setUserPk(newPk)
        onLoadData()
        this.closeModal()
      } else {
        this.setState({ errorMessage: 'Type a valid public key' })
      }
    } catch (error) {
      this.setState({ errorMessage: 'Type a valid public key' })
    }
  }

  closeModal = () => {
    const { onClose } = this.props
    this.setState({
      newPk: '',
      errorMessage: ''
    })
    onClose()
  }

  render () {
    const { visible } = this.props
    const { errorMessage } = this.state
    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={visible}
        onRequestClose={() => {}}
      >
        <Utils.Container
          keyboardShouldPersistTaps={'always'}
          keyboardDismissMode='interactive'
        >
          <Utils.StatusBar transparent />
          <Header
            leftIcon={<View />}
            onRightPress={this.closeModal}
            rightIcon={
              <Icon
                name='stop,-disabled,-not-allowed,-close,-exit'
                size={26}
                color={Colors.primaryText}
              />
            }
          />
          <Utils.FormGroup>
            <Utils.Text size='xsmall' secondary>NEW PUBLIC KEY</Utils.Text>
            <Utils.FormInput
              innerRef={ref => { this.newPk = ref }}
              underlineColorAndroid='transparent'
              marginBottom={40}
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={(v) => this.setState({ newPk: v })}
              onSubmitEditing={this.setUser}
              returnKeyType='send'
            />
            <ButtonGradient text='OK' onPress={this.setUser} size='small' />
          </Utils.FormGroup>
          <Utils.Content justify='center' align='center'>
            <Utils.Error>{errorMessage}</Utils.Error>
          </Utils.Content>
        </Utils.Container>
      </Modal>
    )
  }
}

export default ChangePKModal
