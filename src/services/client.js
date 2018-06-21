import axios from 'axios'
import { Auth } from 'aws-amplify'
export const ONE_TRX = 1000000

class ClientWallet {
  constructor (opt = null) {
    this.api = 'https://testapi.tronscan.org/api'
    this.notifier = 'https://tronnotifier-dev.now.sh/v1/wallet'
  }

  async getTotalVotes () {
    const { data } = await axios.get(`${this.api}/vote/current-cycle`)
    const totalVotes = data.total_votes
    const candidates = data.candidates
    return { totalVotes, candidates }
  }

  async postVotes (votes) {
    const owner = await this.getPublicKey()
    const body = {
      from: owner,
      votes
    }
    const { data: { transaction } } = await axios.post(`${this.notifier}/vote`, body)
    return transaction
  }

  getUserAttributes = async () => {
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
        throw new Error(error.message || error) // TODO redirect to login screen
      }
    }
  };

  getPublicKey = async () => {
    try {
      const userAttr = await this.getUserAttributes()
      return userAttr['custom:publickey']
    } catch (error) {
      throw new Error(error.message || error)
    }
  };

  setUserPk = async (publickey) => {
    const user = await Auth.currentAuthenticatedUser()
    return Auth.updateUserAttributes(user, {
      'custom:publickey': publickey
    })
  };

  async getTransactionDetails (tx) {
    try {
      const { data: { transaction } } = await axios.post(`${this.api}/transaction?dry-run`, {
        transaction: tx
      })
      return transaction
    } catch (error) {
      throw new Error(error.message || error)
    }
  }

  async getTransactionString ({ to, from, token, amount }) {
    try {
      const { data: { transaction } } = await axios.post(`${this.notifier}/transfer`, { to, from, token, amount })
      return transaction
    } catch (error) {
      throw new Error(error.message || error)
    }
  }

  async submitTransaction (tx) {
    try {
      const { data } = await axios.post(
        `${this.api}/transaction`,
        { transaction: tx }
      )
      return data
    } catch (error) {
      throw new Error(error.message || error)
    }
  }

  async getBalances () {
    const owner = await this.getPublicKey()
    const { data: { balances } } = await axios.get(`${this.api}/account/${owner}`)
    const sortedBalances = balances.sort((a, b) => (Number(b.balance) - Number(a.balance)))
    return sortedBalances
  }

  async getFreeze () {
    const owner = await this.getPublicKey()
    const { data: { frozen, bandwidth, balances } } = await axios.get(`${this.api}/account/${owner}`)
    return { ...frozen, total: frozen.total / ONE_TRX, bandwidth, balances }
  }

  async getUserVotes () {
    const owner = await this.getPublicKey()
    const { data: { votes } } = await axios.get(`${this.api}/account/${owner}/votes`)
    return votes
  }

  async freezeToken (amount) {
    const from = await this.getPublicKey()
    const { data: { transaction } } = await axios.post(`${this.notifier}/freeze`, { from, amount, duration: '3' })

    return transaction
  }
  async getTokenList () {
    try {
      const { data: { data } } = await axios.get(`${this.api}/token?sort=-name&start=0&status=ico`)
      return data
    } catch (error) {
      throw new Error(error.message || error)
    }
  }

  async getTransactionList () {
    const owner = await this.getPublicKey()
    const tx = () => axios.get(`${this.api}/transaction?sort=-timestamp&limit=50&address=${owner}`)
    const tf = () => axios.get(`${this.api}/transfer?sort=-timestamp&limit=50&address=${owner}`)
    const transactions = await Promise.all([tx(), tf()])
    const txs = transactions[0].data.data.filter(d => d.contractType !== 1)
    const trfs = transactions[1].data.data.map(d => ({ ...d, contractType: 1, ownerAddress: owner }))
    let sortedTxs = [...txs, ...trfs].sort((a, b) => (b.timestamp - a.timestamp))
    sortedTxs = sortedTxs.map(t => ({
      type: this.getContractType(t.contractType),
      ...t
    }))
    return sortedTxs
  }

  getContractType = (number) => {
    switch (number) {
      case 1: return 'Transfer'
      case 2: return 'Transfer Asset'
      case 4: return 'Vote'
      case 6: return 'Create'
      case 9: return 'Participate'
      case 11: return 'Freeze'
      case 12: return 'Unfreeze'
      default: return 'Unregistred Name'
    }
  }
}

export default new ClientWallet()
