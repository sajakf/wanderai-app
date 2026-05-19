import type { SlidePhoto } from '@/components/ui/PhotoSlideshow'

const BASE = 'https://images.unsplash.com'
const PARAMS = '?auto=format&fit=crop&w=1920&q=85'

/**
 * 18 hand-curated travel photos — verified working Unsplash IDs
 * Destinations: Scotland · Norway · Japan · Maldives · Greece · Provence ·
 *               Puglia · Amalfi · Spain · Caribbean · Mexico
 * Selection criteria: golden-hour drama, editorial composition, zero clichés
 */
export const AUTH_PHOTOS: SlidePhoto[] = [
  // ── Scotland ──────────────────────────────────────────────────────────
  {
    url: `${BASE}/photo-1551410224-699683e15636${PARAMS}`,
    location: 'Isle of Skye, Scotland',
    mood: 'dramatic',
  },
  {
    url: `${BASE}/photo-1589489873423-d1745278a8f4${PARAMS}`,
    location: 'Scottish Highlands',
    mood: 'dramatic',
  },

  // ── Norway ────────────────────────────────────────────────────────────
  {
    url: `${BASE}/photo-1520769945061-0a448c463865${PARAMS}`,
    location: 'Lofoten Islands, Norway',
    mood: 'cool',
  },
  {
    url: `${BASE}/photo-1531366936337-7c912a4589a7${PARAMS}`,
    location: 'Northern Lights, Norway',
    mood: 'dramatic',
  },
  {
    url: `${BASE}/photo-1663428520845-056989f8a664${PARAMS}`,
    location: 'Norwegian Fjords',
    mood: 'cool',
  },

  // ── Japan ─────────────────────────────────────────────────────────────
  {
    url: `${BASE}/photo-1490806843957-31f4c9a91c65${PARAMS}`,
    location: 'Mount Fuji, Japan',
    mood: 'cool',
  },
  {
    url: `${BASE}/photo-1526481280693-3bfa7568e0f3${PARAMS}`,
    location: 'Mount Fuji at Sunrise',
    mood: 'warm',
  },
  {
    url: `${BASE}/photo-1522383225653-ed111181a951${PARAMS}`,
    location: 'Kyoto, Japan',
    mood: 'cool',
  },

  // ── Maldives ──────────────────────────────────────────────────────────
  {
    url: `${BASE}/photo-1590523277543-a94d2e4eb00b${PARAMS}`,
    location: 'Maldives',
    mood: 'warm',
  },
  {
    url: `${BASE}/photo-1688949078626-a358f500e063${PARAMS}`,
    location: 'Maldives Overwater Villas',
    mood: 'warm',
  },

  // ── Greece ────────────────────────────────────────────────────────────
  {
    url: `${BASE}/photo-1533105079780-92b9be482077${PARAMS}`,
    location: 'Santorini, Greece',
    mood: 'warm',
  },
  {
    url: `${BASE}/photo-1558618666-fcd25c85cd64${PARAMS}`,
    location: 'Meteora, Greece',
    mood: 'dramatic',
  },

  // ── South France / Provence ───────────────────────────────────────────
  {
    url: `${BASE}/photo-1561718541-b00339c8db2a${PARAMS}`,
    location: 'Provence, France',
    mood: 'warm',
  },

  // ── Italy ─────────────────────────────────────────────────────────────
  {
    url: `${BASE}/photo-1476514525535-07fb3b4ae5f1${PARAMS}`,
    location: 'Amalfi Coast, Italy',
    mood: 'warm',
  },
  {
    url: `${BASE}/photo-1693653631563-f2ca63a1e3b0${PARAMS}`,
    location: 'Puglia, Italy',
    mood: 'warm',
  },

  // ── Spain ─────────────────────────────────────────────────────────────
  {
    url: `${BASE}/photo-1543783207-ec64e4d95325${PARAMS}`,
    location: 'Alhambra, Spain',
    mood: 'warm',
  },
  {
    url: `${BASE}/photo-1539037116277-4db20889f2d4${PARAMS}`,
    location: 'Barcelona, Spain',
    mood: 'warm',
  },

  // ── Caribbean ─────────────────────────────────────────────────────────
  {
    url: `${BASE}/photo-1600582910964-5b7c109e6868${PARAMS}`,
    location: 'Caribbean',
    mood: 'warm',
  },
]

/** Subset for explore screen destination cards */
export const DESTINATION_PHOTOS: Record<string, string> = {
  Bali:       `${BASE}/photo-1537996194471-e657df975ab4${PARAMS}`,
  Lisbon:     `${BASE}/photo-1516483638261-f4dbaf036963${PARAMS}`,
  Bangkok:    `${BASE}/photo-1563492065599-3520f775eeed${PARAMS}`,
  Santorini:  `${BASE}/photo-1533105079780-92b9be482077${PARAMS}`,
  Istanbul:   `${BASE}/photo-1524231757912-21f4fe3a7200${PARAMS}`,
  Maldives:   `${BASE}/photo-1590523277543-a94d2e4eb00b${PARAMS}`,
  Tokyo:      `${BASE}/photo-1540959733332-eab4deabeeaf${PARAMS}`,
  Roma:       `${BASE}/photo-1552832230-c0197dd311b5${PARAMS}`,
  Kyoto:      `${BASE}/photo-1522383225653-ed111181a951${PARAMS}`,
  Marrakech:  `${BASE}/photo-1539020140153-e479b8a22e6f${PARAMS}`,
}
