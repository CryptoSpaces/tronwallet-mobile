import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Alert
} from 'react-native'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import { StackActions, NavigationActions } from 'react-navigation'

// Design
import * as Utils from '../../components/Utils'
import { Colors, Spacing } from '../../components/DesignSystem'
import NavigationHeader from '../../components/Navigation/Header'
import { getUserSecrets } from '../../utils/secretsUtils'

// Utils
import fontelloConfig from '../../assets/icons/config.json'
import { withContext } from '../../store/context'
import { restartAllWalletData } from '../../utils/userAccountUtils'

const Icon = createIconSetFromFontello(fontelloConfig, 'tronwallet')
const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Loading' })],
  key: null
})

class Settings extends Component {
  static navigationOptions = () => {
    return {
      header: <NavigationHeader title='SETTINGS' />
    }
  }

  state = {
    address: null,
    seed: null,
    loading: true
  }

  componentDidMount () {
    this._onLoadData()
  }

  _onLoadData = async () => {
    const data = await getUserSecrets(this.props.context.pin)
    const address = data.address
    const seed = data.mnemonic
    this.setState({ address, seed, loading: false })
  }

  _resetWallet = async () => {
    Alert.alert(
      'Reset Wallet',
      `Warning: This action will erase all saved data including your seed. If you didn't save your seed, please do it before continue.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK, I understand it',
          onPress: () => this.props.navigation.navigate('Pin', {
            shouldGoBack: true,
            testInput: pin => pin === this.props.context.pin,
            onSuccess: async () => {
              await restartAllWalletData()
              this.props.navigation.dispatch(resetAction)
            }
          })}
      ],
      { cancelable: false }
    )
  }

  _renderList = () => {
    const { address, seed } = this.state
    const shortAddress = address
      ? `${address.slice(0, 10)}...${address.substr(address.length - 10)}`
      : 'Loading Account ...'
    const list = [
      {
        title: shortAddress,
        description: 'Current Account',
        icon: 'user,-person,-avtar,-profile-picture,-dp'
      },
      {
        title: 'Edit Node Network',
        description: 'Choose a node of your preference',
        icon: 'share,-network,-connect,-community,-media',
        onPress: () => this.props.navigation.navigate('Pin', {
          shouldGoBack: true,
          testInput: pin => pin === this.props.context.pin,
          onSuccess: () => this.props.navigation.navigate('NetworkConnection')
        })
      },
      {
        title: 'Confirm Seed',
        description: 'Confirm the seed password for your account',
        icon: 'key,-password,-lock,-privacy,-login',
        onPress: () => this.props.navigation.navigate('Pin', {
          shouldGoBack: true,
          testInput: pin => pin === this.props.context.pin,
          onSuccess: () => this.props.navigation.navigate('SeedCreate', { seed })
        })
      },
      {
        title: 'Restore Seed',
        description: 'Restore previously used seed words',
        icon: 'folder-sync,-data,-folder,-recovery,-sync',
        onPress: () => this.props.navigation.navigate('Pin', {
          shouldGoBack: true,
          testInput: pin => pin === this.props.context.pin,
          onSuccess: () => this.props.navigation.navigate('SeedRestore')
        })
      },
      {
        title: 'Reset Wallet',
        description: 'Restart all data from current wallet',
        icon: 'delete,-trash,-dust-bin,-remove,-recycle-bin',
        onPress: this._resetWallet
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

  render () {
    return (
      <Utils.Container
        keyboardShouldPersistTaps={'always'}
        keyboardDismissMode='interactive'
      >
        {this._renderList()}
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

export default withContext(Settings)
