export function formatNumber(num, decimals = 2) {
  if (!num) return '0'
  return num.toFixed(decimals)
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount)
}

export function formatPercentage(value) {
  return `${formatNumber(value, 1)}%`
}

export function formatScore(score) {
  return `${formatNumber(score, 0)}/100`
}

export function getShorthandCity(city) {
  const shorthand = {
    'Bangalore': 'BLR',
    'Delhi': 'DEL',
    'Mumbai': 'MUM',
    'Pune': 'PNE',
    'Hyderabad': 'HYD'
  }
  return shorthand[city] || city.substring(0, 3).toUpperCase()
}

export function truncateText(text, length = 100) {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}
