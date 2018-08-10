import React from 'react'

import tl from '../../utils/i18n'
import DetailRow from './detailRow'
import { ONE_TRX } from '../../services/client'

const dic = {
  'contractType': tl.t('submitTransaction.dic.contractType'),
  'ownerAddress': tl.t('submitTransaction.dic.ownerAddress'),
  'toAddress': tl.t('submitTransaction.dic.toAddress'),
  'ParticipateAssetIssueContract': tl.t('submitTransaction.dic.participateAssetIssueContract'),
  'TransferAssetContract': tl.t('submitTransaction.dic.transferAssetContract'),
  'TransferContract': tl.t('submitTransaction.dic.transferContract'),
  'UnfreezeBalanceContract': tl.t('submitTransaction.dic.unfreezeBalanceContract'),
  'FreezeBalanceContract': tl.t('submitTransaction.dic.freezeBalanceContract'),
  'AssetIssueContract': tl.t('submitTransaction.dic.assetIssueContract'),
  'VoteWitnessContract': tl.t('submitTransaction.dic.voteWitnessContract'),
  'frozenDuration': tl.t('submitTransaction.dic.frozenDuration'),
  'frozenBalance': tl.t('submitTransaction.dic.frozenBalance')
}

export const errorDic = {
  'CONTRACT_VALIDATE_ERROR': tl.t('submitTransaction.errorDic.contractValidate'),
  'SIGERROR': tl.t('submitTransaction.errorDic.signature'),
  'DUP_TRANSACTION_ERROR': tl.t('submitTransaction.errorDic.duplicate'),
  'CONTRACT_EXE_ERROR': tl.t('submitTransaction.errorDic.contractValidateCee'),
  'BANDWITH_ERROR': tl.t('submitTransaction.errorDic.bandwith'),
  'TAPOS_ERROR': tl.t('submitTransaction.errorDic.contractValidateTapos'),
  'TOO_BIG_TRANSACTION_ERROR': tl.t('submitTransaction.errorDic.tooBig'),
  'TRANSACTION_EXPIRATION_ERROR': tl.t('submitTransaction.errorDic.expiration'),
  'SERVER_BUSY': tl.t('submitTransaction.errorDic.serverBusy')
}

export const firstLetterCapitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
const toReadableField = (field) => {
  const translated = dic.hasOwnProperty(field) ? dic[field] : field
  return isNaN(translated) ? translated.toUpperCase() : translated
}
export const translateError = (errorMessage) => (
  errorDic[errorMessage] ? errorDic[errorMessage] : errorMessage
)
export default (contracts, tokenAmount) => {
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
          text={contracts[0][ctr]}
          address
        />
      )
    } else if (ctr === 'amount' || ctr === 'frozenBalance') {
      const contractId = Number(contracts[0]['contractTypeId'])
      const amountDivider = contractId === 1 || contractId === 11 ? ONE_TRX : 1
      const textToDisplay = contractId === 9 ? tokenAmount : contracts[0][ctr] / amountDivider
      contractsRows.push(
        <DetailRow
          key={ctr}
          title={toReadableField(ctr)}
          text={textToDisplay}
        />
      )
    } else if (ctr === 'votes') {
      const totalVotes = contracts[0][ctr].length
      contractsRows.push(
        <DetailRow key={ctr} title={toReadableField(tl.t('submitTransaction.totalVotes'))} text={totalVotes} />
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
