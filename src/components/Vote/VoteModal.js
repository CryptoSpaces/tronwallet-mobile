import React from 'react'
import { Modal, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import tl from '../../utils/i18n'
import formatUrl from '../../utils/formatUrl'
import { formatNumber } from '../../utils/numberUtils'
import { Colors } from '../DesignSystem'
import ButtonGradient from '../ButtonGradient'
import * as Utils from '../Utils'

const voteKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

const VoteModal = ({
  modalVisible,
  closeModal,
  candidateUrl,
  currVoteAmount = 0,
  addNumToVote,
  removeNumFromVote,
  acceptCurrentVote,
  totalRemaining,
  navigation
}) => {
  const convertedAmount = Number(currVoteAmount)
  const notEnoughTrx = convertedAmount > totalRemaining || totalRemaining === 0
  const amountIsZero = convertedAmount === 0
  const disableSubmit = amountIsZero || notEnoughTrx

  return (
    <Modal
      animationType='slide'
      transparent={false}
      visible={modalVisible}
      onRequestClose={closeModal}
      style={{ backgroundColor: 'red' }}
    >
      <Utils.Container>
        <Utils.Content flex={1}>
          <Utils.ButtonWrapper alignSelf='flex-end' onPress={closeModal}>
            <Ionicons name='ios-close' size={40} color={Colors.primaryText} />
          </Utils.ButtonWrapper>
          <View>
            <Utils.Text size='medium' secondary>
              {formatUrl(candidateUrl)}
            </Utils.Text>
            <Utils.Text size='large' align='right'>
              {currVoteAmount.length < 1 ? '0' : formatNumber(currVoteAmount)}
            </Utils.Text>
            <Utils.VerticalSpacer />
            {notEnoughTrx && (
              <React.Fragment>
                <Utils.Text>
                  {totalRemaining ? tl.t('components.vote.freezeOrLower') : tl.t('components.vote.freezeToContinue')}
                </Utils.Text>
                <Utils.VerticalSpacer size='medium' />
                <ButtonGradient
                  onPress={() => {
                    closeModal()
                    navigation.navigate('Freeze')
                  }}
                  text={tl.t('components.vote.freeze')}
                  size='medium'
                  width={100}
                />
              </React.Fragment>
            )}
          </View>
        </Utils.Content>
        {totalRemaining !== null && (
          <Utils.Content>
            <Utils.Text secondary align='right'>
              {tl.t('components.vote.totalVotes')} ${totalRemaining}`
            </Utils.Text>
          </Utils.Content>
        )}
        <Utils.NumPadWrapper>
          {voteKeys.map((voteKey, index) => {
            return (
              <Utils.NumKeyWrapper key={voteKey}>
                <Utils.NumKey onPress={() => addNumToVote(voteKey)}>
                  <Utils.Text>{voteKey}</Utils.Text>
                </Utils.NumKey>
              </Utils.NumKeyWrapper>
            )
          })}
          <Utils.NumKeyWrapper>
            <Utils.NumKey onPress={removeNumFromVote} double>
              <Ionicons
                name='ios-arrow-round-back'
                size={24}
                color={Colors.primaryText}
              />
              <Utils.HorizontalSpacer />
              <Utils.Text>{tl.t('components.vote.delete')}</Utils.Text>
            </Utils.NumKey>
          </Utils.NumKeyWrapper>
          <Utils.VerticalSpacer />
          <Utils.NumKeyWrapper>
            <ButtonGradient
              onPress={acceptCurrentVote}
              disabled={disableSubmit}
              text={tl.t('components.vote.set')}
            />
          </Utils.NumKeyWrapper>
        </Utils.NumPadWrapper>
      </Utils.Container>
    </Modal>
  )
}

export default VoteModal
