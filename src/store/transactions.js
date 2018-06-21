import Realm from 'realm'

const TransactionSchema = {
  name: 'Transaction',
  primaryKey: 'id',
  properties: {
    id: 'string',
    amount: 'float',
    block: 'int',
    contractType: 'int',
    ownerAddress: 'string',
    timestamp: 'int',
    tokenName: 'string',
    transactionHash: 'string',
    transferFromAddress: 'string',
    transferToAddress: 'string',
    type: 'string'
  }
}

export default new Realm({
  path: 'Realm.transactions',
  schema: [TransactionSchema],
  schemaVersion: 5
})
