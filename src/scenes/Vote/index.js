// Dependencies
import React, { PureComponent } from 'react'
import { forIn, reduce, union, clamp, debounce } from 'lodash'
import { Linking, FlatList, Alert } from 'react-native'

// Utils
import * as Utils from '../../components/Utils'
import { TronVaultURL } from '../../utils/deeplinkUtils'
import formatUrl from '../../utils/formatUrl'
import { formatNumber } from '../../utils/numberUtils'

// Components
import Header from '../../components/Header'
import VoteItem from '../../components/Vote/VoteItem'
import VoteModal from '../../components/Vote/VoteModal'
import FadeIn from '../../components/Animations/FadeIn'
import GrowIn from '../../components/Animations/GrowIn'

// Service
import Client from '../../services/client'
import { signTransaction } from '../../utils/transactionUtils'

import getCandidateStore from '../../store/candidates'
import { Context } from '../../store/context'

const LIST_STEP_SIZE = 20

const INITIAL_STATE = {
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
  votesError: '',
  listError: ''
}

class VoteScene extends PureComponent {
  state = INITIAL_STATE

  async componentDidMount () {
    this._onSearch = debounce(this._onSearch, 500)
    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      this._loadData
    )
  }

  componentWillUnmount () {
    this.didFocusSubscription.remove()
  }

  _loadData = async () => {
    this.props.navigation.setParams({
      onSubmit: this._submit,
      disabled: true,
      votesError: null,
      listError: null
    })

    this.setState(INITIAL_STATE)
    this._loadCandidates()
    this._refreshCandidates()
    this._loadFreeze()
    await this._loadUserVotes()
    this.setState({ loading: false })
  }

  _getVoteList = store =>
    store
      .objects('Candidate')
      .sorted([['votes', true], ['url', false]])
      .slice(
        this.state.offset,
        clamp(
          this.state.offset + LIST_STEP_SIZE,
          store.objects('Candidate').length
        )
      )
      .map(item => Object.assign({}, item))

  _loadCandidates = async () => {
    try {
      const store = await getCandidateStore()
      this.setState({ voteList: this._getVoteList(store) })
    } catch (e) {
      e.name = 'Load Candidates Error'
      this._throwError(e)
    }
  }

  _refreshCandidates = async () => {
    try {
      if (!this.state.refreshing) {
        this.setState({ refreshing: true })
        const { candidates, totalVotes } = await Client.getTotalVotes()
        const store = await getCandidateStore()
        store.write(() =>
          candidates.map(item => store.create('Candidate', item, true))
        )
        this.setState({
          voteList: this._getVoteList(store),
          totalVotes,
          refreshing: false
        })
      }
    } catch (e) {
      e.name = 'Refresh Candidates Error'
      this._throwError(e)
    }
  }

  _loadMoreCandidates = async () => {
    try {
      this.setState({ offset: this.state.offset + LIST_STEP_SIZE })
      const store = await getCandidateStore()
      this.setState({
        voteList: union(this.state.voteList, this._getVoteList(store))
      })
    } catch (e) {
      e.name = 'Load More Candidates Error'
      this._throwError(e)
    }
  }

  _loadFreeze = () => {
    try {
      if (this.props.context.freeze.value) {
        const { total } = this.props.context.freeze.value
        this.setState({ totalRemaining: total || 0 })
      } else {
        throw new Error(this.props.context.freeze.err)
      }
    } catch (e) {
      e.name = 'Freeze Error'
      this._throwError(e, 'votesError')
    }
  }

  _loadUserVotes = async () => {
    try {
      const userVotes = await Client.getUserVotes()
      this.setState({ userVotes })
      return userVotes
    } catch (e) {
      e.name = 'Load User Votes Error'
      this._throwError(e, 'votesError')
    }
  }

  _submit = async () => {
    const { currentVotes, totalRemaining } = this.state
    const { navigation } = this.props

    if (totalRemaining >= 0) {
      this.setState({ loading: true })
      navigation.setParams({ disabled: true })

      forIn(currentVotes, function (value, key) {
        currentVotes[key] = Number(value)
      })
      try {
        // Transaction String
        const data = await Client.getVoteWitnessTransaction(currentVotes)
        this._openTransactionDetails(data)
      } catch (error) {
        console.warn(error.message)
        Alert.alert('Error while building transaction, try again.')
        this.setState({ loading: false })
        navigation.setParams({ disabled: false })
      }
    }
  }

  _openTransactionDetails = async transactionUnsigned => {
    try {
      const transactionSigned = await signTransaction(transactionUnsigned)
      this.setState({ loadingSign: false }, () => {
        this.props.navigation.navigate('SubmitTransaction', {
          tx: transactionSigned
        })
      })
    } catch (error) {
      this.setState({ error: 'Error getting transaction', loadingSign: false })
    }
  }

  _openDeepLink = async dataToSend => {
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
    const { currentVotes } = this.state
    const totalFrozen = this.props.context.freeze.value.total
    const newVotes = { ...currentVotes, [address]: value }
    const totalUserVotes = reduce(
      newVotes,
      function (result, value) {
        return Number(result) + Number(value)
      },
      0
    )
    const totalVotesRemaining = totalFrozen - totalUserVotes
    navigation.setParams({
      disabled: totalVotesRemaining < 0 && totalUserVotes > 0
    })
    this.setState({
      currentVotes: newVotes,
      totalRemaining: totalVotesRemaining,
      ...this._resetModalState()
    })
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

  _setupVoteModal = item => {
    this.setState({
      modalVisible: true,
      currentItemUrl: formatUrl(item.url),
      currentItemAddress: item.address
    })
  }

  _throwError = (e, type) => {
    const errorType = type || 'listError'
    console.log(`${e.name}. ${e.message}`)
    this.setState(
      {
        [errorType]: "Oops, something didn't load correctly. Try to sync again",
        loading: false
      },
      function setErrorParams () {
        this.props.navigation.setParams({
          loadData: this._loadData,
          [errorType]: this.state[errorType]
        })
      }
    )
  }

  _closeModal = () => {
    this.setState({
      ...this._resetModalState()
    })
  }

  _resetModalState = () => {
    return {
      modalVisible: false,
      currentItemUrl: null,
      currentItemAddress: null,
      currentAmountToVote: ''
    }
  }

  _addNumToVote = key => {
    this.setState(state => {
      return {
        currentAmountToVote: `${state.currentAmountToVote}${key}`
      }
    })
  }

  _removeNumFromVote = () => {
    if (this.state.currentAmountToVote.length > 0) {
      this.setState(state => {
        return {
          currentAmountToVote: state.currentAmountToVote.slice(0, -1)
        }
      })
    }
  }

  _acceptCurrentVote = () => {
    this._onChangeVotes(
      this.state.currentAmountToVote,
      this.state.currentItemAddress
    )
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
    const { totalVotes, totalRemaining, votesError, refreshing, loadingList } = this.state
    return (
      <Utils.Container>
        {totalVotes !== null &&
          totalRemaining !== null && (
            <GrowIn name='vote-header' height={63}>
              <Header>
                <Utils.View align='center'>
                  <Utils.Text size='tiny' weight='500' secondary>
                    TOTAL VOTES
                  </Utils.Text>
                  <Utils.VerticalSpacer />
                  <Utils.Text size='small'>
                    {formatNumber(totalVotes)}
                  </Utils.Text>
                </Utils.View>
                <Utils.View align='center'>
                  <Utils.Text size='tiny' weight='500' secondary>
                    VOTES AVAILABLE
                  </Utils.Text>
                  <Utils.VerticalSpacer />
                  <Utils.Text
                    size='small'
                    style={{
                      color: `${totalRemaining < 0 ? '#dc3545' : '#fff'}`
                    }}
                  >
                    {formatNumber(totalRemaining)}
                  </Utils.Text>
                </Utils.View>
              </Header>
            </GrowIn>
          )}
        {votesError.length > 0 && (
          <FadeIn name='error'>
            <Utils.Text align='center' marginY={20}>
              {votesError}
            </Utils.Text>
          </FadeIn>
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
            navigation={this.props.navigation}
          />
        )}
        <Utils.View paddingX={'small'} paddingY={'small'}>
          <Utils.FormInput
            autoCapitalize='none'
            autoCorrect={false}
            underlineColorAndroid='transparent'
            onChangeText={text => this._onSearch(text, 'search')}
            placeholder='Search'
            placeholderTextColor='#fff'
            marginBottom={0}
            marginTop={0}
          />
        </Utils.View>
        <Utils.View>
          <FadeIn name='candidates'>
            <FlatList
              keyExtractor={item => item.address}
              data={this.state.voteList}
              renderItem={this._renderRow}
              onEndReachedThreshold={0.5}
              onEndReached={this._loadMoreCandidates}
              onRefresh={this._refreshCandidates}
              refreshing={refreshing || loadingList}
              removeClippedSubviews
            />
          </FadeIn>
        </Utils.View>
      </Utils.Container>
    )
  }
}

export default props => (
  <Context.Consumer>
    {context => <VoteScene context={context} {...props} />}
  </Context.Consumer>
)
