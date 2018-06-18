import React from 'react'
import {Modal, Text, TouchableOpacity, View} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import {Row} from '../Utils'

export default ({modalVisible, closeModal}) => (
  <View>
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        alert('Modal has been closed.');
      }}>
      <View>
        <Row>
          <TouchableOpacity onPress={closeModal}>
            <Ionicons name='ios-close' size={40} />
          </TouchableOpacity>
        </Row>
          {/* <TouchableHighlight
            onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}>
            <Text>Hide Modal</Text>
          </TouchableHighlight> */}
      </View>
    </Modal>
  </View>
)