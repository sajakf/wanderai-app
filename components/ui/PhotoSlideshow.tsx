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
  overlayOpacity?: number        // 0–1, applied as dark overlay
  className?: string
  showLocation?: boolean
  children?: React.ReactNode     // content layered above
}

const TRANSITION_MS = 1100

export function PhotoSlideshow({
  photos,
  intervalMs = 6500,
  overlayOpacity = 0.50,
  className,
  showLocation = true,
  children,
}: PhotoSlideshowProps) {
  const [current, setCurrent]     = useState(0)
  const [next, setNext]           = useState(1 % photos.length)
  const [isTransitioning, setTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const advance = useCallback(() => {
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(prev => {
        const n = (prev + 1) % photos.length
        setNext((n + 1) % photos.length)
        return n
      })
      setTransitioning(false)
    }, TRANSITION_MS)
  }, [photos.length])

  useEffect(() => {
    timerRef.current = setInterval(advance, intervalMs)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [advance, intervalMs])

  const slideStyle = (entering: boolean): React.CSSProperties => ({
    position:   'absolute',
    inset:      0,
    opacity:    entering
      ? (isTransitioning ? 1 : 0)
      : (isTransitioning ? 0 : 1),
    transform:  entering
      ? (isTransitioning ? 'translateX(0) scale(1)'    : 'translateX(3%) scale(1.02)')
      : (isTransitioning ? 'translateX(-3%) scale(1)'  : 'translateX(0) scale(1)'),
    transition: `opacity ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1), transform ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1)`,
    willChange: 'opacity, transform',
  })

  return (
    <div className={cn('relative overflow-hidden', className)}>

      {/* ── Photo layers ── */}
      <div style={slideStyle(false)}>
        <img
          src={photos[current].url}
          alt={photos[current].location}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
      </div>
      <div style={slideStyle(true)}>
        <img
          src={photos[next].url}
          alt={photos[next].location}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* ── Dark overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(7,24,32,${overlayOpacity * 0.7}) 0%,
            rgba(7,24,32,${overlayOpacity * 0.45}) 35%,
            rgba(7,24,32,${overlayOpacity * 0.55}) 65%,
            rgba(7,24,32,${overlayOpacity * 0.85}) 100%
          )`,
        }}
      />

      {/* ── Location badge ── */}
      {showLocation && (
        <div className="absolute bottom-6 left-6 z-10 flex items-center gap-1.5 transition-all duration-700">
          <div className="flex items-center gap-1.5 bg-ocean-950/50 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5">
            <MapPin className="w-3 h-3 text-gold-400" />
            <span className="text-[11px] text-cream/80 font-medium tracking-wide">
              {isTransitioning ? photos[next].location : photos[current].location}
            </span>
          </div>
        </div>
      )}

      {/* ── Slide dots ── */}
      <div className="absolute bottom-6 right-6 z-10 flex items-center gap-1.5">
        {photos.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width:  i === (isTransitioning ? next : current) ? 20 : 5,
              height: 5,
              background: i === (isTransitioning ? next : current)
                ? '#C49540'
                : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>

      {/* ── Content slot ── */}
      {children && (
        <div className="relative z-10 h-full">{children}</div>
      )}
    </div>
  )
}
