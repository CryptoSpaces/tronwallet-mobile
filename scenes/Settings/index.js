import React, { Component } from 'react'
import { StyleSheet, Alert } from 'react-native'
import { Auth } from 'aws-amplify'
import { ListItem, Card } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'

import * as Utils from './../../components/Utils'
import { Colors, Spacing } from './../../components/DesignSystem'

class Settings extends Component {
  static navigationOptions = {
    title: 'Settings'
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
            this.props.navigation.navigate('Auth')
          },
          style: 'default'
        }
      ],
      { cancelable: true }
    )
  }

  renderList = () => {
    const list = [
      {
        title: 'Logout',
        icon: 'ios-log-out',
        onPress: this.showAlert
      }
    ]

    return list.map((item, i) => (
      <ListItem
        key={i}
        title={item.title}
        leftIcon={<Ionicons size={26} name={item.icon} color={Colors.primaryText} />}
        titleStyle={styles.listItemTitle}
        onPress={item.onPress}
      />
    ))
  }

  render () {
    return (
      <Utils.Container
        keyboardShouldPersistTaps={'always'}
        keyboardDismissMode='interactive'
      >
        <Utils.Content justify='center' align='center'>
          <Card containerStyle={styles.card} >
            {this.renderList()}
          </Card>
        </Utils.Content>
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
  }
})

export default Settings
