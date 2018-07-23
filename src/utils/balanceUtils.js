export const orderBalances = (balances) => {
  let orderedBalances = []
  balances.forEach((balance) => {
    if (balance.name === 'TRX') {
      orderedBalances[0] = balance
    } else if (balance.name === 'TWX') {
      orderedBalances[1] = balance
    }
  })
  return [
    ...orderedBalances.filter((balance) => !!balance),
    ...balances.filter((balance) => balance.name !== 'TRX' && balance.name !== 'TWX')
  ]
}
