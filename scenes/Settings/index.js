import React, { Component } from 'react'
import { StyleSheet, Alert, View, TouchableWithoutFeedback } from 'react-native'
import { Auth } from 'aws-amplify'
import { StackActions, NavigationActions } from 'react-navigation'

import * as Utils from './../../components/Utils'
import { Colors, Spacing } from './../../components/DesignSystem'
import Client from '../../src/services/client'
import LoadingScene from '../../components/LoadingScene'
import ChangePKModal from './ChangePKModal'

import { createIconSetFromFontello } from '@expo/vector-icons'
import fontelloConfig from '../../assets/icons/config.json'

const Icon = createIconSetFromFontello(fontelloConfig, 'tronwallet')

class Settings extends Component {
  static navigationOptions = {
    title: 'Settings'
  }

  state = {
    currentUser: null,
    loading: true,
    changePKVisible: false
  }

  componentDidMount () {
    this.onLoadData()
  }

  onLoadData = async () => {
    const data = await Promise.all([Client.getPublicKey()])
    const currentUser = data[0]
    this.setState({ currentUser, loading: false })
  }

  showAlert = () => {
    Alert.alert('Logout', 'Logout',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
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
        }
      ],
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
        <Utils.Item padding={16} top>
          <Utils.Row justify='space-between' align='center'>
            <Utils.Row justify='space-between' align='center'>
              <View style={styles.rank}>
                <Icon name={logout.icon} size={22} color={Colors.secondaryText} />
              </View>
              <Utils.View>
                <Utils.Text lineHeight={20} size='small'>{logout.title}</Utils.Text>
                <Utils.Text lineHeight={20} size='xsmall' secondary>{logout.description}</Utils.Text>
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
    const { currentUser } = this.state
    let address = `${currentUser.slice(0, 10)}...${currentUser.substr(currentUser.length - 10)}`
    const list = [
      {
        title: address,
        description: 'Current account',
        icon: 'user,-person,-avtar,-profile-picture,-dp'
      },
      {
        title: 'Update',
        description: 'Change private key',
        icon: 'key,-password,-lock,-privacy,-login',
        onPress: () => this.setState({ changePKVisible: true })
      }
    ]

    return list.map((item, i) => {
      const arrowIcon = 'arrow,-right,-right-arrow,-navigation-right,-arrows'
      return (
        <TouchableWithoutFeedback
          onPress={item.onPress}
          key={i}
        >
          <Utils.Item padding={16}>
            <Utils.Row justify='space-between' align='center'>
              <Utils.Row justify='space-between' align='center'>
                <View style={styles.rank}>
                  <Icon name={item.icon} size={22} color={Colors.secondaryText} />
                </View>
                <Utils.View>
                  <Utils.Text lineHeight={20} size='small'>{item.title}</Utils.Text>
                  <Utils.Text lineHeight={20} size='xsmall' secondary>{item.description}</Utils.Text>
                </Utils.View>
              </Utils.Row>
              {
                item.onPress
                  ? <Utils.Row align='center' justify='space-between'>
                    <Icon name={arrowIcon} size={15} color={Colors.secondaryText} />
                  </Utils.Row>
                  : null
              }
            </Utils.Row>
          </Utils.Item>
        </TouchableWithoutFeedback>
      )
    })
  }

  render () {
    const { loading, changePKVisible } = this.state
    if (loading) return <LoadingScene />

    return (
      <Utils.Container
        keyboardShouldPersistTaps={'always'}
        keyboardDismissMode='interactive'
      >
        {this.renderList()}
        <Utils.VerticalSpacer size='big' />
        {this.renderLogout()}
        <ChangePKModal
          visible={changePKVisible}
          onClose={() => this.setState({ changePKVisible: false })}
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
