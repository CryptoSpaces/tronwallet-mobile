import Realm from 'realm'

const FrozenItemSchema = {
  name: 'FrozenItem',
  properties: {
    days: 'int',
    amount: 'int'
  }
}

const AssetsSchema = {
  name: 'Asset',
  primaryKey: 'id',
  properties: {
    price: 'int',
    issued: 'int',
    issuedPercentage: 'float?',
    available: 'int',
    availableSupply: 'int',
    remaining: 'int',
    remainingPercentage: 'float?',
    percentage: 'float?',
    frozenPercentage: 'float?',
    id: 'string',
    block: 'int',
    transaction: 'string',
    ownerAddress: 'string',
    name: 'string',
    abbr: 'string',
    totalSupply: 'int',
    trxNum: 'int',
    num: 'int',
    startTime: { type: 'int', indexed: true },
    endTime: { type: 'int', indexed: true },
    voteScore: 'int',
    description: 'string',
    url: 'string',
    dateCreated: 'int'
  }
}

export default async () =>
  Realm.open({
    path: 'Realm.assets',
    schema: [AssetsSchema, FrozenItemSchema],
    schemaVersion: 9,
    migration: (oldRealm, newRealm) => {
      if (oldRealm.schemaVersion < 9) {
        const oldObjects = oldRealm.objects('Asset')
        const newObjects = newRealm.objects('Asset')

        for (let i = 0; i < oldObjects.length; i++) {
          newObjects[i].frozen = null
        }
      }
    }
  })
