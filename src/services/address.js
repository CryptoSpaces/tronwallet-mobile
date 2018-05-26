const ADDRESS_PREFIX = '27'
const ADDRESS_SIZE = 35

export const isAddressValid = address => {
  if (!address || !address.length) return false
  if (address.length !== ADDRESS_SIZE) return false
  if (address.substr(0, 2).toUpperCase() !== ADDRESS_PREFIX.toUpperCase()) return false
  return true
}
