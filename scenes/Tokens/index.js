import React, { Component } from 'react'
import axios from 'axios'
import { ActivityIndicator, FlatList, StyleSheet, SafeAreaView } from 'react-native'
import numeral from 'numeral'
import * as Utils from '../../components/Utils'
import ButtonGradient from './../../components/ButtonGradient'
import { Spacing, Colors } from './../../components/DesignSystem'

class TokensScene extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <SafeAreaView style={{ backgroundColor: 'black' }}>
          <Utils.Header>
            <Utils.TitleWrapper>
              <Utils.Title>Tokens</Utils.Title>
            </Utils.TitleWrapper>
          </Utils.Header>
        </SafeAreaView>
      )
    }
  }

  state = {
    loading: true,
    data: [],
    total: 0,
    error: null
  }

  componentDidMount () {
    this._loadTokens()
  }

  _loadTokens = async () => {
    try {
      const response = await axios.get('https://api.tronscan.org/api/token?sort=-name&start=0&status=ico')
      this.setState({
        loading: false,
        data: response.data.data,
        total: response.data.total
      })
    } catch (error) {
      this.setState({
        loading: false,
        error
      })
    }
  }

  navigate = (token) => this.props.navigation.navigate('Participate', { token })

  format = (percentage) => numeral(percentage).format('0.[00]') + '%'

  renderCardFooter = (item) => {
    if (item.percentage < 100) {
      return (
        <ButtonGradient
          size='small'
          onPress={() => this.navigate(item)}
          text='PARTICIPATE'
        />
      )
    }

    return (
      <Utils.View
        align='center'
        justify='center'
      >
        <Utils.Text color={Colors.red}>FINISHED</Utils.Text>
      </Utils.View>
    )
  }

  renderCard = (item) => (
    <Utils.Card>
      <Utils.Text size='medium'>{item.name}</Utils.Text>
      <Utils.VerticalSpacer size='medium' />

      <Utils.Text ellipsizeMode='tail' numberOfLines={2} size='xsmall' >{item.url}</Utils.Text>
      <Utils.VerticalSpacer size='medium' />

      <Utils.Row style={{ justifyContent: 'space-between', marginBottom: 5 }}>
        <Utils.Text>{this.format(item.percentage)}</Utils.Text>
        <Utils.Text>
          <Utils.Text color={Colors.yellow}>{item.issued}</Utils.Text>
          /{item.totalSupply}
        </Utils.Text>
      </Utils.Row>
      <Utils.VerticalSpacer size='large' />

      {this.renderCardFooter(item)}
    </Utils.Card>
  )

  renderRefreshControl = () => (
    <Utils.View flex={1} align='center' justify='center' background={Colors.background}>
      <ActivityIndicator />
    </Utils.View>
  )

  renderListEmptyComponent = () => (
    <Utils.Container />
  )

  render () {
    if (this.state.loading) return this.renderRefreshControl()

    return (
      <Utils.Container>
        <FlatList
          contentContainerStyle={styles.list}
          data={this.state.data}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => this.renderCard(item, index)}
          ItemSeparatorComponent={() => <Utils.VerticalSpacer size='medium' />}
          ListEmptyComponent={this.renderListEmptyComponent}
        />
      </Utils.Container>
    )
  }
}

const styles = StyleSheet.create({
  list: {
    padding: Spacing.medium
  }
})

export default TokensScene
