import { Platform } from 'react-native'

export const DeeplinkURL = Platform.OS === 'ios' ? `tronvault://` : `tronvault://tronvault/`
