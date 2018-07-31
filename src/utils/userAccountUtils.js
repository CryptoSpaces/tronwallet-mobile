import { AsyncStorage } from 'react-native'

import getBalanceStore from '../store/balance'
import getTransactionStore from '../store/transactions'
import getAssetsStore from '../store/assets'
import getCandidatesStore from '../store/candidates'

import NodesIp from '../utils/nodeIp'
// TODO
// Put all Account Info related functions Here
// e.g. getBalance, getFreezeAmount, getVotes ...

export const resetWalletData = async () => {
  try {
    const [balanceStore, transactionStore] = await Promise.all([
      getBalanceStore(),
      getTransactionStore()
    ])

    const allBalances = balanceStore.objects('Balance')
    await balanceStore.write(() => balanceStore.delete(allBalances))

    const allTransactions = transactionStore.objects('Transaction')
    await transactionStore.write(() => transactionStore.delete(allTransactions))
  } catch (error) {
    throw error
  }
}

export const resetListsData = async () => {
  try {
    const [assetsStore, candidatesStore] = await Promise.all([
      getAssetsStore(),
      getCandidatesStore()
    ])

    const assetsList = assetsStore.objects('Asset')
    await assetsStore.write(() => assetsStore.delete(assetsList))

    const candidateList = candidatesStore.objects('Candidate')
    await candidatesStore.write(() => candidatesStore.delete(candidateList))
  } catch (error) {
    throw error
  }
}

export const restartAllWalletData = async () => {
  try {
    await Promise.all([
      resetWalletData(),
      resetListsData(),
      NodesIp.switchTestnet(false),
      AsyncStorage.setItem('@TronWallet:useStatus', 'reset')
    ])
  } catch (error) {
    throw error
  }
}
