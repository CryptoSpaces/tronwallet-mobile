import React, { Component } from 'react'
import { Modal, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'

// Design
import { Colors, ButtonSize } from '../DesignSystem'
import * as Utils from '../Utils'
import NavigationHeader from '../Navigation/Header'
import RankVote from './list/LeftBadge'
import ClearVotes from '../ClearButton'

// Utils
import tl from '../../utils/i18n'
import formatUrl from '../../utils/formatUrl'
import { formatNumber } from '../../utils/numberUtils'
import ButtonGradient from '../ButtonGradient'

class ConfirmModal extends Component {
  state={
    loading: false
  }

  _onSubmit = async () => {
    const { closeModal, submitVotes } = this.props
    this.setState({loading: true})
    await submitVotes()
    closeModal()
  }

  _renderRow = ({ item, index, removeVote }) => {
    const { voteCount, url } = item
    return (
      <Utils.VoteRow>
        <Utils.Row justify='space-between' align='center'>
          <Utils.Row align='center'>
            <RankVote
              voted={voteCount && voteCount > 0}
              index={item.rank || index}
            />
            <Utils.Column>
              <Utils.Text size='smaller' secondary>
                {formatUrl(url)}
              </Utils.Text>
              <Utils.Text lineHeight={20} size='xsmall'>
                {tl.t('components.vote.yourVotes')} {formatNumber(item.voteCount)}
              </Utils.Text>
            </Utils.Column>
          </Utils.Row>
          <Utils.View>
            <TouchableOpacity onPress={() => removeVote(item.address)}>
              <Feather name='x' color={Colors.secondaryText} size={ButtonSize['small']} />
            </TouchableOpacity>
          </Utils.View>
        </Utils.Row>
      </Utils.VoteRow>
    )
  }

  render () {
    const {
      loading
    } = this.state
    const {
      modalVisible,
      closeModal,
      currentFullVotes,
      removeVote,
      clearVotes
    } = this.props
    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
        style={{ backgroundColor: Colors.background }}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
          <Utils.Container>
            <NavigationHeader
              title={tl.t('components.vote.myVotes')}
              onBack={closeModal}
              rightButton={<ClearVotes
                onPress={clearVotes}
              />}
              noBorder
            />
            <Utils.VerticalSpacer />
            <FlatList
              keyExtractor={item => item.address}
              data={currentFullVotes}
              renderItem={({item, index}) => this._renderRow({item, index, removeVote})}
              removeClippedSubviews
            />
            <Utils.VerticalSpacer size='small' />
            <Utils.View paddingX={'large'} paddingY={'medium'}>
              <ButtonGradient
                size='large'
                text={tl.t('components.vote.confirm')}
                font='bold'
                disabled={currentFullVotes.length <= 0 || loading}
                onPress={this._onSubmit}
              />
            </Utils.View>
          </Utils.Container>
        </SafeAreaView>
      </Modal>
    )
  }
}
export default ConfirmModal
