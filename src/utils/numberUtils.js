const formatInteger = (numberStr) => numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const formatNumber = (n) => {
  const number = Number(n)
  if (Number.isInteger(number)) {
    if (number === 0) return 0
    return formatInteger(number.toString())
  } else {
    if (number < 1 && number > 0) {
      return number.toFixed(2) > 0 || number.toFixed(5) <= 0 ? number.toFixed(2) : number.toFixed(5)
    }
    return number.toString().split('.').reduce((first, second) =>
      `${formatInteger(first)}.${second.substr(0, 2)}`)
  }
}
