import React from 'react'
import { View, StyleSheet } from 'react-native'

import { Colors } from '../../components/DesignSystem'
import * as Utils from '../../components/Utils'

// TODO - Move to Utils this card style
const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    backgroundColor: Colors.lightBackground,
    borderColor: Colors.lightBackground,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginVertical: 0.5
  }
})

export default ({ title, text, address }) => (
  <View style={styles.card}>
    <Utils.Text secondary size='smaller'>
      {title}
    </Utils.Text>
    <Utils.Text size={address ? 'xsmall' : 'smaller'}>{text}</Utils.Text>
  </View>
)
