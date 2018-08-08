import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Alert } from 'react-native'
import Switch from 'react-native-switch-pro'

// Design
import tl from '../../utils/i18n'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'
import NavigationHeader from '../../components/Navigation/Header'

// Services
import NodesIp from '../../utils/nodeIp'
import { resetWalletData, resetListsData } from '../../utils/userAccountUtils'

class ChangeNetworkModal extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <NavigationHeader
          title={tl.t('settings.network.modal.title')}
          onBack={() => navigation.goBack()}
        />
      )
    }
  }

  state = {
    switchTestnet: false,
    mainNode: null,
    mainNodePort: null,
    solidityNode: null,
    solidityNodePort: null,
    loading: false,
    error: false
  }

  componentDidMount () {
    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      this._loadData
    )
  }

  componentWillUnmount () {
    this.didFocusSubscription.remove()
  }

  _loadData = async () => {
    try {
      const { nodeIp, nodeSolidityIp, isTestnet } = await NodesIp.getAllNodesIp()
      const [mainNode, mainNodePort] = nodeIp.split(':')
      const [solidityNode, solidityNodePort] = nodeSolidityIp.split(':')
      this.setState({ mainNode,
        mainNodePort,
        solidityNode,
        solidityNodePort,
        switchTestnet: isTestnet
      })
    } catch (error) {
      console.warn(error.message)
      this.setState({
        error: tl.t('settings.network.modal.error.storage')
      })
    }
  }

  testIpValidity = ip => /^\d{1,3}(\.\d{1,3}){3}:\d{1,5}$/.test(ip)

  _submit = type => {
    const {
      mainNode,
      mainNodePort,
      solidityNode,
      solidityNodePort
    } = this.state

    const ipToSubmit =
      type === 'solidity'
        ? `${solidityNode}:${solidityNodePort}`
        : `${mainNode}:${mainNodePort}`

    this.setState({ loading: true })

    if (!this.testIpValidity(ipToSubmit)) {
      this.setState({ loading: false, error: tl.t('settings.network.modal.error.invalidIp') })
      return
    }
    this._updateNodes(type, ipToSubmit)
  }

  _updateNodes = async (type, nodeip) => {
    try {
      await NodesIp.setNodeIp(type, nodeip)
      Alert.alert(tl.t('settings.network.modal.success.updated'), tl.t('settings.network.modal.success.updatedIp'))
      this.setState({ loading: false, error: null })
    } catch (error) {
      this.setState({
        loading: false,
        error: tl.t('settings.network.modal.error.update')
      })
    }
  }

  _switchTestnet = async (switchValue) => {
    this.setState({ error: null })
    try {
      await NodesIp.switchTestnet(switchValue)
      this.setState({ switchTestnet: switchValue })
      this._loadData()
      const alertMessage = switchValue ? tl.t('settings.network.modal.success.switchTest') : tl.t('settings.network.modal.success.switchMain')
      Alert.alert(tl.t('settings.network.modal.success.updated'), alertMessage)
      await Promise.all([resetWalletData(), resetListsData()])
    } catch (error) {
      this.setState({
        loading: false,
        error: tl.t('settings.network.modal.error.update')
      })
    }
  }

  _reset = async type => {
    try {
      await NodesIp.resetNodesIp(type)
      this._loadData()
      Alert.alert(tl.t('settings.network.modal.success.reset'))
      this.setState({ loading: false, error: null })
    } catch (error) {
      this.setState({
        loading: false,
        error: tl.t('settings.network.modal.error.reset')
      })
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

  render () {
    const {
      error,
      mainNode,
      mainNodePort,
      solidityNode,
      solidityNodePort,
      switchTestnet
    } = this.state

    return (
      <Utils.Container
        keyboardShouldPersistTaps={'always'}
        keyboardDismissMode='interactive'
      >
        <ScrollView>
          <Utils.StatusBar transparent />
          <View style={styles.card}>
            <Utils.Text size='xsmall' secondary>
              {tl.t('settings.network.modal.mainNode')}
            </Utils.Text>
            <Utils.Row justify='space-between'>
              <Utils.FormInput
                defaultValue={mainNode}
                keyboardType='numeric'
                placeholder={tl.t('settings.network.modal.placeholder.loadingIp')}
                editable={!switchTestnet}
                style={styles.buttonUpdate}
                onChangeText={text => this.changeInput(text, 'mainNode')}
                underlineColorAndroid='transparent'
              />
              <Utils.FormInput
                defaultValue={mainNodePort}
                keyboardType='numeric'
                placeholder={tl.t('settings.network.modal.placeholder.loadingPort')}
                editable={!switchTestnet}
                style={styles.buttonReset}
                onChangeText={text => this.changeInput(text, 'mainNodePort')}
                underlineColorAndroid='transparent'
              />
            </Utils.Row>
            <Utils.Row justify='space-between'>
              <View style={styles.buttonUpdate}>
                <ButtonGradient
                  text={tl.t('settings.network.modal.button.update')}
                  onPress={() => this._submit('main')}
                  disabled={switchTestnet}
                  size='small'
                />
              </View>
              <View style={styles.buttonReset}>
                <ButtonGradient
                  text={tl.t('settings.network.modal.button.reset')}
                  onPress={() => this._reset('main')}
                  disabled={switchTestnet}
                  size='small'
                />
              </View>
            </Utils.Row>
          </View>
          <Utils.VerticalSpacer size='medium' />
          <View style={styles.card}>
            <Utils.Text size='xsmall' secondary>
              {tl.t('settings.network.modal.solidityNode')}
            </Utils.Text>
            <Utils.Row justify='space-between'>
              <Utils.FormInput
                defaultValue={solidityNode}
                keyboardType='numeric'
                placeholder={tl.t('settings.network.modal.placeholder.loadingIp')}
                editable={!switchTestnet}
                style={styles.buttonUpdate}
                onChangeText={text => this.changeInput(text, 'solidityNode')}
                underlineColorAndroid='transparent'
              />
              <Utils.FormInput
                defaultValue={solidityNodePort}
                keyboardType='numeric'
                placeholder={tl.t('settings.network.modal.placeholder.loadingPort')}
                style={styles.buttonReset}
                editable={!switchTestnet}
                onChangeText={text =>
                  this.changeInput(text, 'solidityNodePort')
                }
                underlineColorAndroid='transparent'
              />
            </Utils.Row>
            <Utils.Row justify='space-between'>
              <View style={styles.buttonUpdate}>
                <ButtonGradient
                  text={tl.t('settings.network.modal.button.update')}
                  onPress={() => this._submit('solidity')}
                  disabled={switchTestnet}
                  size='small'
                />
              </View>
              <View style={styles.buttonReset}>
                <ButtonGradient
                  text={tl.t('settings.network.modal.button.reset')}
                  onPress={() => this._reset('solidity')}
                  disabled={switchTestnet}
                  size='small'
                />
              </View>
            </Utils.Row>
          </View>
          <Utils.VerticalSpacer size='medium' />
          <View style={styles.card}>
            <Utils.Row justify='space-between' align='center'>
              <Utils.Text size='smaller' color={Colors.secondaryText}>{tl.t('settings.network.modal.testNet')}</Utils.Text>
              <Switch
                circleStyle={{ backgroundColor: Colors.orange }}
                backgroundActive={Colors.yellow}
                backgroundInactive={Colors.secondaryText}
                value={switchTestnet}
                onSyncPress={this._switchTestnet} />
            </Utils.Row>
          </View>
          {error && <Utils.Error>{error}</Utils.Error>}
          <Utils.Content justify='center' align='center'>
            <Utils.Text color='#ffffff' font='light' size='xsmall'>
              {tl.t('settings.network.modal.explanation')}
            </Utils.Text>
          </Utils.Content>
        </ScrollView>
      </Utils.Container>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    width: '90%',
    borderRadius: 8,
    alignSelf: 'center',
    backgroundColor: Colors.darkerBackground,
    borderColor: Colors.darkerBackground,
    padding: 20
  },
  buttonUpdate: {
    width: '70%'
  },
  buttonReset: {
    width: '28%'
  }
})

export default ChangeNetworkModal
