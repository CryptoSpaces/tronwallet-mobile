import React from 'react'
import styled from 'styled-components'
import { ScrollView, Alert } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'
import { Answers } from 'react-native-fabric'

import * as Utils from '../../components/Utils'
import { Spacing, Colors } from '../../components/DesignSystem'
import NavigationHeader from '../../components/Navigation/Header'
import ButtonGradient from '../../components/ButtonGradient'
import FadeIn from '../../components/Animations/FadeIn'

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
      .getParam('seed', []).join(' '),
    remainingWords: this.props.navigation
      .getParam('seed', [])
      .sort(() => 0.5 - Math.random()),
    selected: [],
    loading: false
  }

  _handleSubmit = async () => {
    const { context } = this.props
    this.setState({ loading: true })
    try {
      const selectedWords = this.state.selected.join(' ')
      if (this.state.seed !== selectedWords) throw new Error('Words dont match!')
      await confirmSecret(context.pin)
      Answers.logCustom('Wallet Operation', { type: 'Create' })
      await this._handleSuccess()
    } catch (error) {
      console.warn(error)
      Alert.alert(
        'Wrong Combination',
        'Selected words dont match. Make sure you wrote the words in the correct order.'
      )
      this.setState({ loading: false })
    }
  }

  _handleSuccess = async () => {
    const { navigation, context } = this.props
    try {
      const result = await WalletClient.giftUser(context.pin, context.oneSignalId)
      if (result) {
        const rewardsParams = {
          label: 'Wallet Successfully confirmed',
          amount: 100,
          token: 'TWX'
        }
        navigation.navigate('Rewards', rewardsParams)
      } else {
        throw new Error('User gifted or not registered')
      }
    } catch (error) {
      Alert.alert('Success', 'Wallet successfully confirmed.')
      this.setState({loading: false})
      navigation.dispatch(resetAction)
    }
  }

  _selectWord = (word, index) => {
    const { remainingWords, selected } = this.state
    remainingWords.splice(index, 1)
    this.setState({
      remainingWords,
      selected: [...selected, word]
    })
  }

  _deselectWord = (word, index) => {
    const { remainingWords, selected } = this.state
    selected.splice(index, 1)
    this.setState({
      remainingWords: [...remainingWords, word],
      selected
    })
  }

  render () {
    const { loading } = this.state
    return (
      <Utils.Container>
        <ScrollView>
          <Utils.Content align='center' justify='center'>
            <Utils.Text>
              Select the words below in the right order to confirm your secret
              phrase.
            </Utils.Text>
          </Utils.Content>
          <Utils.View height={1} backgroundColor={Colors.secondaryText} />
          <Utils.Content flex={1} background={Colors.darkerBackground}>
            <Utils.Row wrap='wrap' justify='center'>
              {this.state.selected.map((word, index) => (
                <FadeIn name={`${index}`} key={index}>
                  <WordWrapper
                    onPress={() => this._deselectWord(word, index)}
                  >
                    <Utils.Text>{word}</Utils.Text>
                  </WordWrapper>
                </FadeIn>
              ))}
            </Utils.Row>
            <Utils.View height={1} backgroundColor={Colors.secondaryText} marginY={16} />
            <Utils.Row wrap='wrap' justify='center'>
              {this.state.remainingWords.map((word, index) => (
                <FadeIn name={`${index}`} key={index}>
                  <WordWrapper
                    onPress={() => this._selectWord(word, index)}
                  >
                    <Utils.Text>{word}</Utils.Text>
                  </WordWrapper>
                </FadeIn>
              ))}
            </Utils.Row>
          </Utils.Content>
          <Utils.View height={1} backgroundColor={Colors.secondaryText} />
          <Utils.VerticalSpacer />
          <Utils.View align='center' paddingY='medium'>
            <ButtonGradient
              text='CONFIRM SEED'
              disabled={loading || this.state.selected.length < 12}
              onPress={this._handleSubmit}
            />
          </Utils.View>
        </ScrollView>
      </Utils.Container>
    )
  }
}

export default withContext(Confirm)
