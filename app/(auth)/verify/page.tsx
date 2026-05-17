'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, ArrowLeft, RefreshCw } from 'lucide-react'
import { OTPInput } from '@/components/ui/OTPInput'
import { Button } from '@/components/ui/Button'

export default function VerifyPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('wa_phone') ?? ''
    setPhone(stored)
  }, [])

  // Countdown timer
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
    try {
      // TODO: verify OTP via Supabase when keys are ready
      // const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' })
      await new Promise(r => setTimeout(r, 1200)) // mock delay
      if (otp === '000000') { // mock success for demo
        router.replace('/home')
      } else {
        setError('Incorrect code. Try 000000 for the demo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    setCanResend(false)
    setCountdown(60)
    setError('')
    // TODO: resend via Supabase
  }

  return (
    <main className="min-h-dvh bg-ocean-gradient flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Background orbs */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-gold-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-success/5 blur-[80px] pointer-events-none" />

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="absolute top-8 left-6 flex items-center gap-2 text-sm text-slate-text hover:text-cream transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Logo */}
      <div className="animate-fade-up flex flex-col items-center gap-3 mb-12">
        <div className="w-14 h-14 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-gold-glow">
          <Globe className="w-7 h-7 text-ocean-950" />
        </div>
      </div>

      {/* Step indicator */}
      <div className="animate-fade-up delay-100 flex items-center gap-2 mb-8">
        <div className="step-dot" style={{ width: 8 }} />
        <div className="step-dot active" style={{ width: 28 }} />
      </div>

      {/* Card */}
      <div className="animate-fade-up delay-200 glass-card rounded-3xl p-6 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 mb-4">
            <span className="text-3xl">✉️</span>
          </div>
          <h2 className="font-serif font-bold text-xl text-cream mb-2">Check your phone</h2>
          <p className="text-sm text-slate-text leading-relaxed">
            We sent a 6-digit code to{' '}
            <span className="text-cream font-medium">{maskedPhone}</span>
          </p>
        </div>

        {/* OTP input */}
        <OTPInput onComplete={handleOTPComplete} disabled={loading} />

        {error && (
          <p className="text-center text-xs text-danger mt-4 animate-fade-in">{error}</p>
        )}

        {loading && (
          <p className="text-center text-xs text-slate-text mt-4 animate-pulse">Verifying…</p>
        )}

        {/* Resend */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {canResend ? (
            <button
              onClick={handleResend}
              className="flex items-center gap-1.5 text-sm text-gold-500 hover:text-gold-400 transition-colors font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Resend code
            </button>
          ) : (
            <p className="text-sm text-slate-text">
              Resend in <span className="text-cream font-medium tabular-nums">{countdown}s</span>
            </p>
          )}
        </div>

        {/* Demo hint */}
        <div className="mt-6 p-3 rounded-xl bg-gold-500/8 border border-gold-500/15 text-center">
          <p className="text-xs text-gold-500/80">
            🧪 Demo mode — enter <span className="font-bold font-mono">000000</span> to continue
          </p>
        </div>
      </div>
    </main>
  )
}
