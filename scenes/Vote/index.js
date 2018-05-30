// Dependencies
import React, { PureComponent } from 'react'
import _ from 'lodash'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View
} from 'react-native'
import { Linking } from 'expo'
import qs from 'qs'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

// Utils
import { Colors, Spacing } from '../../components/DesignSystem'
import * as Utils from '../../components/Utils'
import { DeeplinkURL } from '../../utils/deeplinkUtils'
// Components
import Header from '../../components/Header'
import VoteItem from '../../src/components/Vote/VoteItem'
import LoadingScene from '../../components/LoadingScene'
import ButtonGradient from '../../components/ButtonGradient'

// Service
import Client from '../../src/services/client'

class VoteScene extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      header: (
        <SafeAreaView style={{ backgroundColor: 'black' }}>
          <Utils.Header>
            <Utils.TitleWrapper>
              <Utils.Title>Vote</Utils.Title>
            </Utils.TitleWrapper>
            <View style={{ marginRight: 15 }}>
              <Utils.Text>{params.totalRemaining}</Utils.Text>
              <ButtonGradient
                size='small'
                text='Submit'
                onPress={params.onSubmit}
              />
            </View>
          </Utils.Header>
        </SafeAreaView>
      )
    }
  }

  state = {
    voteList: [],
    currentItem: null,
    search: '',
    loading: true,
    loadingList: false,
    totalVotes: 0,
    totalRemaining: 0,
    totalTrx: 0,
    from: '',
    currentVotes: {},
    userVotes: {}
  }

  componentDidMount () {
    this.props.navigation.setParams({ onSubmit: this.onSubmit })
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this.onLoadData()
    })
  }

  componentWillUnmount () {
    this._navListener.remove()
  }

  onLoadData = async () => {
    const data = await Promise.all([
      Client.getTotalVotes(),
      Client.getFreeze(),
      Client.getUserVotes(),
      Client.getPublicKey()
    ])
    const { candidates, totalVotes } = data[0]
    const frozen = data[1]
    const userVotes = data[2]
    const from = data[3]
    const totalTrx = frozen.total || 0
    this.setState({
      voteList: _.orderBy(candidates, ['votes', 'url'], ['desc', 'asc']) || 0,
      loading: false,
      totalVotes,
      totalRemaining: totalTrx,
      totalTrx,
      userVotes,
      from
    })
  }

  onSubmit = async () => {
    const { from, currentVotes, totalRemaining } = this.state
    if (totalRemaining >= 0) {
      this.setState({ loading: true })
      _.forIn(currentVotes, function (value, key) {
        currentVotes[key] = Number(value)
      })
      try {
        // Transaction String
        const data = await Client.postVotes(currentVotes)
        // Data to deep link, same format as Tron Wallet
        const dataToSend = qs.stringify({
          txDetails: { from, Type: 'VOTE' },
          pk: from,
          from: 'mobile',
          action: 'transaction',
          URL: Linking.makeUrl('/transaction'),
          data
        })
        this.openDeepLink(dataToSend)
      } catch (error) {
        this.setState({ loading: false })
      }
    }
  }

  openDeepLink = async (dataToSend) => {
    try {
      const url = `${DeeplinkURL}auth/${dataToSend}`

      await Linking.openURL(url)

      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false }, () => {
        this.props.navigation.navigate('GetVault')
      })
    }
  }

  onChangeVotes = (value, address) => {
    const { currentVotes, totalTrx } = this.state
    const newVotes = { ...currentVotes, [address]: value }
    const totalUserVotes = _.reduce(
      newVotes,
      function (result, value, key) {
        return Number(result) + Number(value)
      },
      0
    )
    const totalRemaining = totalTrx - totalUserVotes
    this.setState({ currentVotes: newVotes, totalRemaining })
  }

  onSearch = async (value, field) => {
    const { voteList } = this.state
    if (value) {
      this.setState({ loadingList: true })
      const regex = new RegExp(value, 'i')
      const votesFilter = voteList.filter(vote => vote.url.match(regex))
      this.setState({ voteList: votesFilter, loadingList: false })
    } else {
      this.setState({ loadingList: true })
      const { candidates } = await Client.getTotalVotes()
      this.setState({ voteList: candidates, loadingList: false })
    }
  }

  format = value => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  renderRow = ({ item, index }) => {
    const { currentVotes, userVotes } = this.state
    return (
      <VoteItem
        item={item}
        index={index}
        format={this.format}
        onChangeVotes={this.onChangeVotes}
        votes={currentVotes[item.address]}
        userVote={userVotes[item.address]}
      />
    )
  }

  renderList = () =>
    Platform.select({
      ios: (
        <KeyboardAwareFlatList
          keyExtractor={item => item.address}
          data={this.state.voteList}
          renderItem={this.renderRow}
        />
      ),
      android: (
        <KeyboardAvoidingView behavior='padding'>
          <KeyboardAwareFlatList
            keyExtractor={item => item.address}
            data={this.state.voteList}
            renderItem={this.renderRow}
          />
        </KeyboardAvoidingView>
      )
    })

  render () {
    const { loading, totalVotes, loadingList, totalRemaining } = this.state

    if (loading) return <LoadingScene />

    return (
      <Utils.Container>
        <Header>
          <Utils.View align='center'>
            <Utils.Text size='xsmall' secondary>
              TOTAL VOTES
            </Utils.Text>
            <Utils.Text size='small'>{this.format(totalVotes)}</Utils.Text>
          </Utils.View>
          <Utils.View align='center'>
            <Utils.Text size='xsmall' secondary>
              VOTES AVAILABLE
            </Utils.Text>
            <Utils.Text
              size='small'
              style={{ color: `${totalRemaining < 0 ? '#dc3545' : '#fff'}` }}
            >
              {this.format(totalRemaining)}
            </Utils.Text>
          </Utils.View>
        </Header>
        <Utils.View justify='center' align='center'>
          <Utils.FormInput
            underlineColorAndroid='transparent'
            onChangeText={text => this.onSearch(text, 'search')}
            placeholder='Search'
            placeholderTextColor='#fff'
            marginTop={Spacing.medium}
            style={{ width: '95%' }}
          />
        </Utils.View>
        {loadingList ? (
          <Utils.Content height={200} justify='center' align='center'>
            <ActivityIndicator size='large' color={Colors.yellow} />
          </Utils.Content>
        ) : (
          this.renderList()
        )}
      </Utils.Container>
    )
  }
}

export default VoteScene
