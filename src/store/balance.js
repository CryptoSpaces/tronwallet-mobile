import Realm from 'realm'

const BalanceSchema = {
  name: 'Balance',
  primaryKey: 'name',
  properties: {
    balance: 'float',
    name: 'string'
  }
}

export default new Realm({
  path: 'Realm.balance',
  schema: [BalanceSchema],
  schemaVersion: 0
})
