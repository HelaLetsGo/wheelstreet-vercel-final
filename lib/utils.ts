export function cn(...inputs: any) {
  let twClasses = ""
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i]
    if (typeof input === "string") {
      twClasses += input + " "
    } else if (typeof input === "object" && input !== null) {
      Object.keys(input).forEach((key) => {
        if (input[key]) {
          twClasses += key + " "
        }
      })
    }
  }
  return twClasses.trim()
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}
