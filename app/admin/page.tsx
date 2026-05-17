'use client'

import { Users, Plane, DollarSign, TrendingUp, Globe, Clock, CheckCircle, AlertCircle } from 'lucide-react'

const STATS = [
  { label: 'Total Users',    value: '1,284',  delta: '+12%', icon: Users,      color: 'text-blue-400',    bg: 'bg-blue-400/10'   },
  { label: 'Active Trips',   value: '342',    delta: '+8%',  icon: Plane,      color: 'text-gold-500',    bg: 'bg-gold-500/10'   },
  { label: 'Revenue (MTD)',  value: '$48.2K', delta: '+23%', icon: DollarSign, color: 'text-success',     bg: 'bg-success/10'    },
  { label: 'Avg Trip Value', value: '$1,840', delta: '+5%',  icon: TrendingUp, color: 'text-purple-400',  bg: 'bg-purple-400/10' },
]

const TOP_DESTINATIONS = [
  { city: 'Roma', country: 'Italy',   bookings: 48, emoji: '🇮🇹' },
  { city: 'Kyoto', country: 'Japan',  bookings: 41, emoji: '🇯🇵' },
  { city: 'Bali', country: 'Indonesia', bookings: 38, emoji: '🇮🇩' },
  { city: 'Lisbon', country: 'Portugal', bookings: 29, emoji: '🇵🇹' },
  { city: 'Marrakech', country: 'Morocco', bookings: 24, emoji: '🇲🇦' },
]

const RECENT_BOOKINGS = [
  { user: 'Sara Al-Ahmad', dest: 'Roma, Italy',    amount: '$1,890', status: 'confirmed', time: '2m ago'  },
  { user: 'Khalid Hassan', dest: 'Kyoto, Japan',   amount: '$2,240', status: 'pending',   time: '14m ago' },
  { user: 'Nour Saeed',    dest: 'Bali, Indonesia',amount: '$1,450', status: 'confirmed', time: '1h ago'  },
  { user: 'Ahmad Malik',   dest: 'Lisbon, Portugal',amount: '$1,200', status: 'cancelled', time: '3h ago' },
]

const STATUS_STYLES: Record<string, { icon: typeof CheckCircle; className: string }> = {
  confirmed: { icon: CheckCircle,  className: 'text-success' },
  pending:   { icon: Clock,        className: 'text-warning'  },
  cancelled: { icon: AlertCircle,  className: 'text-danger'   },
}

export default function AdminPage() {
  return (
    <div className="min-h-dvh bg-ocean-950 text-cream">

      {/* Sidebar + main layout */}
      <div className="flex">

        {/* Sidebar */}
        <aside className="w-60 min-h-dvh bg-ocean-900 border-r border-gold-subtle/30 p-5 flex flex-col gap-1 flex-shrink-0">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gold-gradient flex items-center justify-center">
              <Globe className="w-4 h-4 text-ocean-950" />
            </div>
            <div>
              <p className="text-xs font-bold text-cream">WanderAI</p>
              <p className="text-[9px] text-gold-500 uppercase tracking-widest">Admin</p>
            </div>
          </div>

          {[
            { label: 'Dashboard',    active: true  },
            { label: 'Users',        active: false },
            { label: 'Bookings',     active: false },
            { label: 'Trips',        active: false },
            { label: 'Payments',     active: false },
            { label: 'Analytics',    active: false },
            { label: 'Content',      active: false },
            { label: 'Settings',     active: false },
          ].map(item => (
            <button
              key={item.label}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                item.active
                  ? 'bg-gold-500/12 text-gold-500 font-semibold'
                  : 'text-slate-text hover:text-cream hover:bg-ocean-800/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-2xl text-cream">Dashboard</h1>
              <p className="text-xs text-slate-text mt-0.5">Welcome back, Admin · {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <button className="btn-gold px-5 py-2.5 rounded-xl text-xs">Export CSV</button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map(s => (
              <div key={s.label} className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <span className="text-[11px] text-success font-semibold bg-success/10 px-2 py-0.5 rounded-full">
                    {s.delta}
                  </span>
                </div>
                <p className="text-2xl font-bold text-cream">{s.value}</p>
                <p className="text-xs text-slate-text mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Bottom grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Recent bookings */}
            <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gold-subtle/20">
                <h2 className="text-sm font-semibold text-cream">Recent Bookings</h2>
                <button className="text-xs text-gold-500 hover:text-gold-400">View all</button>
              </div>
              <div className="divide-y divide-gold-subtle/10">
                {RECENT_BOOKINGS.map((b, i) => {
                  const S = STATUS_STYLES[b.status]
                  return (
                    <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                      <div className="w-8 h-8 rounded-xl bg-gold-500/15 flex items-center justify-center text-xs font-bold text-gold-500 flex-shrink-0">
                        {b.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-cream truncate">{b.user}</p>
                        <p className="text-xs text-slate-text">{b.dest}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gradient-gold">{b.amount}</p>
                        <div className="flex items-center gap-1 justify-end mt-0.5">
                          <S.icon className={`w-3 h-3 ${S.className}`} />
                          <p className={`text-[10px] ${S.className}`}>{b.status}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top destinations */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gold-subtle/20">
                <h2 className="text-sm font-semibold text-cream">Top Destinations</h2>
              </div>
              <div className="p-4 space-y-3">
                {TOP_DESTINATIONS.map((d, i) => (
                  <div key={d.city} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-text w-4 flex-shrink-0">{i + 1}</span>
                    <span className="text-xl">{d.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-cream">{d.city}</p>
                      <div className="w-full bg-ocean-700/60 rounded-full h-1 mt-1">
                        <div
                          className="bg-gold-gradient h-1 rounded-full"
                          style={{ width: `${(d.bookings / TOP_DESTINATIONS[0].bookings) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-slate-text flex-shrink-0">{d.bookings}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
