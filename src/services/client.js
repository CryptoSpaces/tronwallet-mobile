import axios from 'axios'

export const ONE_TRX = 1000000

class ClientWallet {
  constructor (opt = null) {
    this.api = 'https://api.tronscan.org/api'
    this.devApi = 'https://tronnotifier-dev.now.sh/v1/wallet'
    this.prodApi = 'https://tronnotifier.now.sh/v1/wallet'
  }

  async getTotalVotes () {
    const { data } = await axios.get(`${this.api}/vote/current-cycle`)
    const totalVotes = data.total_votes
    const candidates = data.candidates
    return { totalVotes, candidates }
  }

  async postVotes (votes) {
    const body = {
      from: '27khY3PteHw69bcfxUVUhFu373UWxJgiycV',
      votes
    }
    console.log('>>> ', body)
    // const data = await axios.post(`${this.devApi}/vote`, body);
  }
}

export default new ClientWallet()
