import { Platform } from 'react-native'

export const DeeplinkURL = () => {
  if (Platform.OS === 'ios') {
    return `tronvault://`
  } else {
    return `tronvault://tronvault`
  }
}
