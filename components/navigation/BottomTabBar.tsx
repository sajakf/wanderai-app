'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageSquare, BookOpen, Compass, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/home',     icon: Home,          label: 'Home',    labelAr: 'الرئيسية' },
  { href: '/chat',     icon: MessageSquare, label: 'Plan',    labelAr: 'خطط'      },
  { href: '/explore',  icon: Compass,       label: 'Explore', labelAr: 'اكتشف'    },
  { href: '/bookings', icon: BookOpen,      label: 'Trips',   labelAr: 'رحلاتي'   },
  { href: '/profile',  icon: User,          label: 'Me',      labelAr: 'أنا'      },
] as const

interface BottomTabBarProps {
  dir?: 'ltr' | 'rtl'
}

export function BottomTabBar({ dir = 'ltr' }: BottomTabBarProps) {
  const pathname = usePathname()

  return (
    <nav
      className="tab-bar fixed bottom-0 left-0 right-0 z-50 safe-bottom"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {TABS.map(({ href, icon: Icon, label, labelAr }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0 flex-1',
                active ? 'text-gold-500' : 'text-slate-text hover:text-cream/70'
              )}
            >
              <div className={cn(
                'relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300',
                active && 'bg-gold-500/12'
              )}>
                <Icon className={cn('w-5 h-5 transition-all duration-200', active && 'scale-110')} />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-500" />
                )}
              </div>
              <span className={cn(
                'text-[10px] font-medium tracking-wide tab-bar-label transition-all duration-200',
                active ? 'opacity-100' : 'opacity-60'
              )}>
                {dir === 'rtl' ? labelAr : label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
