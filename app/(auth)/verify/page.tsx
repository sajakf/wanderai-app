'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { PhotoSlideshow } from '@/components/ui/PhotoSlideshow'
import { OTPInput } from '@/components/ui/OTPInput'
import { AUTH_PHOTOS } from '@/lib/photos'

// Start from a different photo so it feels like a continuation
const VERIFY_PHOTOS = [...AUTH_PHOTOS.slice(4), ...AUTH_PHOTOS.slice(0, 4)]

export default function VerifyPage() {
  const router  = useRouter()
  const [phone, setPhone]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    setPhone(sessionStorage.getItem('wa_phone') ?? '')
  }, [])

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const maskedPhone = phone
    ? phone.slice(0, -4).replace(/\d/g, '•') + phone.slice(-4)
    : '••••••••'

  const handleOTPComplete = async (otp: string) => {
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 1100))
    if (otp === '000000') {
      router.replace('/home')
    } else {
      setError('Incorrect code — use 000000 for demo')
    }
    setLoading(false)
  }

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">

      {/* ── Full-screen photo slideshow ── */}
      <PhotoSlideshow
        photos={VERIFY_PHOTOS}
        intervalMs={7000}
        overlayOpacity={0.52}
        showLocation
        className="absolute inset-0"
      />

      {/* ── Content layer ── */}
      <div className="relative z-10 flex flex-col min-h-dvh px-5 py-10">

        {/* Header */}
        <div className="animate-fade-up flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-glow">
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="10" stroke="#071820" strokeWidth="1.6"/>
                <path d="M1 11h20M11 1c-3 3-4.5 6-4.5 10s1.5 7 4.5 10M11 1c3 3 4.5 6 4.5 10s-1.5 7-4.5 10" stroke="#071820" strokeWidth="1.6"/>
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-cream">WanderAI</span>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs text-cream/60 hover:text-cream transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>

        {/* Centre */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">

          {/* Tagline */}
          <div className="animate-fade-up delay-100 mb-10">
            <h1 className="font-serif text-4xl sm:text-5xl text-cream leading-tight">
              <span className="block font-light">Pack light.</span>
              <span className="block font-black italic text-gradient-gold">Dream heavy.</span>
            </h1>
          </div>

          {/* Step indicator */}
          <div className="animate-fade-up delay-200 flex items-center gap-2 mb-8">
            <div className="step-dot" style={{ width: 8 }} />
            <div className="step-dot active" style={{ width: 28 }} />
          </div>

          {/* OTP card */}
          <div className="animate-fade-up delay-300 w-full max-w-sm">
            <div className="glass-card rounded-3xl p-6" style={{ background: 'rgba(7,24,32,0.72)', backdropFilter: 'blur(20px)' }}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 text-2xl"
                  style={{ background: 'rgba(196,149,64,0.12)', border: '1px solid rgba(196,149,64,0.2)' }}>
                  📱
                </div>
                <h2 className="font-serif font-bold text-lg text-cream mb-1.5">Check your phone</h2>
                <p className="text-xs text-cream/50 leading-relaxed">
                  We sent a 6-digit code to{' '}
                  <span className="text-cream/80 font-medium">{maskedPhone}</span>
                </p>
              </div>

              <OTPInput onComplete={handleOTPComplete} disabled={loading} />

              {error && (
                <p className="text-center text-[11px] text-danger mt-3 animate-fade-in">{error}</p>
              )}
              {loading && (
                <p className="text-center text-[11px] text-cream/40 mt-3 animate-pulse">Verifying…</p>
              )}

              {/* Resend */}
              <div className="flex items-center justify-center mt-5">
                {canResend ? (
                  <button onClick={() => { setCanResend(false); setCountdown(60) }}
                    className="flex items-center gap-1.5 text-xs text-gold-500 hover:text-gold-400 transition-colors font-medium">
                    <RefreshCw className="w-3 h-3" /> Resend code
                  </button>
                ) : (
                  <p className="text-xs text-cream/40">
                    Resend in <span className="text-cream/70 font-semibold tabular-nums">{countdown}s</span>
                  </p>
                )}
              </div>

              {/* Demo hint */}
              <div className="mt-4 p-3 rounded-xl text-center" style={{ background: 'rgba(196,149,64,0.07)', border: '1px solid rgba(196,149,64,0.15)' }}>
                <p className="text-[10px] text-gold-500/70">
                  🧪 Demo — enter <span className="font-bold font-mono tracking-widest">000000</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
