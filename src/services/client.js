import axios from 'axios'

export const ONE_TRX = 1000000

class ClientWallet {
  constructor (opt = null) {
    this.api = 'https://api.tronscan.org/api'
  }

  async getTotalVotes () {
    const { data } = await axios.get(`${this.api}/vote/current-cycle`)
    const totalVotes = data.total_votes
    const candidates = data.candidates
    return { totalVotes, candidates }
  }
}

export default new ClientWallet()
