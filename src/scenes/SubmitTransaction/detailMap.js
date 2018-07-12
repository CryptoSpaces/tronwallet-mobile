import React from 'react'
import DetailRow from './detailRow'
import { ONE_TRX } from '../../services/client'

const dic = {
  'fronzeBalance': 'Frozen Balance',
  'contractType': 'Transaction Type',
  'ownerAddress': 'From',
  'toAddress': 'To',
  'ParticipateAssetIssueContract': 'Participate',
  'TransferAssetContract': 'Transfer',
  'TransferContract': 'Transfer',
  'FreezeBalanceContract': 'Freeze',
  'AssetIssueContract': 'Create',
  'VoteWitnessContract': 'Vote',
  'frozenDuration': 'Duration',
  'frozenBalance': 'Total to Freeze'
}
export const firstLetterCapitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
const truncateAddress = str => `${str.substring(0, 8)}...${str.substring(str.length - 8, str.length)}`
const toReadableField = (field) => {
  const translated = dic.hasOwnProperty(field) ? dic[field] : field
  return isNaN(translated) ? translated.toUpperCase() : translated
}

export default (contracts) => {
  const contractsRows = []
  for (const ctr in contracts[0]) {
    if (ctr === 'contractTypeId') {
      if (Number(contracts[0][ctr]) === 1) {
        contractsRows.push(<DetailRow
          key={'TOKEN'}
          title={toReadableField('TOKEN')}
          text={toReadableField('TRX')}
        />)
      }
      continue
    }

    if (ctr === 'ownerAddress' || ctr === 'toAddress' ||
      ctr === 'from' || ctr === 'to') {
      contractsRows.push(
        <DetailRow
          key={ctr}
          title={toReadableField(ctr)}
          text={truncateAddress(contracts[0][ctr])}
        />
      )
    } else if (ctr === 'amount' || ctr === 'frozenBalance') {
      const contractId = Number(contracts[0]['contractTypeId'])
      const amountDivider = contractId === 1 || contractId === 11 ? ONE_TRX : 1
      contractsRows.push(
        <DetailRow
          key={ctr}
          title={toReadableField(ctr)}
          text={contracts[0][ctr] / amountDivider}
        />
      )
    } else if (ctr === 'votes') {
      const totalVotes = contracts[0][ctr].reduce((prev, curr) => {
        return prev + curr.voteCount
      }, 0)
      contractsRows.push(
        <DetailRow key={ctr} title={toReadableField('Total Votes')} text={totalVotes} />
      )
    } else {
      contractsRows.push(
        <DetailRow
          key={ctr}
          title={toReadableField(ctr)}
          text={toReadableField(contracts[0][ctr])}
        />
      )
    }
  }

  return contractsRows
}
