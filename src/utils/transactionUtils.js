import RNTron from 'react-native-tron'
import { Linking } from 'react-native'
import { getUserSecrets } from '../utils/secretsUtils'
import { TronVaultURL } from './deeplinkUtils'

export const signTransaction = async (pin, transactionUnsigned) => {
  try {
    const { privateKey } = await getUserSecrets(pin)
    const transactionSigned = await RNTron.signTransaction(
      privateKey,
      transactionUnsigned
    )
    return transactionSigned
  } catch (error) {
    throw new Error(error)
  }
}

export const openDeepLink = async dataToSend => {
  const url = `${TronVaultURL}auth/${dataToSend}`
  return Linking.openURL(url)
}
