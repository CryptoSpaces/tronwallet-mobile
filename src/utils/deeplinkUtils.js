import { Platform } from 'react-native'

export const TronVaultURL = Platform.OS === 'ios' ? `tronvault://` : `tronvault://tronvault/`
export const TronMobileURL = Platform.OS === 'ios' ? `tronmobile://` : `tronmobile://tronmobile/`
export const MakeTronMobileURL = (route) => `${TronMobileURL}${route}`