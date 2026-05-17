'use client'

import { Bell, Search, Zap, TrendingUp, MapPin } from 'lucide-react'
import { TripCarousel } from '@/components/trips/TripCarousel'
import { useRouter } from 'next/navigation'
import { AUTH_PHOTOS } from '@/lib/photos'
import { useState, useEffect } from 'react'

const QUICK_ACTIONS = [
  { icon: Zap,        label: 'Plan a trip',   href: '/chat',     color: 'text-gold-500',   bg: 'bg-gold-500/12'  },
  { icon: TrendingUp, label: 'Flight alerts', href: '/bookings', color: 'text-success',    bg: 'bg-success/12'   },
  { icon: MapPin,     label: 'My trips',      href: '/bookings', color: 'text-blue-400',   bg: 'bg-blue-400/12'  },
]

// Pick a single random hero photo for the home screen
const HERO_PHOTO = AUTH_PHOTOS[Math.floor(Math.random() * AUTH_PHOTOS.length)]

export default function HomePage() {
  const router = useRouter()
  const [name, setName] = useState('Traveller')

  useEffect(() => {
    setName(sessionStorage.getItem('wa_name') ?? 'Traveller')
  }, [])

  return (
    <div className="min-h-dvh bg-ocean-900">

      {/* ── Hero photo strip (blurred, subtle) ── */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={HERO_PHOTO.url}
          alt={HERO_PHOTO.location}
          className="absolute inset-0 w-full h-full object-cover scale-110"
          style={{ filter: 'blur(2px)' }}
        />
        {/* Gradient fade to ocean-900 */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(7,24,32,0.45) 0%, rgba(13,43,53,0.6) 50%, #0D2B35 100%)' }} />

        {/* Nav overlay */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-10 animate-fade-up">
          <div>
            <p className="text-[10px] text-cream/50 tracking-widest uppercase">Good day ✦</p>
            <h1 className="font-serif font-bold text-2xl text-cream mt-0.5">
              Hey, {name.split(' ')[0]}
            </h1>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="relative w-10 h-10 rounded-2xl flex items-center justify-center text-cream/70 hover:text-cream transition-colors"
              style={{ background: 'rgba(7,24,32,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-500 border border-ocean-900" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-gold-gradient flex items-center justify-center text-ocean-950 font-bold text-sm shadow-gold-glow">
              {name[0]?.toUpperCase() ?? 'W'}
            </div>
          </div>
        </div>

        {/* Location chip */}
        <div className="absolute bottom-3 left-5 flex items-center gap-1.5"
          style={{ background: 'rgba(7,24,32,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, padding: '4px 10px' }}>
          <MapPin className="w-3 h-3 text-gold-400" />
          <span className="text-[10px] text-cream/70 font-medium">{HERO_PHOTO.location}</span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="px-5 pb-6">

        {/* Search bar */}
        <div className="animate-fade-up -mt-5 mb-6 relative z-10">
          <button
            onClick={() => router.push('/chat')}
            className="input-ocean w-full rounded-2xl px-4 py-3.5 flex items-center gap-3 text-sm text-cream/40 text-left shadow-card"
            style={{ background: 'rgba(18,47,60,0.95)', backdropFilter: 'blur(12px)' }}
          >
            <Search className="w-4.5 h-4.5 text-gold-500/70 flex-shrink-0" />
            <span>Where do you want to go?</span>
            <span className="ml-auto text-[10px] font-semibold text-gold-500/70 border border-gold-500/20 rounded-lg px-2 py-0.5">AI</span>
          </button>
        </div>

        {/* Quick actions */}
        <div className="animate-fade-up delay-100 grid grid-cols-3 gap-3 mb-8">
          {QUICK_ACTIONS.map(({ icon: Icon, label, href, color, bg }) => (
            <button
              key={label}
              onClick={() => router.push(href)}
              className="flex flex-col items-center gap-2 p-3.5 rounded-2xl transition-all"
              style={{ background: 'rgba(22,53,69,0.6)', border: '1px solid rgba(196,149,64,0.08)' }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className="text-[11px] text-cream/60 font-medium text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>

        {/* Trip of the Month */}
        <div className="animate-fade-up delay-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-cream">Trip of the Month</h2>
              <p className="text-xs text-cream/40 mt-0.5">Curated by WanderAI · Updated monthly</p>
            </div>
            <button className="text-xs text-gold-500 font-medium hover:text-gold-400 transition-colors">See all</button>
          </div>
          <TripCarousel />
        </div>

        {/* AI planning banner */}
        <div className="animate-fade-up delay-300">
          <button
            onClick={() => router.push('/chat')}
            className="w-full rounded-2xl overflow-hidden relative group"
            style={{ background: 'linear-gradient(135deg, #163545, #1D4459, #122F3C)', border: '1px solid rgba(196,149,64,0.15)' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'radial-gradient(ellipse at center, rgba(196,149,64,0.08) 0%, transparent 70%)' }} />
            <div className="relative p-5 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] text-gold-400 font-bold uppercase tracking-[0.2em] mb-1.5">AI-Powered</p>
                <h3 className="font-serif font-bold text-cream text-base leading-tight">
                  Tell me your vibe,<br />I&apos;ll plan the trip
                </h3>
                <p className="text-xs text-cream/40 mt-1.5">Budget · Dates · Style — in seconds</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-gold-glow text-2xl flex-shrink-0">
                ✈️
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
