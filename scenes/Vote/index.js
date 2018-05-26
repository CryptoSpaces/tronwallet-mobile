// Dependencies
import React, { PureComponent } from 'react'
import { FlatList, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo'

// Utils
import { Colors, Spacing } from '../../components/DesignSystem'
import * as Utils from '../../components/Utils'

// Components
import Header from '../../components/Header'
import InputAmount from '../../src/components/Vote/InputAmount'

// Service
import Client from '../../src/services/client'

class VoteScene extends PureComponent {
  state = {
    voteList: [],
    currentItem: null,
    search: '',
    loading: true,
    loadingList: false,
    totalVotes: 0
  };

  componentDidMount () {
    this.onLoadData()
  }

  onLoadData = async () => {
    const { candidates, totalVotes } = await Client.getTotalVotes()
    this.setState({ voteList: candidates, loading: false, totalVotes })
  }

  onSubmit = async () => {
    const votesPrepared = {}
    const { voteList } = this.state
    this.setState({ loading: true })
    voteList.forEach((vote) => {
      if (vote.amount && Number(vote.amount) > 0) {
        const key = vote.address
        votesPrepared[key] = Number(vote.amount)
      }
    })
    try {
      await Client.postVotes(votesPrepared)
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  onChangeVotes = (value, address) => {
    const { voteList } = this.state
    voteList.find(v => v.address === address).amount = value
    this.setState({
      voteList
    })
  }

  onSearch = async (value, field) => {
    const { voteList } = this.state
    if (value) {
      this.setState({ loadingList: true })
      const regex = new RegExp(value, 'i')
      const votesFilter = voteList.filter((vote) => vote.url.match(regex))
      this.setState({ voteList: votesFilter, loadingList: false })
    } else {
      this.setState({ loadingList: true })
      const { candidates } = await Client.getTotalVotes()
      this.setState({ voteList: candidates, loadingList: false })
    }
  }

  renderRow = ({ item, index }) => {
    let url = item.url
    if (url.length > 25) {
      url = `${url.slice(0, 20)}...`
    }
    return (
      <Utils.Item padding={16}>
        <Utils.Row justify='space-between' align='center'>
          <Utils.Row justify='space-between' align='center'>
            <View style={styles.rank}>
              <Utils.Text secondary>#{index + 1}</Utils.Text>
            </View>
            <Utils.Text lineHeight={20}>{url}</Utils.Text>
          </Utils.Row>
          <InputAmount
            input={item.amount ? item.amount : ''}
            onOutput={this.onChangeVotes}
            max={14106}
            id={item.address}
          />
        </Utils.Row>
      </Utils.Item>
    )
  }

  render () {
    const { voteList, loading, totalVotes, loadingList } = this.state
    if (loading) {
      return (
        <Utils.Container>
          <Utils.Content height={200} justify='center' align='center'>
            <ActivityIndicator size='large' color={Colors.yellow} />
          </Utils.Content>
        </Utils.Container>
      )
    }
    return (
      <Utils.Container>
        <Utils.StatusBar transparent />
        <Header>
          <Utils.View align='center'>
            <Utils.Text size='xsmall' secondary>TOTAL VOTES</Utils.Text>
            <Utils.Text size='small'>{totalVotes.toLocaleString()}</Utils.Text>
          </Utils.View>
          <Utils.View align='center'>
            <Utils.Text size='xsmall' secondary>TOTAL REMAINING</Utils.Text>
            <Utils.Text size='small'>14,106</Utils.Text>
          </Utils.View>
        </Header>
        <Utils.Row style={styles.searchWrapper} justify='space-between' align='center'>
          <Utils.FormInput
            underlineColorAndroid='transparent'
            onChangeText={(text) => this.onSearch(text, 'search')}
            placeholder='Search'
            placeholderTextColor='#fff'
            style={{ width: '70%' }}
          />
          <TouchableOpacity onPress={this.onSubmit}>
            <LinearGradient
              start={[0, 1]}
              end={[1, 0]}
              colors={[Colors.primaryGradient[0], Colors.primaryGradient[1]]}
              style={styles.submitButton}
            >
              <Utils.Text size='xsmall'>Submit</Utils.Text>
            </LinearGradient>
          </TouchableOpacity>
        </Utils.Row>
        {
          loadingList
            ? <Utils.Content height={200} justify='center' align='center'>
              <ActivityIndicator size='large' color={Colors.yellow} />
            </Utils.Content>
            : <FlatList
              data={voteList}
              removeClippedSubviews
              renderItem={this.renderRow}
              keyExtractor={item => `${item.address}`}
            />
        }
      </Utils.Container>
    )
  }
}

const styles = StyleSheet.create({
  searchWrapper: {
    paddingLeft: 24,
    paddingRight: 24
  },
  rank: {
    paddingRight: 10
  },
  submitButton: {
    padding: Spacing.small,
    alignItems: 'center',
    borderRadius: 5,
    width: '100%'
  },
  button: {
    backgroundColor: Colors.secondaryText,
    borderColor: Colors.secondaryText,
    borderRadius: 5,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default VoteScene
