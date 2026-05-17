'use client'

import { Search, MapPin } from 'lucide-react'
import { DESTINATION_PHOTOS } from '@/lib/photos'

const DESTINATIONS = [
  { name: 'Bali',       country: 'Indonesia', price: '$980',  tag: 'Trending'   },
  { name: 'Santorini',  country: 'Greece',    price: '$2,100',tag: 'Luxury'     },
  { name: 'Bangkok',    country: 'Thailand',  price: '$890',  tag: 'Popular'    },
  { name: 'Maldives',   country: 'Maldives',  price: '$3,200',tag: 'Luxury'     },
  { name: 'Lisbon',     country: 'Portugal',  price: '$1,200',tag: 'Budget gem' },
  { name: 'Kyoto',      country: 'Japan',     price: '$1,900',tag: 'Culture'    },
  { name: 'Marrakech',  country: 'Morocco',   price: '$1,050',tag: 'Hidden gem' },
  { name: 'Istanbul',   country: 'Turkey',    price: '$1,050',tag: 'Hidden gem' },
]

const TAG_COLORS: Record<string, string> = {
  'Trending':   'bg-gold-500/20 text-gold-400',
  'Luxury':     'bg-purple-500/20 text-purple-300',
  'Popular':    'bg-blue-500/20 text-blue-300',
  'Budget gem': 'bg-success/20 text-success',
  'Culture':    'bg-orange-500/20 text-orange-300',
  'Hidden gem': 'bg-pink-500/20 text-pink-300',
}

export default function ExplorePage() {
  return (
    <div className="min-h-dvh bg-ocean-900 px-5 pt-10 pb-4">
      <div className="animate-fade-up mb-6">
        <h1 className="font-serif font-bold text-2xl text-cream">Explore</h1>
        <p className="text-xs text-cream/40 mt-0.5">Discover your next destination</p>
      </div>

      {/* Search */}
      <div className="animate-fade-up delay-100 relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/60" />
        <input
          type="text"
          placeholder="Search destinations…"
          className="input-ocean w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm"
        />
      </div>

      {/* Grid */}
      <div className="animate-fade-up delay-200 grid grid-cols-2 gap-3">
        {DESTINATIONS.map(d => {
          const photo = DESTINATION_PHOTOS[d.name]
          return (
            <button
              key={d.name}
              className="relative rounded-2xl overflow-hidden text-left group cursor-pointer"
              style={{ aspectRatio: '4/3' }}
            >
              {/* Background photo */}
              {photo ? (
                <img
                  src={photo}
                  alt={d.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-ocean-700" />
              )}

              {/* Overlay */}
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(7,24,32,0.92) 0%, rgba(7,24,32,0.3) 50%, transparent 100%)' }} />

              {/* Tag */}
              <div className="absolute top-2.5 left-2.5">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${TAG_COLORS[d.tag] ?? 'bg-white/10 text-white/70'}`}>
                  {d.tag}
                </span>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-sm font-bold text-cream leading-tight">{d.name}</h3>
                <div className="flex items-center gap-1 mt-0.5 mb-2">
                  <MapPin className="w-2.5 h-2.5 text-gold-400" />
                  <span className="text-[10px] text-cream/60">{d.country}</span>
                </div>
                <p className="text-xs font-bold text-gradient-gold">From {d.price}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
