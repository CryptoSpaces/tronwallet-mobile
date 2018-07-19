import RNTron from 'react-native-tron'
import DeviceInfo from 'react-native-device-info'
import { Alert, AsyncStorage } from 'react-native'

import getSecretsStore from '../store/secrets'
import { resetWalletData } from './userAccountUtils'

export const createUserKeyPair = async pin => {
  try {
    const mnemonic = await RNTron.generateMnemonic()
    await generateKeypair(pin, mnemonic, true)
    createUserKeyPairAlert()
    AsyncStorage.setItem('@TronWallet:isFirstTime', 'false') // anything that's not null works
  } catch (error) {
    throw error
  }
}

const createUserKeyPairAlert = () => {
  Alert.alert(
    'We created a secret list of words for you.',
    'We highly recommend that you write it down on paper to be able to recover it later.'
  )
}

export const recoverUserKeypair = async (pin, mnemonic, randomlyGenerated = false) => {
  try {
    await RNTron.validateMnemonic(mnemonic)
    await generateKeypair(pin, mnemonic, randomlyGenerated)
    AsyncStorage.setItem('@TronWallet:isFirstTime', 'false') // anything that's not null works
  } catch (error) {
    throw error
  }
}

const generateKeypair = async (pin, mnemonic, randomlyGenerated) => {
  const generatedKeypair = await RNTron.generateKeypair(mnemonic, 0, false)
  generatedKeypair.mnemonic = mnemonic
  generatedKeypair.id = DeviceInfo.getUniqueID()
  generatedKeypair.confirmed = !randomlyGenerated
  const secretsStore = await getSecretsStore(pin)
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
    console.log('secrets', secretsObject)
    if (secretsObject.length) return secretsObject[0]
    return emptySecret
  } catch (error) {
    throw error
  }
}
