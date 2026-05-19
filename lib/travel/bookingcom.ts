// ─── Booking.com Demand API ───────────────────────────────────────────────────
// Docs: https://developers.booking.com/demand
// Auth: Basic Auth with username (affiliate_id) + password (api_key)

import { formatDualPrice, parseAmount } from './currency'

const BASE    = 'https://demandapi.booking.com/3.1'
const USER    = process.env.BOOKINGCOM_AFFILIATE_ID ?? ''
const PASS    = process.env.BOOKINGCOM_API_KEY ?? ''
const AUTH    = () => 'Basic ' + Buffer.from(`${USER}:${PASS}`).toString('base64')

const headers = () => ({
  'Authorization': AUTH(),
  'Content-Type': 'application/json',
  'Accept': 'application/json',
})

// ── Types ─────────────────────────────────────────────────────────────────────

export interface HotelSearchParams {
  cityId?: string       // Booking.com city ID
  cityName?: string     // fallback — we'll resolve it first
  checkin: string       // YYYY-MM-DD
  checkout: string      // YYYY-MM-DD
  adults: number
  rooms?: number
  maxBudgetUsd?: number
  starRating?: number   // 3 | 4 | 5
}

export interface HotelOffer {
  id: string
  name: string
  stars: number
  reviewScore: number
  reviewCount: number
  reviewLabel: string
  address: string
  pricePerNightUsd: number
  totalUsd: number
  priceDisplay: string
  amenities: string[]
  thumbnailUrl?: string
  distanceFromCenter?: string
  raw: unknown
}

// ── Search hotels ─────────────────────────────────────────────────────────────

export async function searchHotels(params: HotelSearchParams): Promise<HotelOffer[]> {
  // Build query
  const query: Record<string, string | number> = {
    checkin:  params.checkin,
    checkout: params.checkout,
    adults:   params.adults,
    rooms:    params.rooms ?? 1,
    currency: 'USD',
    language: 'en-gb',
    rows:     10,
  }

  if (params.cityId)      query.city_ids = params.cityId
  if (params.starRating)  query.class    = params.starRating

  const qs = new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)])).toString()

  const res = await fetch(`${BASE}/accommodations/search?${qs}`, { headers: headers() })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Booking.com search failed: ${res.status} ${err}`)
  }

  const json = await res.json()
  const results = json.results ?? []

  const nights = Math.ceil(
    (new Date(params.checkout).getTime() - new Date(params.checkin).getTime()) / 86_400_000
  )

  return results
    .slice(0, 6)
    .map((h: Record<string, unknown>): HotelOffer => {
      const totalUsd = parseAmount(
        ((h.composite_price_breakdown as Record<string, unknown>)
          ?.all_inclusive_amount as Record<string, string>)?.value ?? 0
      )
      const perNight = totalUsd / Math.max(nights, 1)

      const score = parseFloat(String((h.review_score as Record<string, unknown>)?.score ?? 0))
      const label = score >= 9 ? 'Exceptional' : score >= 8 ? 'Excellent' : score >= 7 ? 'Very Good' : 'Good'

      return {
        id:                 String(h.hotel_id),
        name:               h.hotel_name as string,
        stars:              h.accommodation_type_name ? (h.class as number ?? 0) : 0,
        reviewScore:        score,
        reviewCount:        (h.review_score as Record<string, unknown>)?.review_count as number ?? 0,
        reviewLabel:        label,
        address:            (h.address as Record<string, string>)?.address ?? '',
        pricePerNightUsd:   perNight,
        totalUsd,
        priceDisplay:       formatDualPrice(totalUsd),
        amenities:          ((h.top_amenities as string[]) ?? []).slice(0, 4),
        thumbnailUrl:       ((h.photos as Record<string, string>[])?.[0])?.url_max300,
        distanceFromCenter: `${((h.distance as Record<string, unknown>)?.distance as number ?? 0).toFixed(1)} km from center`,
        raw: h,
      }
    })
}

// ── Format hotels for WhatsApp ────────────────────────────────────────────────

export function formatHotelOffersForWhatsApp(offers: HotelOffer[], city: string, nights: number): string {
  if (offers.length === 0) return `😔 No hotels found in ${city} for those dates. Try different dates or budget?`

  const top3 = offers.slice(0, 3)
  const lines: string[] = [`🏨 *Hotels in ${city}* (${nights} night${nights > 1 ? 's' : ''})\n`]

  top3.forEach((h, i) => {
    const stars = '⭐'.repeat(Math.min(h.stars, 5))
    lines.push(
      `${i + 1}️⃣ *${h.name}*`,
      `${stars}  ⭐ ${h.reviewScore}/10 *${h.reviewLabel}* (${h.reviewCount} reviews)`,
      `📍 ${h.distanceFromCenter ?? h.address}`,
      `💰 ${formatDualPrice(h.pricePerNightUsd)}/night · Total: ${h.priceDisplay}`,
      h.amenities.length ? `✅ ${h.amenities.join(' · ')}` : '',
      '',
    )
  })

  lines.push('Reply *1*, *2*, or *3* to select a hotel, or *more* to see other options.')
  return lines.filter(l => l !== null).join('\n')
}
