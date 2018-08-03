const formatInteger = (numberStr) => numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const CRYPTO_PRECISION = 5
const FIAT_PRECISION = 2
const MINIMUM = 0.00001

export const formatNumber = (n) => {
  const number = Number(n)
  if (number === 0) return '0.00'
  if (Number.isInteger(number)) {
    return formatInteger(number.toString())
  } else {
    let decimalPosition = FIAT_PRECISION
    if (number < MINIMUM) return '0.00'
    if (number < 1 && number > 0) {
      decimalPosition = number.toFixed(CRYPTO_PRECISION) > 0 ? CRYPTO_PRECISION : FIAT_PRECISION
    }
    return number.toString().split('.').reduce((first, second) =>
      `${formatInteger(first)}.${second.substr(0, decimalPosition)}`)
  }
}

export const formatFloat = (n) => {
  const number = n.toString()
  const decimalPart = number.split('.')
  if (decimalPart.length > 1) {
    return `${formatInteger(decimalPart[0])}.${decimalPart[1]}`
  } else {
    return `${formatInteger(number)}.00`
  }
}
