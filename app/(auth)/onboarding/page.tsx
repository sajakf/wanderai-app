'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, User, ArrowRight, Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

const COUNTRY_CODES = [
  { code: '+965', flag: '🇰🇼', country: 'Kuwait' },
  { code: '+966', flag: '🇸🇦', country: 'Saudi Arabia' },
  { code: '+971', flag: '🇦🇪', country: 'UAE' },
  { code: '+974', flag: '🇶🇦', country: 'Qatar' },
  { code: '+973', flag: '🇧🇭', country: 'Bahrain' },
  { code: '+968', flag: '🇴🇲', country: 'Oman' },
  { code: '+1',   flag: '🇺🇸', country: 'USA' },
  { code: '+44',  flag: '🇬🇧', country: 'UK' },
  { code: '+91',  flag: '🇮🇳', country: 'India' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+965')
  const [showCodes, setShowCodes] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode)

  const validate = () => {
    const e: typeof errors = {}
    if (!name.trim() || name.trim().length < 2) e.name = 'Please enter your full name'
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) e.phone = 'Please enter a valid phone number'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = async () => {
    if (!validate()) return
    setLoading(true)
    // Store in session/localStorage for the verify step
    sessionStorage.setItem('wa_name', name.trim())
    sessionStorage.setItem('wa_phone', `${countryCode}${phone.replace(/\D/g, '')}`)
    // TODO: call Supabase phone OTP when keys are ready
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    router.push('/verify')
  }

  return (
    <main className="min-h-dvh bg-ocean-gradient flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-success/5 blur-[80px] pointer-events-none" />

      {/* Logo */}
      <div className="animate-fade-up flex flex-col items-center gap-3 mb-12">
        <div className="w-14 h-14 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-gold-glow">
          <Globe className="w-7 h-7 text-ocean-950" />
        </div>
        <div className="text-center">
          <h1 className="font-serif font-bold text-2xl text-cream tracking-tight">WanderAI</h1>
          <p className="text-xs text-slate-text tracking-widest uppercase mt-0.5">Your AI travel companion</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="animate-fade-up delay-100 flex items-center gap-2 mb-8">
        <div className="step-dot active" style={{ width: 28 }} />
        <div className="step-dot" style={{ width: 8 }} />
      </div>

      {/* Card */}
      <div className="animate-fade-up delay-200 glass-card rounded-3xl p-6 w-full max-w-sm">
        <div className="mb-6">
          <h2 className="font-serif font-bold text-xl text-cream mb-1">Welcome aboard ✦</h2>
          <p className="text-sm text-slate-text">Tell us who you are to get started</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <Input
            label="Your name"
            placeholder="e.g. Sara Al-Ahmad"
            value={name}
            onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
            icon={User}
            error={errors.name}
          />

          {/* Phone with country code */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-text tracking-wider uppercase">
              Phone number
            </label>
            <div className="flex gap-2">
              {/* Country code picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCodes(v => !v)}
                  className="input-ocean h-full px-3 rounded-2xl flex items-center gap-1.5 text-sm whitespace-nowrap min-w-[90px]"
                >
                  <span>{selectedCountry?.flag}</span>
                  <span className="text-cream/80">{countryCode}</span>
                </button>
                {showCodes && (
                  <div className="absolute top-full mt-1 left-0 z-50 glass-card rounded-2xl py-1 min-w-[200px] max-h-52 overflow-y-auto shadow-card">
                    {COUNTRY_CODES.map(c => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => { setCountryCode(c.code); setShowCodes(false) }}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-ocean-700/60 transition-colors text-left',
                          c.code === countryCode ? 'text-gold-500' : 'text-cream'
                        )}
                      >
                        <span>{c.flag}</span>
                        <span className="flex-1">{c.country}</span>
                        <span className="text-slate-text text-xs">{c.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Number input */}
              <input
                type="tel"
                placeholder="5X XXX XXXX"
                value={phone}
                onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: undefined })) }}
                className="input-ocean flex-1 rounded-2xl px-4 py-3.5 text-sm"
              />
            </div>
            {errors.phone && <p className="text-xs text-danger">{errors.phone}</p>}
          </div>
        </div>

        <Button
          className="mt-6"
          fullWidth
          loading={loading}
          onClick={handleContinue}
          size="lg"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>

        <p className="text-center text-xs text-slate-text mt-4 leading-relaxed">
          By continuing you agree to our{' '}
          <span className="text-gold-500 cursor-pointer hover:underline">Terms</span> &{' '}
          <span className="text-gold-500 cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </div>
    </main>
  )
}
