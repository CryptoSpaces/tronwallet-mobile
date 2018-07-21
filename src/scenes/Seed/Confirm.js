import React from 'react'
import styled from 'styled-components'
import { ScrollView, Alert } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'

import * as Utils from '../../components/Utils'
import { Spacing, Colors } from '../../components/DesignSystem'
import NavigationHeader from '../../components/Navigation/Header'
import ButtonGradient from '../../components/ButtonGradient'

import WalletClient from '../../services/client'
import { confirmSecret } from '../../utils/secretsUtils'
import { withContext } from '../../store/context'

const WordWrapper = styled.TouchableOpacity`
  padding-vertical: ${Spacing.small};
  padding-horizontal: ${Spacing.medium};
`

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'App' })],
  key: null
})

class Confirm extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <NavigationHeader
        title='CONFIRM SEED'
        onBack={() => navigation.goBack()}
      />
    )
  })

  state = {
    seed: this.props.navigation
      .getParam('seed', [])
      .map(item => ({ word: item, used: false }))
      .sort(() => 0.5 - Math.random()),
    selected: [],
    loading: false
  }

  _handleSubmit = async () => {
    const { navigation, context } = this.props
    this.setState({loading: true})
    try {
      const seed = navigation.getParam('seed', []).join(' ')
      const selectedWords = this.state.selected.join(' ')
      if (seed !== selectedWords) throw new Error('Words dont match!')
      await confirmSecret(context.pin)
      await this._handleSuccess()
    } catch (error) {
      console.warn(error)
      Alert.alert(
        'Wrong Combination',
        'Selected words dont match. Make sure you wrote the words in the correct order.'
      )
      this.setState({loading: false})
    }
  }

  _handleSuccess = async () => {
    const { navigation, context } = this.props
    try {
      const result = await WalletClient.giftUser(context.pin, context.onesignalId)
      if (result) {
        const rewardsParams = {
          label: 'Wallet Successfully confirmed',
          amount: 1,
          token: 'TWX'
        }
        navigation.navigate('Rewards', rewardsParams)
      } else {
        throw new Error('User gifted or Not registered')
      }
    } catch (error) {
      Alert.alert('Success', 'Wallet successfully confirmed.')
      this.setState({loading: false})
      navigation.dispatch(resetAction)
    }
  }

  _selectWord = item => {
    if (!this.state.selected.find(word => word === item.word)) {
      const seed = this.state.seed
      seed[seed.indexOf(item)].used = true
      this.setState({
        seed,
        selected: [...this.state.selected, item.word]
      })
    }
  }

  _deselectWord = item => {
    const seed = this.state.seed
    seed[seed.indexOf(seed.find(word => word.word === item))].used = false
    this.setState({
      seed,
      selected: this.state.selected.filter(word => word !== item)
    })
  }

  render () {
    const { loading } = this.state
    return (
      <Utils.Container>
        <ScrollView>
          <Utils.View flex={1} />
          <Utils.Content align='center' justify='center'>
            <Utils.Text>
              Select the words below in the right order to confirm your secret
              phrase.
            </Utils.Text>
          </Utils.Content>
          <Utils.View flex={1} />
          <Utils.Content background={Colors.darkerBackground}>
            <Utils.Row wrap='wrap' justify='center'>
              {this.state.selected.map(item => (
                <WordWrapper
                  key={item}
                  onPress={() => this._deselectWord(item)}
                >
                  <Utils.Text>{item}</Utils.Text>
                </WordWrapper>
              ))}
            </Utils.Row>
          </Utils.Content>
          <Utils.View flex={1} />
          <Utils.Content background={Colors.darkerBackground}>
            <Utils.Row wrap='wrap' justify='center'>
              {this.state.seed.map(item => (
                <WordWrapper
                  key={item.word}
                  onPress={() => this._selectWord(item)}
                  disabled={item.used}
                >
                  <Utils.Text secondary={item.used}>{item.word}</Utils.Text>
                </WordWrapper>
              ))}
            </Utils.Row>
          </Utils.Content>
          <Utils.VerticalSpacer />
          <Utils.View align='center' paddingY='medium'>
            <ButtonGradient
              text='CONFIRM SEED'
              disabled={loading}
              onPress={this._handleSubmit}
            />
          </Utils.View>
        </ScrollView>
      </Utils.Container>
    )
  }
}

export default withContext(Confirm)
