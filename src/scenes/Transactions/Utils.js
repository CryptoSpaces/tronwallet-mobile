import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import fontelloConfig from '../../assets/icons/config.json'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import { ONE_TRX } from '../../services/client'
import { formatNumber } from '../../utils/numberUtils'
const Icon = createIconSetFromFontello(fontelloConfig, 'tronwallet')

/* Functions that format the amount information to be displayed on screen. */
const transferAmount = ({ tokenName, amount }) => {
  if (tokenName === 'TRX') {
    return `${amount / ONE_TRX} ${tokenName}`
  }
  return `${amount} ${tokenName}`
}
const freezeAmount = ({frozenBalance}) => `${frozenBalance / ONE_TRX} TRX`
const participateAmount = ({amount, tokenName}, tokenPrice) => `${(amount / ONE_TRX) / (tokenPrice / ONE_TRX)} ${tokenName}`

/* Configures the object used to hidrate the render components with the proper
texts and icons. */
export const configureTransaction = (item, { topRow, addressRow, publicKey }) => {
  const { contractData, tokenPrice } = item
  const config = {}
  switch (item.type) {
    case 'Transfer':
    case 'Transfer Asset':
      config.topRow = () => topRow({
        amount: transferAmount(contractData),
        icon: {
          Type: Feather,
          name: publicKey === contractData.transferToAddress ? 'arrow-down-left' : 'arrow-up-right',
          size: 20
        },
        badgeColor: '#4a69e2'
      })
      config.addressRow = () => addressRow({
        from: contractData.transferFromAddress,
        to: contractData.transferToAddress
      })
      break
    case 'Freeze':
      config.topRow = () => topRow({
        amount: freezeAmount(contractData),
        icon: {
          Type: Ionicons,
          name: 'ios-snow',
          size: 20
        },
        badgeColor: '#25b9e3'
      })
      break
    case 'Unfreeze':
      config.topRow = () => topRow({
        icon: {
          Type: Ionicons,
          name: 'md-flame',
          size: 18
        },
        badgeColor: '#1f6986'
      })
      break
    case 'Vote':
      const userVotes = contractData.votes
      const totalVotes = Object.keys(userVotes).reduce((acc, curr) => acc + Number(userVotes[curr].voteCount), 0)
      config.topRow = () => topRow({
        amount: formatNumber(totalVotes),
        icon: {
          Type: Feather,
          name: 'thumbs-up',
          size: 16
        },
        badgeColor: '#bb2dc4'
      })
      break
    case 'Participate':
      config.topRow = () => topRow({
        amount: participateAmount(contractData, tokenPrice),
        icon: {
          Type: Icon,
          name: 'dollar,-currency,-money,-cash,-coin',
          size: 18
        },
        badgeColor: '#6442e4'
      })
      config.addressRow = () => addressRow({
        from: contractData.transferFromAddress
      })
      break
    case 'Create':
      config.topRow = () => topRow({
        amount: contractData.tokenName,
        icon: {
          Type: Icon,
          name: 'dollar,-currency,-money,-cash,-coin',
          size: 18
        },
        badgeColor: '#94c047'
      })
      break
    default:break
  }
  return config
}
