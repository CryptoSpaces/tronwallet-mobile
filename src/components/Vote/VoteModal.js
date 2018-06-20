import React from 'react'
import { Modal, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import formatUrl from '../../utils/formatUrl'

import { Colors } from '../DesignSystem'
import ButtonGradient from '../ButtonGradient'
import * as Utils from '../Utils'

const voteKeys = [1,2,3,4,5,6,7,8,9,0]

const VoteModal = ({
  modalVisible,
  closeModal,
  candidateUrl,
  currVoteAmount,
  addNumToVote,
  removeNumFromVote,
  acceptCurrentVote,
  totalRemaining
}) => {
  const errorCheck = currVoteAmount > totalRemaining

  const formatAmount = (amount) => amount
    .split('')
    .reverse()
    .map((char, index) => (index + 1) % 3 === 0 ? `,${char}` : char)
    .reverse()
    .map((char, index) => (index === 0 && char[0] === ',') ? char.slice(1, 2) : char)
    .join('')

  return  (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        closeModal();
      }}
      >
      <Utils.Container>
        <Utils.Content flex={1}>
          <Utils.ButtonWrapper alignSelf='flex-end' onPress={closeModal}>
            <Ionicons name='ios-close' size={40} color={Colors.primaryText} />
          </Utils.ButtonWrapper>
          <View>
            <Utils.Text size='medium' secondary>{formatUrl(candidateUrl)}</Utils.Text>
            <Utils.Text size='large' align='right'>{currVoteAmount.length < 1 ? '0' : formatAmount(currVoteAmount)}</Utils.Text>
            {errorCheck && (
              <Utils.Text>
                You do not have enough frozen TRX to place this vote amount.
              </Utils.Text>
            )}
          </View>
        </Utils.Content>
        {totalRemaining !== null && (
          <Utils.Content>
            <Utils.Text secondary align='right'>
              {`Total votes available: ${totalRemaining}`}
            </Utils.Text>
          </Utils.Content>
        )}
        <Utils.NumPadWrapper>
          {voteKeys.map((voteKey, index) => {
            const lastKey = index + 1 === voteKeys.length;
            return (
              <Utils.NumKeyWrapper key={voteKey}>
                <Utils.NumKey
                  onPress={() => addNumToVote(voteKey)} 
                >
                  <Utils.Text>{voteKey}</Utils.Text>
                </Utils.NumKey>
              </Utils.NumKeyWrapper>
            )
          })}
          <Utils.NumKeyWrapper double>
            <Utils.NumKey onPress={removeNumFromVote} double>
              <Ionicons name="ios-arrow-round-back" size={24} color={Colors.primaryText} />
              <Utils.HorizontalSpacer />
              <Utils.Text>DELETE</Utils.Text>
            </Utils.NumKey>
          </Utils.NumKeyWrapper>
          <Utils.VerticalSpacer />
          <Utils.NumKeyWrapper>
            <ButtonGradient
              onPress={acceptCurrentVote}
              disabled={errorCheck} 
              text="SUBMIT"
            />
          </Utils.NumKeyWrapper>
        </Utils.NumPadWrapper>
      </Utils.Container>
    </Modal>
  )
}

export default VoteModal
