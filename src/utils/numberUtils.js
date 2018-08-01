const formatInteger = (numberStr) => numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const CRYPTO_CURRENCY_PRECISION = 5
const FIAT_CURRENCY_PRECISION = 2

export const formatNumber = (n) => {
  const number = Number(n)
  if (number === 0) return 0
  if (Number.isInteger(number)) {
    return formatInteger(number.toString())
  } else {
    let decimalPosition = FIAT_CURRENCY_PRECISION
    if (number < 1 && number > 0) {
      decimalPosition = number.toFixed(2) > 0 || number.toFixed(5) <= 0 ? FIAT_CURRENCY_PRECISION : CRYPTO_CURRENCY_PRECISION
    }
    return number.toString().split('.').reduce((first, second) =>
      `${formatInteger(first)}.${second.substr(0, decimalPosition)}`)
  }
}
