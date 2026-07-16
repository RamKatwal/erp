const currencyFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatCurrency(amount: number, currency = "Rs.") {
  return `${currency} ${currencyFormatter.format(amount)}`
}

export function formatDate(date: string) {
  return date
}
