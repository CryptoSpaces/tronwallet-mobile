const formatInteger = (numberStr) => numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const formatNumber = (number) => {
  if (number === 0) return 0
  if (number < 1) return number

  return Number.isInteger(number) ? formatInteger(number.toString())
    : number.toString().split('.').reduce((first, second) =>
      `${formatInteger(first)}.${second.substr(0, 2)}`)
}
