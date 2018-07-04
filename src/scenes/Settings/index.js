import React, { Component } from 'react'
import {
  StyleSheet,
  Alert,
  View,
  TouchableWithoutFeedback,
  SafeAreaView
} from 'react-native'
import { Auth } from 'aws-amplify'
import { StackActions, NavigationActions } from 'react-navigation'
import { createIconSetFromFontello } from 'react-native-vector-icons'

import * as Utils from '../../components/Utils'
import { Colors, Spacing } from '../../components/DesignSystem'
import ChangeNodeModal from './ChangeNodeModal'
import LoadingScene from '../../components/LoadingScene'

import { getUserSecrets } from '../../utils/secretsUtils'
import fontelloConfig from '../../assets/icons/config.json'

const Icon = createIconSetFromFontello(fontelloConfig, 'tronwallet')

class Settings extends Component {
  static navigationOptions = () => {
    return {
      header: (
        <SafeAreaView style={{ backgroundColor: 'black' }}>
          <Utils.Header>
            <Utils.TitleWrapper>
              <Utils.Title>Settings</Utils.Title>
            </Utils.TitleWrapper>
          </Utils.Header>
        </SafeAreaView>
      )
    }
  }

  state = {
    nodeModalVisible: false,
    address: null,
    seed: null,
    loading: true
  }

  componentDidMount() {
    this.onLoadData()
  }

  onLoadData = async () => {
    const data = await getUserSecrets()
    const address = data.address
    const seed = data.mnemonic
    this.setState({ address, seed, loading: false })
  }

  showAlert = () => {
    Alert.alert(
      'Logout',
      'Do you want to log out of your wallet ?',
      [{
        text: 'Cancel',
        style: 'cancel'
      }, {
        text: 'Yes',
        onPress: async () => {
          await Auth.signOut()
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Auth' })],
            key: null
          })
          this.props.navigation.dispatch(resetAction)
        },
        style: 'default'
      }],
      { cancelable: true }
    )
  }

  renderLogout = () => {
    const arrowIcon = 'arrow,-right,-right-arrow,-navigation-right,-arrows'
    const logout = {
      title: 'Logout',
      description: 'Exit application',
      icon: 'log-out,-exit,-out,-arrow,-sign-out',
      onPress: this.showAlert
    }
    return (
      <TouchableWithoutFeedback onPress={logout.onPress}>
        <Utils.Item padding={16} top={0.2}>
          <Utils.Row justify='space-between' align='center'>
            <Utils.Row justify='space-between' align='center'>
              <View style={styles.rank}>
                <Icon
                  name={logout.icon}
                  size={22}
                  color={Colors.secondaryText}
                />
              </View>
              <Utils.View>
                <Utils.Text lineHeight={20} size='small'>
                  {logout.title}
                </Utils.Text>
                <Utils.Text lineHeight={20} size='xsmall' secondary>
                  {logout.description}
                </Utils.Text>
              </Utils.View>
            </Utils.Row>
            <Utils.Row align='center' justify='space-between'>
              <Icon name={arrowIcon} size={15} color={Colors.secondaryText} />
            </Utils.Row>
          </Utils.Row>
        </Utils.Item>
      </TouchableWithoutFeedback>
    )
  }

  renderList = () => {
    const { address, seed } = this.state
    const shortAddress = address ? `${address.slice(0, 10)}...${address.substr(address.length - 10)}`
      : 'Loading Account ...'
    const list = [
      {
        title: shortAddress,
        description: 'Current Account',
        icon: 'user,-person,-avtar,-profile-picture,-dp'
      },
      {
        title: 'Edit Nodes',
        description: 'Choose a node of your preference',
        icon: 'key,-password,-lock,-privacy,-login',
        onPress: () => this.setState({ nodeModalVisible: true })
      },
      {
        title: 'Confirm Seed',
        description: 'Confirm the seed password for your account',
        icon: 'key,-password,-lock,-privacy,-login',
        onPress: () => this.props.navigation.navigate('SeedCreate', { seed })
      },
      {
        title: 'Restore Seed',
        description: 'Restore previously used seed words',
        icon: 'key,-password,-lock,-privacy,-login',
        onPress: () => this.props.navigation.navigate('SeedRestore')
      }
    ]

    return list.map(item => {
      const arrowIcon = 'arrow,-right,-right-arrow,-navigation-right,-arrows'
      return (
        <TouchableWithoutFeedback onPress={item.onPress} key={item.title}>
          <Utils.Item padding={16}>
            <Utils.Row justify='space-between' align='center'>
              <Utils.Row justify='space-between' align='center'>
                <View style={styles.rank}>
                  <Icon
                    name={item.icon}
                    size={22}
                    color={Colors.secondaryText}
                  />
                </View>
                <Utils.View>
                  <Utils.Text lineHeight={20} size='small'>
                    {item.title}
                  </Utils.Text>
                  <Utils.Text lineHeight={20} size='xsmall' secondary>
                    {item.description}
                  </Utils.Text>
                </Utils.View>
              </Utils.Row>
              {!!item.onPress && (
                <Utils.Row align='center' justify='space-between'>
                  <Icon
                    name={arrowIcon}
                    size={15}
                    color={Colors.secondaryText}
                  />
                </Utils.Row>
              )}
            </Utils.Row>
          </Utils.Item>
        </TouchableWithoutFeedback>
      )
    })
  }

  render() {
    const { nodeModalVisible } = this.state

    return (
      <Utils.Container
        keyboardShouldPersistTaps={'always'}
        keyboardDismissMode='interactive'
      >
        {this.renderList()}
        <Utils.VerticalSpacer size='big' />
        {this.renderLogout()}
        <ChangeNodeModal
          visible={nodeModalVisible}
          onClose={() => this.setState({ nodeModalVisible: false })}
          onLoadData={this.onLoadData}
        />
      </Utils.Container>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 8,
    margin: Spacing.medium,
    backgroundColor: Colors.darkerBackground,
    borderColor: Colors.darkerBackground
  },
  listItemTitle: {
    paddingLeft: 20,
    color: Colors.primaryText
  },
  rank: {
    paddingRight: 10
  }
})

export default Settings
