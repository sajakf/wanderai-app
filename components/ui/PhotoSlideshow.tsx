'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SlidePhoto {
  url: string
  location: string
  mood?: string
}

interface PhotoSlideshowProps {
  photos: SlidePhoto[]
  intervalMs?: number
  overlayOpacity?: number
  className?: string
  showLocation?: boolean
  children?: React.ReactNode
}

const TRANSITION_MS = 1400

export function PhotoSlideshow({
  photos,
  intervalMs = 6000,
  overlayOpacity = 0.50,
  className,
  showLocation = true,
  children,
}: PhotoSlideshowProps) {
  // base = always fully visible underneath (opacity 1, z-index 1)
  // top  = fades in on top (z-index 2), then becomes the new base
  const [baseIdx, setBaseIdx] = useState(0)
  const [topIdx,  setTopIdx]  = useState(1 % photos.length)
  const [topOpacity, setTopOpacity] = useState(0)  // 0 = invisible, 1 = fully in
  const isFading = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const advance = useCallback(() => {
    if (isFading.current) return
    isFading.current = true

    // Fade the top layer in
    setTopOpacity(1)

    setTimeout(() => {
      // Top is now fully visible — promote it to base, queue next top
      setBaseIdx(prev => {
        const next = (prev + 1) % photos.length
        // Queue the slot after that as the new top (hidden)
        setTopIdx((next + 1) % photos.length)
        setTopOpacity(0)           // reset top to invisible (no transition — instant)
        return next
      })
      isFading.current = false
    }, TRANSITION_MS)
  }, [photos.length])

  useEffect(() => {
    timerRef.current = setInterval(advance, intervalMs)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [advance, intervalMs])

  return (
    <div className={cn('relative overflow-hidden bg-black', className)}>

      {/* ── Base layer — always opacity 1, never fades out ── */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <img
          src={photos[baseIdx].url}
          alt={photos[baseIdx].location}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: 'scale(1.04)',
            transition: `transform ${intervalMs + TRANSITION_MS}ms linear`,
          }}
          loading="eager"
        />
      </div>

      {/* ── Top layer — fades in over the base, never fades out ── */}
      <div
        className="absolute inset-0"
        style={{
          zIndex:     2,
          opacity:    topOpacity,
          transition: topOpacity === 1
            ? `opacity ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1)`
            : 'none',   // instant reset — no flash
        }}
      >
        <img
          src={photos[topIdx].url}
          alt={photos[topIdx].location}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scale(1.04)' }}
          loading="eager"
        />
      </div>

      {/* ── Dark overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: `linear-gradient(
            to bottom,
            rgba(7,24,32,${(overlayOpacity * 0.65).toFixed(2)}) 0%,
            rgba(7,24,32,${(overlayOpacity * 0.38).toFixed(2)}) 35%,
            rgba(7,24,32,${(overlayOpacity * 0.50).toFixed(2)}) 65%,
            rgba(7,24,32,${(overlayOpacity * 0.88).toFixed(2)}) 100%
          )`,
        }}
      />

      {/* ── Location badge ── */}
      {showLocation && (
        <div className="absolute bottom-6 left-6 pointer-events-none" style={{ zIndex: 4 }}>
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5">
            <MapPin className="w-3 h-3 text-gold-400 flex-shrink-0" />
            <span className="text-[11px] text-cream/80 font-medium tracking-wide">
              {topOpacity > 0 ? photos[topIdx].location : photos[baseIdx].location}
            </span>
          </div>
        </div>
      )}

      {/* ── Progress dots ── */}
      <div className="absolute bottom-6 right-6 flex items-center gap-1.5" style={{ zIndex: 4 }}>
        {photos.map((_, i) => {
          const active = topOpacity > 0 ? i === topIdx : i === baseIdx
          return (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width:      active ? 20 : 5,
                height:     5,
                background: active ? '#C49540' : 'rgba(255,255,255,0.28)',
              }}
            />
          )
        })}
      </div>

      {/* ── Content slot ── */}
      {children && (
        <div className="relative h-full" style={{ zIndex: 5 }}>{children}</div>
      )}
    </div>
  )
}
