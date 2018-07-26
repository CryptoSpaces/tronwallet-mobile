import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import fontelloConfig from '../../assets/icons/config.json'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import { formatNumber } from '../../utils/numberUtils'
import { ONE_TRX } from '../../services/client'
const Icon = createIconSetFromFontello(fontelloConfig, 'tronwallet')

export const transferAmount = (data) => {
  const amount = data.tokenName === 'TRX'
    ? data.amount / ONE_TRX
    : data.amount
  return `${Number(amount) > 1 ? formatNumber(amount) : amount} ${data.tokenName}`
}

const freezeAmount = (item) => `${item.contractData.frozenBalance / ONE_TRX} TRX`
const participateAmount = (item) => `${item.contractData.amount / ONE_TRX} ${item.tokenName}`

/* Configures the object used to hidrate the render components with the proper
texts and icons. */
export const configureTransaction = (item, { topRow, addressRow }, config) => {
  const { contractData } = item

  switch (item.type) {
    case 'Transfer':
      config.topRow = () => topRow({
        amount: transferAmount(contractData),
        icon: {
          Type: Feather,
          name: 'arrow-up-right',
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
        amount: freezeAmount(item),
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
      config.topRow = () => topRow({
        amount: item.contractData.votes.length,
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
        amount: participateAmount(item),
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
        amount: '94.00 TRX',
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
