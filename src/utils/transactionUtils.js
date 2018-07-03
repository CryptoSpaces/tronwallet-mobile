import RNTron from 'react-native-tron'
import { getUserSecrets } from '../utils/secretsUtils'
import { TronVaultURL } from './deeplinkUtils'


export const signTransaction = async (transactionUnsigned) => {
    try {
        const { privateKey } = await getUserSecrets()
        const transactionSigned = await RNTron.signTransaction(privateKey, transactionUnsigned)
        return transactionSigned
    } catch (error) {
        throw new error(error)
    }
}

export const openDeepLink = async (dataToSend) => {
    const url = `${TronVaultURL}auth/${dataToSend}`
    return await Linking.openURL(url)
}