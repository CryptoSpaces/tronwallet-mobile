import RNTron from 'react-native-tron'
import DeviceInfo from 'react-native-device-info'
import { AsyncStorage } from 'react-native'

import getSecretsStore from '../store/secrets'
import { resetWalletData } from './userAccountUtils'
import Client from '../services/client'

export const createUserKeyPair = async (pin, oneSignalId) => {
  const mnemonic = await RNTron.generateMnemonic()
  await generateKeypair(pin, oneSignalId, mnemonic, true)
  AsyncStorage.setItem('@TronWallet:useStatus', 'active')
}

export const recoverUserKeypair = async (pin, oneSignalId, mnemonic, randomlyGenerated = false) => {
  await RNTron.validateMnemonic(mnemonic)
  await generateKeypair(pin, oneSignalId, mnemonic, randomlyGenerated)
  AsyncStorage.setItem('@TronWallet:useStatus', 'active')
}

const generateKeypair = async (pin, oneSignalId, mnemonic, randomlyGenerated) => {
  const generatedKeypair = await RNTron.generateKeypair(mnemonic, 0, false)
  generatedKeypair.mnemonic = mnemonic
  generatedKeypair.id = DeviceInfo.getUniqueID()
  generatedKeypair.confirmed = !randomlyGenerated
  const secretsStore = await getSecretsStore(pin)
  Client.registerDeviceForNotifications(oneSignalId, generatedKeypair.address)
  await secretsStore.write(() =>
    secretsStore.create('UserSecret', generatedKeypair, true)
  )
  await resetWalletData()
}

export const confirmSecret = async pin => {
  try {
    const secretsStore = await getSecretsStore(pin)
    const deviceId = await DeviceInfo.getUniqueID()
    secretsStore.write(() => {
      const secret = secretsStore.objects('UserSecret')
      secret.confirmed = true
      secretsStore.create('UserSecret', { id: deviceId, confirmed: true }, true)
    })
  } catch (error) {
    throw error
  }
}
const emptySecret = {
  address: null,
  mnemonic: null,
  privateKey: null,
  publicKey: null
}

export const getUserSecrets = async pin => {
  try {
    const secretsStore = await getSecretsStore(pin)
    const secretsObject = secretsStore
      .objects('UserSecret')
      .map(item => Object.assign(item, {}))
    if (secretsObject.length) return secretsObject[0]
    return emptySecret
  } catch (error) {
    throw error
  }
}
