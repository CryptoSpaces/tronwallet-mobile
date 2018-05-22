import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import QRCode from 'react-native-qrcode'

class ReceiveScreen extends PureComponent {
  state = {}

  render () {
    const { width } = Dimensions.get('window')
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Select your account balance:
        </Text>
        <QRCode
          value={123456789}
          size={width * 0.7}
          fgColor='white'
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 16,
    color: '#2C2C2C',
    fontWeight: '700',
    padding: 30
  }
})

export default ReceiveScreen
