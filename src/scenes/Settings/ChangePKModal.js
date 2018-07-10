import React, { PureComponent } from 'react'
import { Modal, View } from 'react-native'
import * as Utils from '../../components/Utils'
import Header from '../../components/Header'
import { Colors } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'
import { isAddressValid } from '../../services/address'
import Client from '../../services/client'

import { createIconSetFromFontello } from 'react-native-vector-icons'
import fontelloConfig from '../../assets/icons/config.json'
import PasteInput from '../../components/PasteInput'

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
    const { errorMessage, newPk } = this.state
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
            <Utils.Text size='xsmall' secondary>
              NEW PUBLIC KEY
            </Utils.Text>
            <PasteInput
              value={newPk}
              field='from'
              onChangeText={text =>
                this.setState({ newPk: text, errorMessage: null })
              }
            />
            <ButtonGradient text='OK' onPress={this.setUser} size='medium' />
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
