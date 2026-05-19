'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface SlideVideo {
  id: number          // Mixkit video ID
  scene: string       // short scene label shown in badge
  mood?: 'water' | 'flora' | 'macro' | 'forest' | 'aerial'
}

interface VideoSlideshowProps {
  videos: SlideVideo[]
  overlayOpacity?: number   // 0–1, dark overlay strength
  className?: string
  showScene?: boolean       // show bottom-left scene label
  children?: React.ReactNode
}

const BASE = 'https://assets.mixkit.co/videos'
const FADE_MS = 1200

function videoUrl(id: number) {
  return `${BASE}/${id}/${id}-720.mp4`
}

export function VideoSlideshow({
  videos,
  overlayOpacity = 0.50,
  className,
  showScene = true,
  children,
}: VideoSlideshowProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [nextIdx, setNextIdx]     = useState(1 % videos.length)
  const [fading, setFading]       = useState(false)

  // Two video refs — we swap which one is "active"
  const vidA = useRef<HTMLVideoElement>(null)
  const vidB = useRef<HTMLVideoElement>(null)
  const [slot, setSlot] = useState<'A' | 'B'>('A') // which slot holds the current video

  const activeRef = slot === 'A' ? vidA : vidB
  const nextRef   = slot === 'A' ? vidB : vidA

  // Pre-load the next video src whenever nextIdx changes
  useEffect(() => {
    const el = nextRef.current
    if (!el) return
    el.src = videoUrl(videos[nextIdx].id)
    el.load()
  }, [nextIdx, videos]) // eslint-disable-line react-hooks/exhaustive-deps

  // When a video ends, crossfade to the next one
  const handleEnded = useCallback(() => {
    setFading(true)
    setTimeout(() => {
      // Promote next → active
      setActiveIdx(nextIdx)
      setNextIdx(n => (n + 1) % videos.length)
      setSlot(s => (s === 'A' ? 'B' : 'A'))
      setFading(false)
      // Play the newly promoted slot
      activeRef.current?.play().catch(() => null)
    }, FADE_MS)
  }, [nextIdx, videos.length, activeRef])

  // On mount, start playing slot A
  useEffect(() => {
    vidA.current?.play().catch(() => null)
    // pre-load slot B
    if (vidB.current) {
      vidB.current.src = videoUrl(videos[1 % videos.length].id)
      vidB.current.load()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Attach/detach onEnded to whichever ref is currently active
  useEffect(() => {
    const el = activeRef.current
    if (!el) return
    el.addEventListener('ended', handleEnded)
    // Play if not already (handles slot swap)
    el.play().catch(() => null)
    return () => el.removeEventListener('ended', handleEnded)
  }, [slot, handleEnded, activeRef])

  const videoClass = (isActive: boolean) =>
    cn(
      'absolute inset-0 w-full h-full object-cover transition-opacity',
      `duration-[${FADE_MS}ms]`,
      isActive ? (fading ? 'opacity-0' : 'opacity-100') : 'opacity-0',
    )

  // Inline style for transition since Tailwind can't use dynamic duration
  const videoStyle = (isActive: boolean): React.CSSProperties => ({
    position:   'absolute',
    inset:      0,
    width:      '100%',
    height:     '100%',
    objectFit:  'cover',
    opacity:    isActive ? (fading ? 0 : 1) : (fading ? 1 : 0),
    transition: `opacity ${FADE_MS}ms cubic-bezier(0.4,0,0.2,1)`,
    willChange: 'opacity',
  })

  const currentVideo = videos[activeIdx]
  const nextVideo    = videos[nextIdx]

  return (
    <div className={cn('relative overflow-hidden bg-ocean-950', className)}>

      {/* ── Video layer A ── */}
      <video
        ref={vidA}
        muted
        playsInline
        preload="auto"
        src={videoUrl(videos[0].id)}
        style={videoStyle(slot === 'A')}
      />

      {/* ── Video layer B ── */}
      <video
        ref={vidB}
        muted
        playsInline
        preload="auto"
        style={videoStyle(slot === 'B')}
      />

      {/* ── Cinematic dark overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(7,24,32,${(overlayOpacity * 0.65).toFixed(2)}) 0%,
            rgba(7,24,32,${(overlayOpacity * 0.38).toFixed(2)}) 30%,
            rgba(7,24,32,${(overlayOpacity * 0.45).toFixed(2)}) 65%,
            rgba(7,24,32,${(overlayOpacity * 0.88).toFixed(2)}) 100%
          )`,
        }}
      />

      {/* ── Scene label ── */}
      {showScene && (
        <div className="absolute bottom-6 left-6 z-10">
          <div className="flex items-center gap-2 bg-ocean-950/50 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5">
            {/* Tiny animated pulse dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500" />
            </span>
            <span className="text-[11px] text-cream/80 font-medium tracking-wide">
              {fading ? nextVideo.scene : currentVideo.scene}
            </span>
          </div>
        </div>
      )}

      {/* ── Progress dots ── */}
      <div className="absolute bottom-6 right-6 z-10 flex items-center gap-1.5">
        {videos.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width:      i === (fading ? nextIdx : activeIdx) ? 20 : 5,
              height:     5,
              background: i === (fading ? nextIdx : activeIdx)
                ? '#C49540'
                : 'rgba(255,255,255,0.28)',
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
