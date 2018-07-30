import Realm from 'realm'

const VoteSchema = {
  name: 'Vote',
  properties: {
    voteAddress: 'string',
    voteCount: 'int'
  }
}

const ContractDataSchema = {
  name: 'ContractData',
  properties: {
    amount: 'int?',
    frozenBalance: 'int?',
    transferFromAddress: 'string?',
    transferToAddress: 'string?',
    tokenName: 'string?',
    votes: 'Vote[]',
    description: 'string?',
    startTime: 'int?',
    endTime: 'int?',
    totalSupply: 'int?',
    unityValue: 'int?'
  }
}

const TransactionSchema = {
  name: 'Transaction',
  primaryKey: 'id',
  properties: {
    id: 'string',
    timestamp: 'int',
    type: 'string',
    block: 'int?',
    ownerAddress: 'string',
    contractData: 'ContractData',
    confirmed: 'bool?',
    notified: { type: 'bool', default: true }
  }
}

export default async () =>
  Realm.open({
    path: 'Realm.transactions',
    schema: [TransactionSchema, ContractDataSchema, VoteSchema],
    schemaVersion: 15,
    migration: (oldRealm, newRealm) => {
      if (oldRealm.schemaVersion < 15) {
        const transactions = newRealm.objects('Transaction')

        for (let i = 0; i < transactions.length; i++) {
          transactions[i].notified = true
        }
      }
    }
  })
