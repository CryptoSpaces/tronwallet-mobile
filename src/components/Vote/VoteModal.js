import React from 'react'
import {Modal, TouchableOpacity, View, StyleSheet} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import formatUrl from '../../utils/formatUrl'

import {Colors} from '../DesignSystem'
import {Row, Text} from '../Utils'

const voteKeys = [0,1,2,3,4,5,6,7,8,9];

//REFACTOR STYLES
export default ({modalVisible, closeModal, candidateUrl, currVoteAmount, addNumToVote, removeNumFromVote, acceptCurrentVote}) => (
  <Modal
    animationType="slide"
    transparent={false}
    visible={modalVisible}
    onRequestClose={() => {
      alert('Modal has been closed.');
    }}
    style={{
      backgroundColor: 'red'
    }}
    >
    <View style={styles.background}>
      <Row style={{
        justifyContent: 'flex-end'
      }}>
        <TouchableOpacity onPress={closeModal}>
          <Ionicons name='ios-close' size={40} />
        </TouchableOpacity>
      </Row>
      <View>
        <Row>
          <Text>{formatUrl(candidateUrl)}</Text>
        </Row>
        <Row>
          <Text>{currVoteAmount.length < 1 ? '0' : currVoteAmount}</Text>
        </Row>
      </View>
      <Row style={{
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {voteKeys.map((voteKey, index) => {
          const lastKey = index + 1 === voteKeys.length;
          return (
          <TouchableOpacity
            onPress={() => addNumToVote(voteKey)}
            style={{
              marginHorizontal: 20,
              marginVertical: 20,
              paddingHorizontal: 20,
              paddingVertical: 20,
              borderWidth: 0.5,
              borderRadius: 4,
              borderColor: Colors.secondaryText
            }} 
            key={voteKey}
          >
            <Text style={{
              fontSize: 32
            }}>{voteKey}</Text>
          </TouchableOpacity>
          )
        })}
          <TouchableOpacity
            onPress={removeNumFromVote}
            style={{
              marginHorizontal: 20,
              marginVertical: 20,
              paddingHorizontal: 20,
              paddingVertical: 20,
              borderWidth: 0.5,
              borderRadius: 4,
              borderColor: Colors.secondaryText
            }} 
          >
            <Text style={{
              fontSize: 32
            }}>X</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={acceptCurrentVote}
            style={{
              marginHorizontal: 20,
              marginVertical: 20,
              paddingHorizontal: 20,
              paddingVertical: 20,
              borderWidth: 0.5,
              borderRadius: 4,
              borderColor: Colors.secondaryText
            }} 
          >
            <Text style={{
              fontSize: 32
            }}>GO</Text>
          </TouchableOpacity>
      </Row>
    </View>
  </Modal>
)

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.background
  }
})