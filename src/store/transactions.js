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
    confirmed: 'bool?'
  }
}

export default async () =>
  Realm.open({
    path: 'Realm.transactions',
    schema: [TransactionSchema, ContractDataSchema, VoteSchema],
    schemaVersion: 13
  })
