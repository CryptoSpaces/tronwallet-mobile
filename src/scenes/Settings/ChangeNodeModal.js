import React, { PureComponent } from 'react'
import { Modal, View, ActivityIndicator } from 'react-native'
import { createIconSetFromFontello } from 'react-native-vector-icons'

//Design
import * as Utils from '../../components/Utils'
import Header from '../../components/Header'
import { Colors } from '../../components/DesignSystem'
import fontelloConfig from '../../assets/icons/config.json'
import ButtonGradient from '../../components/ButtonGradient'

//Services
import NodesIp from '../../utils/nodeIp'

const Icon = createIconSetFromFontello(fontelloConfig, 'tronwallet')

class ChangePKModal extends PureComponent {
  state = {
    mainNode: null,
    solidityNode: null,
    loading: false,
    error: false,
  }


  _loadData = async () => {
    try {
      const { nodeIp, nodeSolidityIp } = await NodesIp.getAllNodesIp()
      this.setState({ mainNode: nodeIp, solidityNode: nodeSolidityIp })
    } catch (error) {
      console.warn(error.message)
      this.setState({ mainNode: NodesIp.nodeIp, solidityNode: NodesIp.nodeSolidityIp })
    }
  }

  _submit = () => {
    const { mainNode, solidityNode } = this.state;
    const ipPattern = /^\d{1,3}(\.\d{1,3}){3}:\d{1,5}$/

    this.setState({ loading: true });

    if (!ipPattern.test(mainNode) || !ipPattern.test(solidityNode)) {
      this.setState({ loading: false, error: 'Please put a valid IP on both fields' })
      return
    }
    this._updateNodes();
  }

  _updateNodes = async () => {
    const { mainNode, solidityNode } = this.state;
    try {
      await NodesIp.setAllNodesIp(mainNode, solidityNode)
      this.setState({ loading: false, error: null })
    } catch (error) {
      this.setState({ loading: false, error: 'Something wrong while updating nodes ip' })
    }
  }

  changeInput = (text, field) => {
    this.setState({
      [field]: text,
      error: null
    })
  }

  closeModal = () => {
    const { onClose } = this.props
    this.setState({
      mainNode: null,
      solidityNode: null,
      error: null
    })
    onClose()
  }

  render() {
    const { visible } = this.props
    const { error, mainNode, solidityNode, loading } = this.state
    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={visible}
        onRequestClose={() => { }}
        onShow={this._loadData.bind(this)}
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
          <Utils.Content justify='center'>
            <Utils.Text size='xsmall' secondary>
              Main Node
            </Utils.Text>
            <Utils.FormInput
              defaultValue={mainNode}
              keyboardType='numeric'
              onChangeText={text => this.changeInput(text, 'mainNode')}
              underlineColorAndroid='transparent'
            />
            <Utils.Text size='xsmall' secondary>
              Solidity Node
            </Utils.Text>
            <Utils.FormInput
              defaultValue={solidityNode}
              keyboardType='numeric'
              onChangeText={text => this.changeInput(text, 'solidityNode')}
              underlineColorAndroid='transparent'
            />
            {loading ? <ActivityIndicator color="#ffffff" size="small" /> :
              <ButtonGradient
                text='Update Nodes Ip'
                onPress={this._submit}
                size='small' />}
          </Utils.Content>
          {error && <Utils.Error>{error}</Utils.Error>}
          <Utils.Content justify='center' align='center'>
            <Utils.Text color="#ffffff" font="light" size="small">
              With this option you can select the node that will better suit
              your needs and preferences. Please be careful while updating
              the node ip while wrong ips can lead to malfunctions within
              your wallet
            </Utils.Text>
          </Utils.Content>
        </Utils.Container>
      </Modal >
    )
  }
}

export default ChangePKModal
