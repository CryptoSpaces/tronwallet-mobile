
import { Auth } from 'aws-amplify'
import { getUserSecrets } from './secretsUtils'
import getBalanceStore from '../store/balance'
import getTransactionStore from '../store/transactions'

//TODO
//Put all Account Info related functions Here
//e.g. getBalance, getFreezeAmount, getVotes ...

const getAwsPublicKey = async () => {
    try {
        const authenticatedUser = await Auth.currentAuthenticatedUser()
        const userAttributes = await Auth.userAttributes(authenticatedUser)
        const user = {}
        for (const attribute of userAttributes) {
            user[attribute.Name] = attribute.Value
        }
        return user['custom:publickey']
    } catch (error) {
        if (error.code === 'UserNotFoundException' || error === 'not authenticated') {
            return null
        } else {
            throw error
        }
    }
}
const getUserAttributes = async () => {
    try {
        const authenticatedUser = await Auth.currentAuthenticatedUser()
        const userAttributes = await Auth.userAttributes(authenticatedUser)
        const user = {}
        for (const attribute of userAttributes) {
            user[attribute.Name] = attribute.Value
        }
        return user
    } catch (error) {
        if (error.code === 'UserNotFoundException' || error === 'not authenticated') {
            throw new Error(error.message || error)
        }
    }
}

export const getUserPublicKey = async () => {
    try {
        const { address } = await getUserSecrets()
        if (address) return address

        //If somehow the user's address is not saved in realm we fetch from aws
        const awsAddress = await getAwsPublicKey()
        return awsAddress
    } catch (error) {
        throw new Error(error.message || error)
    }
}

export const checkPublicKeyReusability = async () => {
    try {
        const { address } = await getUserSecrets()
        const awsAddress = await getAwsPublicKey()
        //Return true or false if user's address/account is already saved in realm
        return address == awsAddress

    } catch (error) {
        throw error
    }
}

export const resetWalletData = async () => {
    try {
        const [balanceStore, transactionStore] = await Promise.all([getBalanceStore(), getTransactionStore()])

        const allBalances = balanceStore.objects('Balance')
        await balanceStore.write(() => balanceStore.delete(allBalances))

        const allTransactions = transactionStore.objects('Transaction')
        await transactionStore.write(() => transactionStore.delete(allTransactions))

    } catch (error) {
        throw error
    }
}