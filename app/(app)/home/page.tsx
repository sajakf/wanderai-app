'use client'

import { Bell, Search, MapPin, Zap, TrendingUp } from 'lucide-react'
import { TripCarousel } from '@/components/trips/TripCarousel'
import { useRouter } from 'next/navigation'

const QUICK_ACTIONS = [
  { icon: Zap,       label: 'Plan a trip',    labelAr: 'خطط رحلة',   href: '/chat',     color: 'bg-gold-500/12 text-gold-500'   },
  { icon: TrendingUp,label: 'Flight alerts',  labelAr: 'تنبيهات',    href: '/bookings', color: 'bg-success/12 text-success'     },
  { icon: MapPin,    label: 'My trips',       labelAr: 'رحلاتي',     href: '/bookings', color: 'bg-blue-400/12 text-blue-400'   },
]

export default function HomePage() {
  const router = useRouter()
  const name = typeof window !== 'undefined' ? sessionStorage.getItem('wa_name') ?? 'Traveller' : 'Traveller'

  return (
    <div className="min-h-dvh bg-ocean-900 px-5 pt-safe">

      {/* ── Header ── */}
      <div className="flex items-center justify-between pt-10 pb-6 animate-fade-up">
        <div>
          <p className="text-xs text-slate-text tracking-widest uppercase">Good morning ✦</p>
          <h1 className="font-serif font-bold text-2xl text-cream mt-0.5">
            Hey, {name.split(' ')[0]}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 rounded-2xl bg-ocean-800 border border-gold-subtle flex items-center justify-center text-slate-text hover:text-cream transition-colors">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-500" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-gold-gradient flex items-center justify-center text-ocean-950 font-bold text-sm">
            {name[0]?.toUpperCase() ?? 'W'}
          </div>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="animate-fade-up delay-100 mb-6">
        <button
          onClick={() => router.push('/chat')}
          className="input-ocean w-full rounded-2xl px-4 py-3.5 flex items-center gap-3 text-sm text-slate-text text-left"
        >
          <Search className="w-4.5 h-4.5 flex-shrink-0" />
          <span>Where do you want to go?</span>
        </button>
      </div>

      {/* ── Quick actions ── */}
      <div className="animate-fade-up delay-200 grid grid-cols-3 gap-3 mb-8">
        {QUICK_ACTIONS.map(({ icon: Icon, label, href, color }) => (
          <button
            key={label}
            onClick={() => router.push(href)}
            className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-ocean-800/60 border border-gold-subtle hover:border-gold-500/30 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-cream/70 font-medium text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Trip of the Month ── */}
      <div className="animate-fade-up delay-300 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif font-bold text-lg text-cream">Trip of the Month</h2>
            <p className="text-xs text-slate-text mt-0.5">Curated by WanderAI · Updated monthly</p>
          </div>
          <button className="text-xs text-gold-500 font-medium hover:text-gold-400 transition-colors">
            See all
          </button>
        </div>
        <TripCarousel />
      </div>

      {/* ── Banner: Plan with AI ── */}
      <div className="animate-fade-up delay-400 mb-8">
        <button
          onClick={() => router.push('/chat')}
          className="w-full rounded-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #163545 0%, #1D4459 50%, #122F3C 100%)',
            border: '1px solid rgba(196,149,64,0.15)',
          }}
        >
          <div className="absolute inset-0 bg-glow-gold opacity-50 pointer-events-none" />
          <div className="relative p-5 flex items-center justify-between">
            <div className="text-left">
              <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider mb-1">AI-Powered</p>
              <h3 className="font-serif font-bold text-cream text-base leading-tight">
                Tell me your vibe,<br />I&apos;ll plan the trip
              </h3>
              <p className="text-xs text-slate-text mt-1.5">Budget · Dates · Style — done in seconds</p>
            </div>
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-gold-glow text-2xl">
              ✈️
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
