'use client'

import { Search, MapPin } from 'lucide-react'

const DESTINATIONS = [
  { name: 'Bali', country: 'Indonesia', emoji: '🇮🇩', price: '$980',  tag: 'Trending'  },
  { name: 'Lisbon', country: 'Portugal', emoji: '🇵🇹', price: '$1,200', tag: 'Budget gem'},
  { name: 'Bangkok', country: 'Thailand', emoji: '🇹🇭', price: '$890',  tag: 'Popular'  },
  { name: 'Santorini', country: 'Greece', emoji: '🇬🇷', price: '$2,100', tag: 'Luxury'  },
  { name: 'Istanbul', country: 'Turkey', emoji: '🇹🇷', price: '$1,050', tag: 'Hidden gem'},
  { name: 'Maldives', country: 'Maldives', emoji: '🇲🇻', price: '$3,200', tag: 'Luxury' },
]

export default function ExplorePage() {
  return (
    <div className="px-5 pt-10 pb-4 animate-fade-up">
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl text-cream">Explore</h1>
        <p className="text-xs text-slate-text mt-0.5">Discover your next destination</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-text" />
        <input
          type="text"
          placeholder="Search destinations, countries…"
          className="input-ocean w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {DESTINATIONS.map(d => (
          <button key={d.name} className="trip-card rounded-2xl p-4 text-left hover:scale-[1.02] transition-all">
            <div className="text-3xl mb-3">{d.emoji}</div>
            <h3 className="text-sm font-bold text-cream">{d.name}</h3>
            <div className="flex items-center gap-1 text-xs text-slate-text mb-2">
              <MapPin className="w-3 h-3" />
              {d.country}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gradient-gold">From {d.price}</span>
              <span className="text-[9px] bg-ocean-700/80 text-cream/60 px-2 py-0.5 rounded-full">{d.tag}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
