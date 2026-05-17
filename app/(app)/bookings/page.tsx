'use client'

import { Plane, Calendar, Clock, ChevronRight, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const MOCK_BOOKINGS = [
  { id: '1', destination: 'Roma, Italy', dates: 'Sep 8 – 22, 2025', status: 'confirmed', amount: '$1,890', emoji: '🇮🇹' },
  { id: '2', destination: 'Kyoto, Japan', dates: 'Oct 14 – 25, 2025', status: 'pending',   amount: '$2,240', emoji: '🇯🇵' },
]

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-success/12 text-success border-success/20',
  pending:   'bg-warning/12 text-warning border-warning/20',
  cancelled: 'bg-danger/12 text-danger border-danger/20',
}

export default function BookingsPage() {
  const router = useRouter()

  return (
    <div className="px-5 pt-10 pb-4 min-h-dvh">
      <div className="flex items-center justify-between mb-6 animate-fade-up">
        <div>
          <h1 className="font-serif font-bold text-2xl text-cream">My Trips</h1>
          <p className="text-xs text-slate-text mt-0.5">Track all your adventures</p>
        </div>
        <button
          onClick={() => router.push('/chat')}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Plan new
        </button>
      </div>

      {MOCK_BOOKINGS.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center animate-fade-up">
          <span className="text-5xl">✈️</span>
          <p className="text-cream font-serif font-bold text-lg">No trips yet</p>
          <p className="text-sm text-slate-text">Start planning your first adventure</p>
          <button onClick={() => router.push('/chat')} className="btn-gold px-6 py-3 rounded-2xl text-sm mt-2">
            Plan a trip
          </button>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-up delay-100">
          {MOCK_BOOKINGS.map(b => (
            <div key={b.id} className="glass-card rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-gold-500/20 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-ocean-700/60 flex items-center justify-center text-2xl flex-shrink-0">
                {b.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-cream truncate">{b.destination}</h3>
                  <span className={cn('text-[10px] font-semibold px-2.5 py-1 rounded-full border flex-shrink-0', STATUS_STYLES[b.status])}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-text">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.dates}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-sm font-bold text-gradient-gold">{b.amount}</span>
                <ChevronRight className="w-4 h-4 text-slate-text" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
