import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tron Wallet</Text>
      <View style={{ marginTop: 50 }}>
        <Text style={styles.title}>Contributors</Text>
        <Text style={styles.label}>www.getty.io</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 10
  },
  title: {
    fontSize: 20,
    fontWeight: '700'
  },
  label: {
    fontSize: 15,
    fontWeight: '600'
  }
})

export default AboutScreen
