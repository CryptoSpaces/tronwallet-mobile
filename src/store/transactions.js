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
    votes: 'Vote[]'
  }
}

const TransactionSchema = {
  name: 'Transaction',
  primaryKey: 'id',
  properties: {
    id: 'string',
    timestamp: 'int',
    type: 'string',
    ownerAddress: 'string',
    contractData: 'ContractData',
    confirmed: 'bool?'
  }
}

export default async () =>
  Realm.open({
    path: 'Realm.transactions',
    schema: [TransactionSchema, ContractDataSchema, VoteSchema],
    schemaVersion: 10
  })
