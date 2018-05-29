import React, { Component } from 'react'
import axios from 'axios'
import { ActivityIndicator, FlatList } from 'react-native'
import * as Utils from '../../components/Utils'

class TokensScene extends Component {
  state = {
    loading: true
  }

  componentDidMount () {
    this._loadTokens()
  }

  _loadTokens = async () => {
    const response = await axios.get('https://api.tronscan.org/api/token?sort=-name&start=0&status=ico')
    this.setState({
      loading: false,
      data: response.data.data,
      total: response.data.total
    })
  }

  render () {
    if (this.state.loading) {
      return (
        <Utils.Container>
          <Utils.StatusBar />
          <Utils.View flex={1} align='center' justify='center'>
            <ActivityIndicator />
          </Utils.View>
        </Utils.Container>
      )
    }

    return (
      <Utils.Container>
        <Utils.StatusBar />
        <Utils.Content>
          <FlatList
            data={this.state.data}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => (
              <Utils.View>
                <Utils.Text>Position: {index + 1}</Utils.Text>
                <Utils.Text>Name: {item.name}</Utils.Text>
                <Utils.Text>Url: {item.url}</Utils.Text>
                <Utils.Text>Percentage: {item.percentage}</Utils.Text>
                <Utils.Text>Issued: {item.issued}</Utils.Text>
                <Utils.Text>TotalSupply: {item.totalSupply}</Utils.Text>
                <Utils.Button
                  onPress={() => this.props.navigation.navigate('Participate', { token: item, position: index + 1 })}
                >
                  <Utils.Text>PARTICIPATE</Utils.Text>
                </Utils.Button>
              </Utils.View>
            )}
            ItemSeparatorComponent={() => <Utils.VerticalSpacer size='medium' />}
          />
        </Utils.Content>
      </Utils.Container>
    )
  }
}

export default TokensScene
