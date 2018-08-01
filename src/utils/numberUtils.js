const formatInteger = (numberStr) => numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const CRYPTO_PRECISION = 5
const FIAT_PRECISION = 2

export const formatNumber = (n) => {
  const number = Number(n)
  if (number === 0) return '0.00'
  if (Number.isInteger(number)) {
    return formatInteger(number.toString())
  } else {
    let decimalPosition = FIAT_PRECISION
    if (number < 1 && number > 0) {
      if (number.toFixed(CRYPTO_PRECISION) <= 0) return '0.00'
      if (number.toFixed(CRYPTO_PRECISION) >= number.toFixed(CRYPTO_PRECISION + 1)) return '0.00'
      else decimalPosition = number.toFixed(CRYPTO_PRECISION) > 0 ? CRYPTO_PRECISION : FIAT_PRECISION
    }
    return number.toString().split('.').reduce((first, second) =>
      `${formatInteger(first)}.${second.substr(0, decimalPosition)}`)
  }
}
