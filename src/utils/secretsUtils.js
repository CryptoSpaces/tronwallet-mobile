import RNTron from 'react-native-tron'
import DeviceInfo from 'react-native-device-info'
import { Alert } from 'react-native'

import getSecretsStore from '../store/secrets'
import Client from '../services/client'
import { resetWalletData } from './userAccountUtils'

export const createUserKeyPair = async () => {
  try {
    const mnemonic = await RNTron.generateMnemonic()
    await generateKeypair(mnemonic, true)
    createUserKeyPairAlert()
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

export const recoverUserKeypair = async (
  mnemonic,
  randomlyGenerated = false
) => {
  try {
    await RNTron.validateMnemonic(mnemonic)
    await generateKeypair(mnemonic, randomlyGenerated)
  } catch (error) {
    throw error
  }
}

const generateKeypair = async (mnemonic, randomlyGenerated) => {
  const generatedKeypair = await RNTron.generateKeypair(mnemonic, 0, false)
  generatedKeypair.mnemonic = mnemonic
  generatedKeypair.id = DeviceInfo.getUniqueID()
  generatedKeypair.confirmed = !randomlyGenerated
  const secretsStore = await getSecretsStore()
  await secretsStore.write(() =>
    secretsStore.create('Secrets', generatedKeypair, true)
  )
  await Client.setUserPk(generatedKeypair.address)
  await resetWalletData()
}

export const confirmSecret = async () => {
  try {
    const secretsStore = await getSecretsStore()
    const deviceId = await DeviceInfo.getUniqueID()
    secretsStore.write(() => {
      const secret = secretsStore.objects('Secrets')
      secret.confirmed = true
      secretsStore.create('Secrets', { id: deviceId, confirmed: true }, true)
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

export const getUserSecrets = async () => {
  try {
    const secretsStore = await getSecretsStore()
    const secretsObject = secretsStore
      .objects('Secrets')
      .map(item => Object.assign(item, {}))
    if (secretsObject.length) return secretsObject[0]
    return emptySecret
  } catch (error) {
    throw error
  }
}
