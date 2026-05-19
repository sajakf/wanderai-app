import type { SlidePhoto } from '@/components/ui/PhotoSlideshow'
import type { SlideVideo } from '@/components/ui/VideoSlideshow'

const BASE = 'https://images.unsplash.com'
const PARAMS = '?auto=format&fit=crop&w=1920&q=85'

/** 12 curated travel photos — diverse destinations, golden-hour & dramatic moods */
export const AUTH_PHOTOS: SlidePhoto[] = [
  {
    url: `${BASE}/photo-1476514525535-07fb3b4ae5f1${PARAMS}`,
    location: 'Amalfi Coast, Italy',
    mood: 'warm',
  },
  {
    url: `${BASE}/photo-1506905925346-21bda4d32df4${PARAMS}`,
    location: 'Swiss Alps',
    mood: 'dramatic',
  },
  {
    url: `${BASE}/photo-1539020140153-e479b8a22e6f${PARAMS}`,
    location: 'Marrakech, Morocco',
    mood: 'warm',
  },
  {
    url: `${BASE}/photo-1483347756197-71ef80e95f73${PARAMS}`,
    location: 'Norwegian Fjords',
    mood: 'cool',
  },
  {
    url: `${BASE}/photo-1523978591478-c753949ff840${PARAMS}`,
    location: 'Santorini, Greece',
    mood: 'warm',
  },
  {
    url: `${BASE}/photo-1537996194471-e657df975ab4${PARAMS}`,
    location: 'Bali, Indonesia',
    mood: 'warm',
  },
  {
    url: `${BASE}/photo-1502602898657-3e91760cbb34${PARAMS}`,
    location: 'Paris, France',
    mood: 'warm',
  },
  {
    url: `${BASE}/photo-1512453979798-5ea266f8880c${PARAMS}`,
    location: 'Dubai, UAE',
    mood: 'dramatic',
  },
  {
    url: `${BASE}/photo-1491557345352-5929e343eb89${PARAMS}`,
    location: 'Maldives',
    mood: 'warm',
  },
  {
    url: `${BASE}/photo-1516483638261-f4dbaf036963${PARAMS}`,
    location: 'Cinque Terre, Italy',
    mood: 'warm',
  },
  {
    url: `${BASE}/photo-1528360983277-13d401cdc186${PARAMS}`,
    location: 'Kyoto, Japan',
    mood: 'cool',
  },
  {
    url: `${BASE}/photo-1548013146-72479768bada${PARAMS}`,
    location: 'Taj Mahal, India',
    mood: 'warm',
  },
]

/**
 * Curated slow-motion nature videos (Mixkit CDN, free licence)
 * Ordered for maximum visual variety — flora → water → macro → forest
 * Used on auth screens (onboarding + verify) for the Apple-style wallpaper feel
 */
export const NATURE_VIDEOS: SlideVideo[] = [
  { id: 7279,  scene: 'White flower, slow motion',        mood: 'flora'  },
  { id: 6806,  scene: 'Water drops on still surface',     mood: 'water'  },
  { id: 48313, scene: 'Bee landing on blossom',           mood: 'macro'  },
  { id: 27034, scene: 'Mountain stream, slow motion',     mood: 'water'  },
  { id: 7366,  scene: 'Petunia opening, slow motion',     mood: 'flora'  },
  { id: 18312, scene: 'Rain on a forest lake',            mood: 'water'  },
  { id: 48318, scene: 'Bee in flight, slow motion',       mood: 'macro'  },
  { id: 6849,  scene: 'Gardenia blooming, time-lapse',    mood: 'flora'  },
  { id: 1164,  scene: 'Ocean waves, slow motion',         mood: 'water'  },
  { id: 95,    scene: 'Branches in the breeze',           mood: 'forest' },
  { id: 1187,  scene: 'White blossoms swaying',           mood: 'flora'  },
  { id: 27009, scene: 'Forest stream, slow motion',       mood: 'water'  },
]

/** Subset for explore screen destination cards */
export const DESTINATION_PHOTOS: Record<string, string> = {
  Bali:       `${BASE}/photo-1537996194471-e657df975ab4${PARAMS}`,
  Lisbon:     `${BASE}/photo-1534308143781-423814049a72${PARAMS}`,
  Bangkok:    `${BASE}/photo-1563492065599-3520f775eeed${PARAMS}`,
  Santorini:  `${BASE}/photo-1523978591478-c753949ff840${PARAMS}`,
  Istanbul:   `${BASE}/photo-1524231757912-21f4fe3a7200${PARAMS}`,
  Maldives:   `${BASE}/photo-1491557345352-5929e343eb89${PARAMS}`,
  Tokyo:      `${BASE}/photo-1540959733332-eab4deabeeaf${PARAMS}`,
  Roma:       `${BASE}/photo-1552832230-c0197dd311b5${PARAMS}`,
  Kyoto:      `${BASE}/photo-1528360983277-13d401cdc186${PARAMS}`,
  Marrakech:  `${BASE}/photo-1539020140153-e479b8a22e6f${PARAMS}`,
}
