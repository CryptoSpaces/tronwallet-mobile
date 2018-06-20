// Dependencies
import React, { PureComponent } from 'react'
import { forIn, reduce, union, clamp } from 'lodash'
import {
  ActivityIndicator,
  SafeAreaView,
  View,
  Linking,
  FlatList,
} from 'react-native'
import qs from 'qs'

// Utils
import * as Utils from '../../components/Utils'
import { TronVaultURL, MakeTronMobileURL } from '../../utils/deeplinkUtils'
import formatUrl from '../../utils/formatUrl'
import formatNumber from '../../utils/formatNumber'

// Components
import Header from '../../components/Header'
import VoteItem from '../../components/Vote/VoteItem'
import ButtonGradient from '../../components/ButtonGradient'
import VoteModal from '../../components/Vote/VoteModal'
import FadeIn from '../../components/Animations/FadeIn'

// Service
import Client from '../../services/client'

import getCandidateStore from '../../store/candidates'

const LIST_STEP_SIZE = 20

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
                onPress={params._onSubmit}
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
    totalVotes: null,
    totalRemaining: null,
    refreshing: false,
    from: '',
    currentVotes: {},
    userVotes: {},
    modalVisible: false,
    currentItemUrl: null,
    currentItemAddress: null,
    currentAmountToVote: '',
    offset: 0,
    errorMessage: ''
  }

  async componentDidMount () {
    this.props.navigation.setParams({ onSubmit: this._onSubmit, disabled: true })
    this._loadCandidates()
    this._loadFreeze()
    this._loadUserVotes()
    this._loadPublicKey()
    this._requestData()
  }

  _requestData = () => {



    this._refreshCandidates()
  }

  _getVoteList = store =>   
    store.objects('Candidate')
      .sorted([['votes', true], ['url', false]])
      .slice(this.state.offset, clamp(this.state.offset + LIST_STEP_SIZE, store.objects('Candidate').length))
      .map(item => Object.assign({}, item))

  _loadCandidates = async () => {
    try{
    const store = await getCandidateStore()
    this.setState({ voteList: this._getVoteList(store) })
    }
    catch(e){
      e.name = 'Load Candidates Error'
      this._throwError(e)
    }
  }
  
  _refreshCandidates = async () => {
    try {
      if (!this.state.refreshing) {
        console.log('refreshing', this.state)
        this.setState({ refreshing: true })
        const { candidates, totalVotes } = await Client.getTotalVotes()
        console.log('candidatos:', candidates)
        const store = await getCandidateStore()
        store.write(() => candidates.map(item => store.create('Candidate', item, true)))
        this.setState({
          voteList: this._getVoteList(store),
          totalVotes,
          refreshing: false
        }, () => console.log('after', this.state))
      }
    }
    catch(e){
      e.name = 'Refresh Candidates Error'
      this._throwError(e)
    }
  }
  
  _loadMoreCandidates = async () => {
    try { 
      this.setState({ offset: this.state.offset + LIST_STEP_SIZE })
      const store = await getCandidateStore()
      this.setState({ voteList: union(this.state.voteList, this._getVoteList(store)) })
    }
    catch (e){
      e.name = 'Load More Candidates Error'
      this._throwError(e)
    }
  }
  
  _loadFreeze = async () => {
    try{
    const { total } = await Client.getFreeze()
    this.setState({ totalRemaining: total || 0 })
    } 
    catch(e){
      e.name = 'Load Freeze Error'
      this._throwError(e)
    }
  }
  
