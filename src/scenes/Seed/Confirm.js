import React, { Fragment } from 'react'
import styled from 'styled-components'
import { StackActions, NavigationActions } from 'react-navigation'
import { ScrollView } from 'react-native'

import * as Utils from '../../components/Utils'
import { Spacing, Colors } from '../../components/DesignSystem'
import ButtonGradient from '../../components/ButtonGradient'

import { confirmSecret } from '../../utils/secretsUtils'

const WordWrapper = styled.TouchableOpacity`
  padding-vertical: ${Spacing.small};
  padding-horizontal: ${Spacing.medium};
`

class Confirm extends React.Component {
  static navigationOptions = () => ({
    header: null
  })

  state = {
    seed:
      this.props.navigation.getParam('seed', [])
        .map(item => ({ word: item, used: false }))
        .sort(() => 0.5 - Math.random()),
    selected: []
  }

  _handleSubmit = async () => {
    try {
      const seed = this.props.navigation.getParam('seed', []).join(' ')
      const selectedWords = this.state.selected.join(' ')
      if (seed !== selectedWords) throw new Error('Words dont match!')
      await confirmSecret()
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'SettingsScene' })
        ]
      })
      this.props.navigation.dispatch(resetAction)
    } catch (error) {
      console.warn(error)
      alert('Selected words dont match. Make sure you wrote the words in the correct order.')
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

  render() {
    return (
      <Fragment>
        <Utils.Header>
          <Utils.TitleWrapper>
            <Utils.Title>Confirm Seed</Utils.Title>
          </Utils.TitleWrapper>
          <ButtonGradient
            onPress={this._handleSubmit}
            text='SUBMIT'
          />
        </Utils.Header>
        <Utils.Container>
          <ScrollView>
            <Utils.View flex={1} />
            <Utils.Content align='center' justify='center'>
              <Utils.Text>Select the words below in the right order to confirm your secret phrase.</Utils.Text>
            </Utils.Content>
            <Utils.View flex={1} />
            <Utils.Content background={Colors.darkerBackground}>
              <Utils.Row wrap='wrap' justify='center'>
                {this.state.selected.map(item => (
                  <WordWrapper key={item} onPress={() => this._deselectWord(item)}>
                    <Utils.Text>{item}</Utils.Text>
                  </WordWrapper>
                ))}
              </Utils.Row>
            </Utils.Content>
            <Utils.View flex={1} />
            <Utils.Content background={Colors.darkerBackground}>
              <Utils.Row wrap='wrap' justify='center'>
                {this.state.seed.map(item => (
                  <WordWrapper key={item.word} onPress={() => this._selectWord(item)} disabled={item.used}>
                    <Utils.Text secondary={item.used}>{item.word}</Utils.Text>
                  </WordWrapper>
                ))}
              </Utils.Row>
            </Utils.Content>
          </ScrollView>
        </Utils.Container>
      </Fragment>
    )
  }
}

export default Confirm
