'use client'

import { useRef } from 'react'
import { ChevronRight, ChevronLeft, MapPin, Calendar, Plane, Star } from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import type { Trip } from '@/types/database'

const MOCK_TRIPS: Partial<Trip>[] = [
  {
    id: '1',
    country: 'Italy',
    city: 'Roma',
    date_from: '2025-09-08',
    date_to: '2025-09-22',
    price_from: 1890,
    currency: 'USD',
    cover_image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
    highlights: ['Vatican Museums', 'Trastevere food tour', 'Colosseum at sunrise', 'Local espresso bars'],
    status: 'published',
  },
  {
    id: '2',
    country: 'Japan',
    city: 'Kyoto',
    date_from: '2025-10-14',
    date_to: '2025-10-25',
    price_from: 2240,
    currency: 'USD',
    cover_image_url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80',
    highlights: ['Arashiyama Bamboo', 'Tea ceremony', 'Nishiki Market', 'Fushimi Inari'],
    status: 'published',
  },
  {
    id: '3',
    country: 'Morocco',
    city: 'Marrakech',
    date_from: '2025-11-03',
    date_to: '2025-11-12',
    price_from: 1450,
    currency: 'USD',
    cover_image_url: 'https://images.unsplash.com/photo-1539020140153-e479b8a22e6f?w=600&q=80',
    highlights: ['Djemaa el-Fna', 'Atlas Mountains day trip', 'Souks & spice markets', 'Riad dinners'],
    status: 'published',
  },
]

interface TripCardProps {
  trip: Partial<Trip>
  index: number
}

function TripCard({ trip, index }: TripCardProps) {
  const colors = ['from-amber-900/40', 'from-red-900/40', 'from-purple-900/40']

  return (
    <div className="trip-card rounded-2xl flex-shrink-0 w-[300px] sm:w-[340px] cursor-pointer group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        {trip.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trip.cover_image_url}
            alt={`${trip.city}, ${trip.country}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={cn('w-full h-full bg-gradient-to-br', colors[index % 3], 'to-ocean-800')} />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/80 via-transparent to-transparent" />

        {/* Trip of the month badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-gold-500/90 backdrop-blur-sm text-ocean-950 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
          <Star className="w-3 h-3 fill-current" />
          Trip of the Month
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3 text-right">
          <p className="text-[10px] text-cream/60 font-light">from</p>
          <p className="text-xl font-bold text-gradient-gold leading-none">
            {formatCurrency(trip.price_from!, trip.currency)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-serif font-bold text-cream text-lg leading-tight">{trip.city}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-gold-500" />
              <span className="text-xs text-slate-text">{trip.country}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-ocean-700/60 rounded-lg px-2.5 py-1.5">
            <Calendar className="w-3 h-3 text-gold-500" />
            <span className="text-[10px] text-cream/70 font-medium">
              {new Date(trip.date_from!).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              {' – '}
              {new Date(trip.date_to!).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {trip.highlights?.slice(0, 3).map(h => (
            <span
              key={h}
              className="text-[10px] bg-ocean-700/60 text-cream/60 px-2.5 py-1 rounded-full border border-ocean-600/40"
            >
              {h}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button className="btn-gold w-full rounded-xl py-2.5 text-xs flex items-center justify-center gap-2 group-hover:shadow-gold-glow">
          <Plane className="w-3.5 h-3.5" />
          View full itinerary
        </button>
      </div>
    </div>
  )
}

export function TripCarousel({ trips = MOCK_TRIPS }: { trips?: Partial<Trip>[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {/* Scroll buttons — desktop only */}
      <button
        onClick={() => scroll('left')}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-9 h-9 rounded-full bg-ocean-800 border border-gold-subtle items-center justify-center text-slate-text hover:text-cream hover:border-gold-500/40 transition-all shadow-card"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-9 h-9 rounded-full bg-ocean-800 border border-gold-subtle items-center justify-center text-slate-text hover:text-cream hover:border-gold-500/40 transition-all shadow-card"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {trips.map((trip, i) => (
          <div key={trip.id ?? i} style={{ scrollSnapAlign: 'start' }}>
            <TripCard trip={trip} index={i} />
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {trips.map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-text/40" />
        ))}
      </div>
    </div>
  )
}
