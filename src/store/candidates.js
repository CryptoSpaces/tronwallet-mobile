import Realm from 'realm'

const CandidateSchema = {
  name: 'Candidate',
  primaryKey: 'address',
  properties: {
    address: 'string',
    name: 'string',
    change_cycle: 'int',
    change_day: 'int',
    hasPage: 'bool',
    url: 'string',
    votes: 'int',
    rank: 'int'
  }
}

export default async () =>
  Realm.open({
    path: 'Realm.candidates',
    schema: [CandidateSchema],
    schemaVersion: 2
  })
