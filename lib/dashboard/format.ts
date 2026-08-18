const currencyFormatter2dp = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency2(amount: number, currency = "NPR") {
  return `${currency} ${currencyFormatter2dp.format(amount)}`
}

