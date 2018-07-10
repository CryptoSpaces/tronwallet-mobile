const ADDRESS_PREFIX = 'T'
const ADDRESS_SIZE = 34

export const isAddressValid = address => {
  if (!address || !address.length) return false
  if (address.length !== ADDRESS_SIZE) return false
  if (address.charAt(0).toUpperCase() !== ADDRESS_PREFIX.toUpperCase()) {
    return false
  }
  return address.match(/([A-Za-z0-9]){34}/g)
}
