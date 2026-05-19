// KWD ↔ USD conversion
// Rate updated May 2026 — swap for a live rates API if needed
const KWD_PER_USD = 0.307   // 1 USD = 0.307 KWD
const USD_PER_KWD = 3.257   // 1 KWD = 3.257 USD

export function usdToKwd(usd: number): number {
  return parseFloat((usd * KWD_PER_USD).toFixed(3))
}

export function kwdToUsd(kwd: number): number {
  return parseFloat((kwd * USD_PER_KWD).toFixed(2))
}

/** Format a price in both KWD and USD for WhatsApp display */
export function formatDualPrice(usd: number): string {
  const kwd = usdToKwd(usd)
  return `*${kwd.toFixed(3)} KWD* (~$${usd.toFixed(0)} USD)`
}

/** Parse Amadeus/Duffel amount string to number */
export function parseAmount(amount: string | number): number {
  return typeof amount === 'string' ? parseFloat(amount) : amount
}
