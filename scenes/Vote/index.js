// Dependencies
import React, { PureComponent } from 'react'
import _ from 'lodash'
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { LinearGradient, Linking } from 'expo'
import qs from 'qs'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

// Utils
import { Colors, Spacing } from '../../components/DesignSystem'
import * as Utils from '../../components/Utils'

// Components
import Header from '../../components/Header'
import VoteItem from '../../src/components/Vote/VoteItem'
import LoadingScene from '../../components/LoadingScene'

// Service
import Client from '../../src/services/client'

class VoteScene extends PureComponent {
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
  };

  componentDidMount () {
    this.onLoadData()
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
    const { from, currentVotes } = this.state
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
        URL: Linking.makeUrl('transaction'),
        data
      })
      const url = `tronvault://tronvault/auth/${dataToSend}`
      const supported = await Linking.canOpenURL(url)
      if (supported) await Linking.openURL(url)
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  onChangeVotes = (value, address) => {
    const { currentVotes, totalTrx } = this.state
    const newVotes = { ...currentVotes, [address]: value }
    const totalUserVotes = _.reduce(newVotes, function (result, value, key) {
      return Number(result) + Number(value)
    }, 0)
    const totalRemaining = totalTrx - totalUserVotes
    this.setState({ currentVotes: newVotes, totalRemaining })
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

  format = (value) => {
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

  renderList = () => Platform.select({
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
    const {
      loading,
      totalVotes,
      loadingList,
      totalRemaining
    } = this.state

    if (loading) return <LoadingScene />

    return (
      <Utils.Container>
        <Utils.StatusBar transparent />
        <Header>
          <Utils.View align='center'>
            <Utils.Text size='xsmall' secondary>TOTAL VOTES</Utils.Text>
            <Utils.Text size='small'>{this.format(totalVotes)}</Utils.Text>
          </Utils.View>
          <Utils.View align='center'>
            <Utils.Text size='xsmall' secondary>TOTAL REMAINING</Utils.Text>
            <Utils.Text
              size='small'
              style={{ color: `${totalRemaining < 0 ? '#dc3545' : '#fff'}` }}
            >
              {this.format(totalRemaining)}
            </Utils.Text>
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
          <TouchableOpacity onPress={totalRemaining >= 0 ? this.onSubmit : () => {}}>
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
            ? (
              <Utils.Content height={200} justify='center' align='center'>
                <ActivityIndicator size='large' color={Colors.yellow} />
              </Utils.Content>
            )
            : this.renderList()
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
  submitButton: {
    padding: Spacing.small,
    alignItems: 'center',
    borderRadius: 5,
    width: '100%'
  }
})

export default VoteScene
