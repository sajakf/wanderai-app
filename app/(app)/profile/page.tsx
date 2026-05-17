'use client'

import { User, Bell, Globe, Shield, LogOut, ChevronRight, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

const MENU_ITEMS = [
  { icon: User,     label: 'Personal info',        labelAr: 'المعلومات الشخصية' },
  { icon: FileText, label: 'Travel documents',      labelAr: 'وثائق السفر'       },
  { icon: Bell,     label: 'Notifications',         labelAr: 'الإشعارات'         },
  { icon: Globe,    label: 'Language & currency',   labelAr: 'اللغة والعملة'     },
  { icon: Shield,   label: 'Privacy & security',    labelAr: 'الخصوصية والأمان'  },
]

export default function ProfilePage() {
  const router = useRouter()
  const name = typeof window !== 'undefined' ? sessionStorage.getItem('wa_name') ?? 'Traveller' : 'Traveller'
  const phone = typeof window !== 'undefined' ? sessionStorage.getItem('wa_phone') ?? '' : ''

  return (
    <div className="px-5 pt-10 pb-4 min-h-dvh animate-fade-up">
      {/* Avatar & name */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="w-20 h-20 rounded-3xl bg-gold-gradient flex items-center justify-center text-ocean-950 font-bold text-3xl shadow-gold-glow">
          {name[0]?.toUpperCase() ?? 'W'}
        </div>
        <div className="text-center">
          <h1 className="font-serif font-bold text-xl text-cream">{name}</h1>
          <p className="text-sm text-slate-text mt-0.5">{phone}</p>
        </div>
        <button className="btn-ghost px-5 py-2 rounded-full text-xs">Edit profile</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Trips', value: '2' },
          { label: 'Countries', value: '2' },
          { label: 'Saved', value: '$340' },
        ].map(stat => (
          <div key={stat.label} className="glass-card rounded-2xl p-3 text-center">
            <p className="text-xl font-bold text-gradient-gold">{stat.value}</p>
            <p className="text-[10px] text-slate-text mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="glass-card rounded-2xl overflow-hidden mb-4 animate-fade-up delay-200">
        {MENU_ITEMS.map(({ icon: Icon, label }, i) => (
          <button
            key={label}
            className="w-full flex items-center gap-4 px-4 py-4 hover:bg-ocean-700/40 transition-colors"
            style={{ borderTop: i > 0 ? '1px solid rgba(196,149,64,0.06)' : undefined }}
          >
            <div className="w-9 h-9 rounded-xl bg-ocean-700/60 flex items-center justify-center">
              <Icon className="w-4 h-4 text-slate-text" />
            </div>
            <span className="flex-1 text-sm text-cream text-left">{label}</span>
            <ChevronRight className="w-4 h-4 text-slate-text" />
          </button>
        ))}
      </div>

      {/* Sign out */}
      <button
        onClick={() => router.push('/onboarding')}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-danger/30 text-danger text-sm hover:bg-danger/8 transition-all"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </div>
  )
}
