// ─── Duffel Flights API ───────────────────────────────────────────────────────
// Docs: https://duffel.com/docs/api
// Test mode: set DUFFEL_ACCESS_TOKEN to a test token (starts with duffel_test_)

import { formatDualPrice, parseAmount } from './currency'

const BASE = 'https://api.duffel.com'
const TOKEN = process.env.DUFFEL_ACCESS_TOKEN ?? ''

const headers = () => ({
  'Authorization': `Bearer ${TOKEN}`,
  'Duffel-Version': 'v2',
  'Content-Type': 'application/json',
  'Accept': 'application/json',
})

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FlightSearchParams {
  origin: string        // IATA code e.g. "KWI"
  destination: string   // IATA code e.g. "LHR"
  departureDate: string // YYYY-MM-DD
  returnDate?: string   // YYYY-MM-DD (for round trips)
  adults: number
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first'
  maxConnections?: number
}

export interface FlightOffer {
  id: string
  totalUsd: number
  totalKwd: number
  priceDisplay: string
  airline: string
  airlineCode: string
  departureTime: string
  arrivalTime: string
  duration: string
  stops: number
  stopText: string
  cabinClass: string
  slices: Array<{
    origin: string
    destination: string
    departureAt: string
    arrivalAt: string
    duration: string
    segments: Array<{
      airline: string
      flightNumber: string
      aircraft?: string
    }>
  }>
  raw: unknown // full Duffel offer for booking
}

// ── Search flights ─────────────────────────────────────────────────────────────

export async function searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
  const slices: unknown[] = [
    {
      origin: params.origin,
      destination: params.destination,
      departure_date: params.departureDate,
    },
  ]

  if (params.returnDate) {
    slices.push({
      origin: params.destination,
      destination: params.origin,
      departure_date: params.returnDate,
    })
  }

  const body = {
    data: {
      slices,
      passengers: Array(params.adults).fill({ type: 'adult' }),
      cabin_class: params.cabinClass ?? 'economy',
      max_connections: params.maxConnections ?? 1,
    },
  }

  const res = await fetch(`${BASE}/air/offer_requests`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Duffel search failed: ${res.status} ${err}`)
  }

  const json = await res.json()
  const offers = json.data?.offers ?? []

  return offers
    .slice(0, 6) // top 6 offers
    .map((o: Record<string, unknown>): FlightOffer => {
      const totalUsd = parseAmount(o.total_amount as string)
      const slice0 = (o.slices as Record<string, unknown>[])[0]
      const segs0  = slice0.segments as Record<string, unknown>[]
      const seg0   = segs0[0]
      const segLast = segs0[segs0.length - 1]
      const stops  = segs0.length - 1

      return {
        id:             o.id as string,
        totalUsd,
        totalKwd:       parseAmount((o.total_amount as string)) * 0.307,
        priceDisplay:   formatDualPrice(totalUsd),
        airline:        (seg0.operating_carrier as Record<string,string>).name,
        airlineCode:    (seg0.operating_carrier as Record<string,string>).iata_code,
        departureTime:  seg0.departing_at as string,
        arrivalTime:    segLast.arriving_at as string,
        duration:       slice0.duration as string,
        stops,
        stopText:       stops === 0 ? 'Direct' : `${stops} stop${stops > 1 ? 's' : ''}`,
        cabinClass:     ((o.slices as Record<string, unknown>[])[0].fare_brand_name as string) ?? params.cabinClass ?? 'Economy',
        slices:         (o.slices as Record<string, unknown>[]).map(sl => ({
          origin:       (sl.origin as Record<string,string>).iata_code,
          destination:  (sl.destination as Record<string,string>).iata_code,
          departureAt:  (sl.segments as Record<string,unknown>[])[0].departing_at as string,
          arrivalAt:    ((sl.segments as Record<string,unknown>[]).at(-1) as Record<string,unknown>).arriving_at as string,
          duration:     sl.duration as string,
          segments:     (sl.segments as Record<string, unknown>[]).map(sg => ({
            airline:      (sg.operating_carrier as Record<string,string>).name,
            flightNumber: sg.marketing_carrier_flight_number as string,
            aircraft:     (sg.aircraft as Record<string,string>)?.name,
          })),
        })),
        raw: o,
      }
    })
}

// ── Confirm price ──────────────────────────────────────────────────────────────

export async function confirmFlightPrice(offerId: string): Promise<{ confirmed: boolean; totalUsd: number; priceDisplay: string }> {
  const res = await fetch(`${BASE}/air/offers/${offerId}`, { headers: headers() })
  if (!res.ok) throw new Error(`Duffel price check failed: ${res.status}`)
  const json = await res.json()
  const totalUsd = parseAmount(json.data.total_amount)
  return {
    confirmed:    true,
    totalUsd,
    priceDisplay: formatDualPrice(totalUsd),
  }
}

// ── Create booking (Phase 2 — needs production token) ─────────────────────────

export interface PassengerDetails {
  givenName: string
  familyName: string
  dateOfBirth: string   // YYYY-MM-DD
  gender: 'm' | 'f'
  email: string
  phoneNumber: string   // E.164 e.g. +96512345678
  passportNumber?: string
}

export async function createFlightOrder(
  selectedOffers: string[],
  passengers: PassengerDetails[],
): Promise<{ bookingRef: string; status: string }> {
  const body = {
    data: {
      selected_offers: selectedOffers,
      passengers: passengers.map(p => ({
        given_name:    p.givenName,
        family_name:   p.familyName,
        born_on:       p.dateOfBirth,
        gender:        p.gender,
        email:         p.email,
        phone_number:  p.phoneNumber,
        document_type: p.passportNumber ? 'passport' : undefined,
        document_number: p.passportNumber,
      })),
      payments: [{
        type:     'balance',  // use Duffel balance account (set up in dashboard)
        currency: 'USD',
        amount:   '0',        // placeholder — real amount confirmed at price step
      }],
    },
  }

  const res = await fetch(`${BASE}/air/orders`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Duffel booking failed: ${res.status} ${err}`)
  }

  const json = await res.json()
  return {
    bookingRef: json.data.booking_reference,
    status:     json.data.payment_status.awaiting_payment ? 'awaiting_payment' : 'confirmed',
  }
}

// ── Format offers for WhatsApp ────────────────────────────────────────────────

export function formatFlightOffersForWhatsApp(offers: FlightOffer[], origin: string, dest: string): string {
  if (offers.length === 0) return `😔 No flights found from ${origin} to ${dest} for those dates. Try different dates?`

  const top3 = offers.slice(0, 3)
  const lines: string[] = [`✈️ *Flights ${origin} → ${dest}*\n`]

  top3.forEach((o, i) => {
    const dep = new Date(o.departureTime)
    const arr = new Date(o.arrivalTime)
    const depStr = dep.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    const arrStr = arr.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

    lines.push(
      `${i + 1}️⃣ *${o.airline}* — ${o.stopText}`,
      `🕐 ${depStr} → ${arrStr} (${o.duration.replace('PT','').toLowerCase()})`,
      `💰 ${o.priceDisplay} per person`,
      `🪑 ${o.cabinClass}`,
      '',
    )
  })

  lines.push('Reply *1*, *2*, or *3* to select a flight.')
  return lines.join('\n')
}
