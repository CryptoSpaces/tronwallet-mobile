import axios from 'axios'
import { Auth } from 'aws-amplify'
export const ONE_TRX = 1000000

class ClientWallet {
  constructor (opt = null) {
    this.api = 'https://api.tronscan.org/api'
    this.notifier = 'https://tronnotifier-dev.now.sh/v1'
  }

  async getTotalVotes () {
    const { data } = await axios.get(`${this.api}/vote/current-cycle`)
    const totalVotes = data.total_votes
    const candidates = data.candidates
    return { totalVotes, candidates }
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
        throw new Error(error.message || error)
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
      const { data: { transaction } } = await axios.post(`${this.notifier}/wallet/transfer`, { to, from, token, amount })
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
    return balances
  }
}

export default new ClientWallet()
