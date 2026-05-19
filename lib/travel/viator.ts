// ─── Viator Partner API — Tours & Experiences ─────────────────────────────────
// Docs: https://docs.viator.com/partner-api/technical/
// Auth: exp-api-key header with your partner API key

import { formatDualPrice, parseAmount } from './currency'

const BASE    = 'https://api.viator.com/partner'
const API_KEY = process.env.VIATOR_API_KEY ?? ''

const headers = () => ({
  'exp-api-key': API_KEY,
  'Accept-Language': 'en-US',
  'Content-Type': 'application/json',
})

export interface ExperienceOffer {
  id: string
  title: string
  description: string
  durationHours: number
  durationDisplay: string
  priceUsd: number
  priceDisplay: string
  rating: number
  reviewCount: number
  category: string
  highlights: string[]
  bookingUrl: string
}

export async function searchExperiences(
  destination: string,
  category?: string,
  maxResults = 5,
): Promise<ExperienceOffer[]> {
  const body = {
    filtering: {
      destination,
      tags: category ? [category] : undefined,
    },
    sorting: { sort: 'TRAVELER_RATING', order: 'DESCENDING' },
    pagination: { start: 1, count: maxResults },
    currency: 'USD',
  }

  const res = await fetch(`${BASE}/products/search`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Viator search failed: ${res.status} ${err}`)
  }

  const json = await res.json()
  return (json.products ?? []).map((p: Record<string, unknown>): ExperienceOffer => {
    const dur = (p.duration as Record<string, unknown>)
    const hrs = (dur?.fixedDurationInMinutes as number ?? 120) / 60
    const priceUsd = parseAmount(
      ((p.pricing as Record<string, unknown>)?.summary as Record<string, string>)?.fromPrice ?? 0
    )

    return {
      id:              p.productCode as string,
      title:           p.title as string,
      description:     (p.description as string ?? '').slice(0, 120) + '…',
      durationHours:   hrs,
      durationDisplay: hrs < 1 ? `${Math.round(hrs * 60)} min` : `${hrs.toFixed(0)} hrs`,
      priceUsd,
      priceDisplay:    formatDualPrice(priceUsd),
      rating:          (p.reviews as Record<string, number>)?.combinedAverageRating ?? 0,
      reviewCount:     (p.reviews as Record<string, number>)?.totalReviews ?? 0,
      category:        ((p.tags as Record<string,string>[])?.[0])?.name ?? 'Experience',
      highlights:      (p.productOptions as string[] ?? []).slice(0, 3),
      bookingUrl:      `https://www.viator.com/tours/${p.productCode}`,
    }
  })
}

export function formatExperiencesForWhatsApp(offers: ExperienceOffer[], destination: string): string {
  if (offers.length === 0) return `😔 No experiences found in ${destination} right now.`

  const lines: string[] = [`🎭 *Top Experiences in ${destination}*\n`]
  offers.slice(0, 3).forEach((e, i) => {
    lines.push(
      `${i + 1}️⃣ *${e.title}*`,
      `⏱ ${e.durationDisplay}  ⭐ ${e.rating.toFixed(1)} (${e.reviewCount} reviews)`,
      `${e.description}`,
      `💰 From ${e.priceDisplay} per person`,
      '',
    )
  })
  lines.push('Reply *1*, *2*, or *3* to book, or ask me for more options!')
  return lines.join('\n')
}
