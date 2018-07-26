import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator
} from 'react-native'
import { Answers } from 'react-native-fabric'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import { StackActions, NavigationActions } from 'react-navigation'
import OneSignal from 'react-native-onesignal'
import Switch from 'react-native-switch-pro'

// Design
import * as Utils from '../../components/Utils'
import { Colors, Spacing } from '../../components/DesignSystem'
import NavigationHeader from '../../components/Navigation/Header'

// Utils
import fontelloConfig from '../../assets/icons/config.json'
import { withContext } from '../../store/context'
import { restartAllWalletData } from '../../utils/userAccountUtils'
import { getUserSecrets } from '../../utils/secretsUtils'
import Client from '../../services/client'

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
    loading: true,
    subscriptionStatus: null,
    changingSubscription: false
  }

  componentDidMount () {
    Answers.logContentView('Tab', 'Settings')
    this._onLoadData()
    OneSignal.getPermissionSubscriptionState(
      status => this.setState({ subscriptionStatus: status.userSubscriptionEnabled === 'true' })
    )
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
      `Warning: This action will erase all saved data including your 12 secret words. If you didn't save your secret, please do it before continue.`,
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

  _changeSubscription = () => {
    this.setState(
      ({ subscriptionStatus }) => ({ subscriptionStatus: !subscriptionStatus }),
      () => {
        OneSignal.setSubscription(this.state.subscriptionStatus)
        OneSignal.getPermissionSubscriptionState(
          status => console.log('subscriptions status', status)
        )
        if (this.state.subscriptionStatus) {
          Client.registerDeviceForNotifications(
            this.props.context.oneSignalId,
            this.props.context.publicKey.value
          )
        } else {
          // TODO: remove device from db
        }
      }
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
        title: 'Notifications Subscription',
        description: 'Enable or disable push notifications',
        icon: 'user,-person,-avtar,-profile-picture,-dp',
        right: () => {
          if ((this.state.subscriptionStatus === null) || this.state.changingSubscription) {
            return <ActivityIndicator size='small' color={Colors.primaryText} />
          }
          return (
            <Switch
              circleStyle={{ backgroundColor: Colors.orange }}
              backgroundActive={Colors.yellow}
              backgroundInactive={Colors.secondaryText}
              value={this.state.subscriptionStatus}
              onSyncPress={this._changeSubscription}
            />
          )
        }
      },
      {
        title: 'Network',
        description: 'Choose a node of your preference',
        icon: 'share,-network,-connect,-community,-media',
        onPress: () => this.props.navigation.navigate('NetworkConnection')
      },
      {
        title: 'Backup Wallet',
        description: 'Backup your secret words',
        icon: 'key,-password,-lock,-privacy,-login',
        onPress: () => this.props.navigation.navigate('Pin', {
          shouldGoBack: true,
          testInput: pin => pin === this.props.context.pin,
          onSuccess: () => this.props.navigation.navigate('SeedCreate', { seed })
        })
      },
      {
        title: 'Restore Wallet',
        description: 'Restore previously used 12 secrets words',
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
      const arrowIconName = 'arrow,-right,-right-arrow,-navigation-right,-arrows'
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
              {(!!item.onPress && !item.right) && (
                <Icon
                  name={arrowIconName}
                  size={15}
                  color={Colors.secondaryText}
                />
              )}
              {item.right && item.right()}
            </Utils.Row>
          </Utils.Item>
        </TouchableWithoutFeedback>
      )
    })
  }

  render () {
    return (
      <Utils.Container
        keyboardShouldPersistTaps='always'
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
