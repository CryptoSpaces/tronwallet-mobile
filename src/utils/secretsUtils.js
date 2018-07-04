import RNTron from 'react-native-tron'
import DeviceInfo from 'react-native-device-info'

import getSecretsStore from '../store/secrets'
import Client from '../services/client'

export const createUserKeyPair = async () => {
    try {
        const mnemonic = await RNTron.generateMnemonic()
        await generateKeypair(mnemonic, true)
    } catch (error) {
        throw error
    }
}

export const recoverUserKeypair = async (mnemonic, randomlyGenerated = false) => {
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
    const SecretsStore = await getSecretsStore()
    await SecretsStore.write(() => SecretsStore.create('Secrets', generatedKeypair, true))
    await Client.setUserPk(generatedKeypair.address)
}

export const confirmSecret = async () => {
    try {
        const SecretsStore = await getSecretsStore()
        SecretsStore.write(() => {
            const secret = SecretsStore.objects('Secrets')
            secret.confirmed = true
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
        const SecretsStore = await getSecretsStore()
        const SecretsObject = SecretsStore.objects('Secrets').map(item => Object.assign(item, {}))
        if (SecretsObject.length) return SecretsObject[0]
        return emptySecret
    } catch (error) {
        throw error
    }
}