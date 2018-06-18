// Dependencies
import React, { PureComponent } from 'react'
import _ from 'lodash'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
  Linking
} from 'react-native'
import qs from 'qs'
import { KeyboardAwareFlatList, KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// Utils
import { Spacing } from '../../components/DesignSystem'
import * as Utils from '../../components/Utils'
import { TronVaultURL, MakeTronMobileURL } from '../../utils/deeplinkUtils'
import formatUrl from '../../utils/formatUrl'

// Components
import Header from '../../components/Header'
import VoteItem from '../../components/Vote/VoteItem'
import LoadingScene from '../../components/LoadingScene'
import ButtonGradient from '../../components/ButtonGradient'
import VoteModal from '../../components/Vote/VoteModal'

// Service
import Client from '../../services/client'

class VoteScene extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
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
                disabled={params.disabled}
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
    userVotes: {},
    modalVisible: false,
    currentItemUrl: null,
    currentItemAddress: null,
    currentAmountToVote: ''
  }

  componentDidMount () {
    this.props.navigation.setParams({ onSubmit: this.onSubmit, disabled: true })
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
          URL: MakeTronMobileURL('transaction'),
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
      const url = `${TronVaultURL}auth/${dataToSend}`

      await Linking.openURL(url)

      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false }, () => {
        this.props.navigation.navigate('GetVault')
      })
    }
  }

  onChangeVotes = (value, address) => {
    const { navigation } = this.props
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
    navigation.setParams({ disabled: totalRemaining <= 0 })
    this.setState({ 
      currentVotes: newVotes, 
      totalRemaining,
      ...this.resetModalState()})
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

  setupVoteModal = (item) => {
    this.setState({
      modalVisible: true,
      currentItemUrl: formatUrl(item.url),
      currentItemAddress: item.address
    })
  }

  closeModal = () => {
    this.setState({
      ...this.resetModalState()
    })
  }

  resetModalState = () => {
    return {
      modalVisible: false,
      currentItemUrl: null,
      currentItemAddress: null,
      currentAmountToVote: ''
    }
  }

  addNumToVote = (key) => {
    this.setState((state) => {
      return {
        currentAmountToVote: `${state.currentAmountToVote}${key}`
      }
    })
  }

  removeNumFromVote = () => {
    if (this.state.currentAmountToVote.length > 0) {
      this.setState((state) => {
        return {
          currentAmountToVote: state.currentAmountToVote.slice(0, -1)
        }
      })
    }
  }

  acceptCurrentVote = () => {

  }

  renderRow = ({ item, index }) => {
    const { currentVotes, userVotes } = this.state
    return (
      <VoteItem
        item={item}
        index={index}
        format={this.format}
        openModal={() => this.setupVoteModal(item)}
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
    console.log(this.state.currentVotes)

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
        {this.state.modalVisible && (
          <VoteModal
            addNumToVote={this.addNumToVote}
            removeNumFromVote={this.removeNumFromVote}
            acceptCurrentVote={this.onChangeVotes}
            candidateUrl={this.state.currentItemUrl}
            currVoteAmount={this.state.currentAmountToVote}
            modalVisible={this.state.modalVisible}
            closeModal={this.closeModal} 
          />
        )}
        <KeyboardAwareScrollView>
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
              <ActivityIndicator size='large' color={'#ffffff'} />
            </Utils.Content>
          ) : (
            this.renderList()
          )}
        </KeyboardAwareScrollView>
      </Utils.Container>
    )
  }
}

export default VoteScene