_loadUserVotes = async () => {
  try {
    const userVotes = await Client.getUserVotes()
    this.setState({ userVotes })
  }
    catch(e){
      e.name = 'Load User Votes Error'
      this._throwError(e)
    }
  }
  
  _loadPublicKey = async () => {
    try{
      const publicKey = await Client.getPublicKey()
      this.setState({ publicKey })
    }
    catch(e){
      e.name = 'Load Public Key Error'
      this._throwError(e)
    }
  }

  _onSubmit = async () => {
    const { from, currentVotes, totalRemaining } = this.state

    if (totalRemaining >= 0) {
      this.setState({ loading: true })
      forIn(currentVotes, function (value, key) {
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
        this._openDeepLink(dataToSend)
      } catch (error) {
        this.setState({ loading: false })
      }
    }
  }

  _openDeepLink = async (dataToSend) => {
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

  _onChangeVotes = (value, address) => {
    const { navigation } = this.props
    const { currentVotes, totalRemaining } = this.state

    const newVotes = { ...currentVotes, [address]: value }
    const totalUserVotes = reduce(
      newVotes,
      function (result, value) {
        return Number(result) + Number(value)
      },
      0
    )
    const total = totalRemaining - totalUserVotes
    navigation.setParams({ disabled: total <= 0 })
    this.setState({ currentVotes: newVotes, totalRemaining: total, ...this._resetModalState()})
  }

  _onSearch = async value => {
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

  _setupVoteModal = (item) => {
    this.setState({
      modalVisible: true,
      currentItemUrl: formatUrl(item.url),
      currentItemAddress: item.address
    })
  }

  _throwError = (e) => {
    console.log(`${e.name}: ${e.message}`)
    this.setState({ 
        errorMessage:  'Communications with server failed.',
        loading: false
    })
  }

  _closeModal = () => {
    this.setState({
      ...this._resetModalState()
    })
  }

  _refreshPage = () => {
    this._requestData()
  }

  _resetModalState = () => {
    return {
      modalVisible: false,
      currentItemUrl: null,
      currentItemAddress: null,
      currentAmountToVote: ''
    }
  }

  _addNumToVote = (key) => {
    this.setState((state) => {
      return {
        currentAmountToVote: `${state.currentAmountToVote}${key}`
      }
    })
  }

  _removeNumFromVote = () => {
    if (this.state.currentAmountToVote.length > 0) {
      this.setState((state) => {
        return {
          currentAmountToVote: state.currentAmountToVote.slice(0, -1)
        }
      })
    }
  }

  _acceptCurrentVote = () => {
    this._onChangeVotes(this.state.currentAmountToVote, this.state.currentItemAddress)
  }

  _renderRow = ({ item, index }) => {
    const { currentVotes, userVotes } = this.state

    return (
      <VoteItem
        item={item}
        index={index}
        format={formatNumber}
        openModal={() => this._setupVoteModal(item)}
        onChangeVotes={this._onChangeVotes}
        votes={currentVotes[item.address]}
        userVote={userVotes[item.address]}
      />
    )
  }

  render () {
    const { totalVotes, totalRemaining, errorMessage } = this.state

    return (
      <Utils.Container>
        {(totalVotes === null || totalRemaining === null) && (
          <FadeIn name='vote-header-loading'>
            <Header>
              <Utils.View align='center' height='33px'>
                <ActivityIndicator />
              </Utils.View>
            </Header>
          </FadeIn>
        )}
        {(totalVotes !== null && totalRemaining !== null) && (
          <FadeIn name='vote-header'>
            <Header>
              <Utils.View align='center'>
                <Utils.Text size='xsmall' secondary>
                  TOTAL VOTES
                </Utils.Text>
                <Utils.Text size='small'>{formatNumber(totalVotes)}</Utils.Text>
              </Utils.View>
              <Utils.View align='center'>
                <Utils.Text size='xsmall' secondary>
                  VOTES AVAILABLE
                </Utils.Text>
                <Utils.Text
                  size='small'
                  style={{ color: `${totalRemaining < 0 ? '#dc3545' : '#fff'}` }}
                >
                  {formatNumber(totalRemaining)}
                </Utils.Text>
              </Utils.View>
            </Header>
          </FadeIn>
        )}
        {(errorMessage.length > 0) && (
          <View>
            <Utils.Text>{errorMessage}</Utils.Text>
            <RefreshPage refresh={this._refreshPage} />
          </View>
        )}
        {this.state.modalVisible && (
          <VoteModal
            addNumToVote={this._addNumToVote}
            removeNumFromVote={this._removeNumFromVote}
            acceptCurrentVote={this._acceptCurrentVote}
            closeModal={this._closeModal} 
            candidateUrl={this.state.currentItemUrl}
            currVoteAmount={this.state.currentAmountToVote}
            modalVisible={this.state.modalVisible}
            totalRemaining={this.state.totalRemaining}
          />
        )}
        <Utils.Content>
          <Utils.FormInput
            underlineColorAndroid='transparent'
            onChangeText={text => this._onSearch(text, 'search')}
            placeholder='Search'
            placeholderTextColor='#fff'
            marginBottom={0}
            marginTop={0}
          />
        </Utils.Content>
        <FadeIn name='candidates'>
          <FlatList
            keyExtractor={item => item.address}
            data={this.state.voteList}
            renderItem={this._renderRow}
            onEndReachedThreshold={0.5}
            onEndReached={this._loadMoreCandidates}
            onRefresh={this._refreshCandidates}
            refreshing={this.state.refreshing}
            removeClippedSubviews
          />
        </FadeIn>
      </Utils.Container>
    )
  }
}

export default VoteScene
