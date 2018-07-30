import RNTron from 'react-native-tron'
import { Linking } from 'react-native'

import { getUserSecrets } from './secretsUtils'
import { TronVaultURL } from './deeplinkUtils'
import getTransactionStore from '../store/transactions'
import Client from '../services/client'

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

export const updateTransactions = async (pin) => {
  const transactions = await Client.getTransactionList(pin)
  const store = await getTransactionStore()
  store.write(() =>
    transactions.map(item => {
      const transaction = {
        id: item.hash,
        type: item.type,
        block: item.block,
        contractData: item.contractData,
        ownerAddress: item.ownerAddress,
        timestamp: item.timestamp,
        confirmed: true
      }
      if (item.type === 'Transfer') {
        transaction.id = item.transactionHash
        transaction.contractData = {
          transferFromAddress: item.transferFromAddress,
          transferToAddress: item.transferToAddress,
          amount: item.amount,
          tokenName: item.tokenName
        }
      }
      if (item.type === 'Create') {
        transaction.contractData = {
          ...transaction.contractData,
          tokenName: item.contractData.name,
          unityValue: item.contractData.trxNum
        }
      }
      if (item.type === 'Participate') {
        transaction.contractData = {
          ...transaction.contractData,
          transferFromAddress: item.contractData.toAddress
        }
      }

      store.create('Transaction', transaction, true)
    })
  )
}

export const openDeepLink = async dataToSend => {
  const url = `${TronVaultURL}auth/${dataToSend}`
  return Linking.openURL(url)
}
