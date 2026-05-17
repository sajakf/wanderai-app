'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { PhotoSlideshow } from '@/components/ui/PhotoSlideshow'
import { Button } from '@/components/ui/Button'
import { AUTH_PHOTOS } from '@/lib/photos'
import { cn } from '@/lib/utils'

const COUNTRY_CODES = [
  { code: '+965', flag: '🇰🇼', country: 'Kuwait'       },
  { code: '+966', flag: '🇸🇦', country: 'Saudi Arabia' },
  { code: '+971', flag: '🇦🇪', country: 'UAE'          },
  { code: '+974', flag: '🇶🇦', country: 'Qatar'        },
  { code: '+973', flag: '🇧🇭', country: 'Bahrain'      },
  { code: '+968', flag: '🇴🇲', country: 'Oman'         },
  { code: '+1',   flag: '🇺🇸', country: 'USA'          },
  { code: '+44',  flag: '🇬🇧', country: 'UK'           },
  { code: '+91',  flag: '🇮🇳', country: 'India'        },
  { code: '+33',  flag: '🇫🇷', country: 'France'       },
  { code: '+49',  flag: '🇩🇪', country: 'Germany'      },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [name, setName]               = useState('')
  const [phone, setPhone]             = useState('')
  const [countryCode, setCountryCode] = useState('+965')
  const [showCodes, setShowCodes]     = useState(false)
  const [loading, setLoading]         = useState(false)
  const [errors, setErrors]           = useState<{ name?: string; phone?: string }>({})

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode)

  const validate = () => {
    const e: typeof errors = {}
    if (!name.trim() || name.trim().length < 2) e.name = 'Please enter your full name'
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a valid phone number'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleContinue = async () => {
    if (!validate()) return
    setLoading(true)
    sessionStorage.setItem('wa_name', name.trim())
    sessionStorage.setItem('wa_phone', `${countryCode}${phone.replace(/\D/g, '')}`)
    await new Promise(r => setTimeout(r, 700))
    setLoading(false)
    router.push('/verify')
  }

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">

      {/* ── Full-screen photo slideshow ── */}
      <PhotoSlideshow
        photos={AUTH_PHOTOS}
        intervalMs={7000}
        overlayOpacity={0.52}
        showLocation
        className="absolute inset-0"
      />

      {/* ── Content layer ── */}
      <div className="relative z-10 flex flex-col min-h-dvh px-5 py-10">

        {/* Logo — matches landing page */}
        <div className="animate-fade-up flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-glow">
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" stroke="#071820" strokeWidth="1.6"/>
              <path d="M1 11h20M11 1c-3 3-4.5 6-4.5 10s1.5 7 4.5 10M11 1c3 3 4.5 6 4.5 10s-1.5 7-4.5 10" stroke="#071820" strokeWidth="1.6"/>
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-[0.2em] uppercase text-cream">WanderAI</span>
        </div>

        {/* Centre: tagline */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          <div className="animate-fade-up delay-100 mb-12">
            <p className="text-xs tracking-[0.35em] uppercase text-cream/60 mb-3 font-light">Your AI travel companion</p>
            <h1 className="font-serif text-5xl sm:text-6xl text-cream leading-[1.05]">
              <span className="block font-light">Pack light.</span>
              <span className="block font-black italic text-gradient-gold">Dream heavy.</span>
            </h1>
          </div>

          {/* Step indicator */}
          <div className="animate-fade-up delay-200 flex items-center gap-2 mb-8">
            <div className="step-dot active" style={{ width: 28 }} />
            <div className="step-dot" style={{ width: 8 }} />
          </div>

          {/* Form card */}
          <div className="animate-fade-up delay-300 w-full max-w-sm">
            <div className="glass-card rounded-3xl p-6" style={{ background: 'rgba(7,24,32,0.72)', backdropFilter: 'blur(20px)' }}>
              <h2 className="font-serif font-bold text-lg text-cream mb-1">Welcome aboard ✦</h2>
              <p className="text-xs text-cream/50 mb-5">Tell us who you are to get started</p>

              <div className="flex flex-col gap-3.5">
                {/* Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
                    className={cn('input-ocean w-full rounded-2xl px-4 py-3.5 text-sm', errors.name && 'border-danger/60')}
                  />
                  {errors.name && <p className="text-[11px] text-danger mt-1.5 pl-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <div className="flex gap-2">
                    {/* Country code picker */}
                    <div className="relative flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowCodes(v => !v)}
                        className="input-ocean h-full px-3 rounded-2xl flex items-center gap-1.5 text-sm min-w-[88px]"
                      >
                        <span>{selectedCountry?.flag}</span>
                        <span className="text-cream/80 text-xs">{countryCode}</span>
                      </button>
                      {showCodes && (
                        <div className="absolute top-full mt-1 left-0 z-50 rounded-2xl py-1 min-w-[200px] max-h-52 overflow-y-auto scrollbar-hide shadow-card"
                          style={{ background: 'rgba(7,24,32,0.97)', backdropFilter: 'blur(16px)', border: '1px solid rgba(196,149,64,0.1)' }}>
                          {COUNTRY_CODES.map(c => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => { setCountryCode(c.code); setShowCodes(false) }}
                              className={cn(
                                'w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-ocean-700/60 transition-colors text-left',
                                c.code === countryCode ? 'text-gold-500' : 'text-cream'
                              )}
                            >
                              <span className="text-base">{c.flag}</span>
                              <span className="flex-1">{c.country}</span>
                              <span className="text-cream/40">{c.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={phone}
                      onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: undefined })) }}
                      className={cn('input-ocean flex-1 rounded-2xl px-4 py-3.5 text-sm', errors.phone && 'border-danger/60')}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-danger mt-1.5 pl-1">{errors.phone}</p>}
                </div>
              </div>

              <Button fullWidth loading={loading} onClick={handleContinue} size="lg" className="mt-5 rounded-2xl">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>

              <p className="text-center text-[11px] text-cream/35 mt-4 leading-relaxed">
                By continuing you agree to our{' '}
                <span className="text-gold-500/80 cursor-pointer">Terms</span> &{' '}
                <span className="text-gold-500/80 cursor-pointer">Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
