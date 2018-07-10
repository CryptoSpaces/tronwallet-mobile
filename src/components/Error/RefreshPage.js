import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const RefreshPage = ({ refresh }) => (
  <TouchableOpacity onPress={refresh}>
    <Ionicons name='ios-close' size={40} color='#ffffff' />
    <Text>Refresh Page</Text>
  </TouchableOpacity>
)

export default RefreshPage
