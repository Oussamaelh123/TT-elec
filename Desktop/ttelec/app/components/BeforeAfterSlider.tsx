'use client'
import { useState, useRef, useCallback, useEffect, memo } from 'react'
import Image from 'next/image'

type MediaItem = { url: string; type: string; label?: string }

function BeforeAfterSlider({ media, onOpen }: { media: MediaItem[]; onOpen?: () => void }) {
  const avant = media.find(m => m.label === 'avant') ?? media[0]
  const apres = media.find(m => m.label === 'apres') ?? media[1]
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const startX = useRef<number | null>(null)
  const dragging = useRef(false)
  const pendingX = useRef<number | null>(null)
  const rafId = useRef<number | null>(null)

  useEffect(() => () => { if (rafId.current) cancelAnimationFrame(rafId.current) }, [])

  const flushPos = useCallback(() => {
    if (pendingX.current !== null && containerRef.current) {
      const r = containerRef.current.getBoundingClientRect()
      setPos(Math.max(4, Math.min(96, ((pendingX.current - r.left) / r.width) * 100)))
      pendingX.current = null
    }
    rafId.current = null
  }, [])

  const onPD = (e: React.PointerEvent) => {
    startX.current = e.clientX
    dragging.current = false
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPM = (e: React.PointerEvent) => {
    if (startX.current === null) return
    if (!dragging.current && Math.abs(e.clientX - startX.current) > 5) dragging.current = true
    if (dragging.current) {
      pendingX.current = e.clientX
      if (!rafId.current) rafId.current = requestAnimationFrame(flushPos)
    }
  }
  const onPU = () => {
    if (!dragging.current) onOpen?.()
    dragging.current = false
    startX.current = null
  }

  const playAll = () => containerRef.current?.querySelectorAll('video').forEach(v => v.play().catch(() => {}))
  const pauseAll = () => containerRef.current?.querySelectorAll('video').forEach(v => { v.pause(); v.currentTime = 0 })

  const isSupabase = (url: string) => url.includes('supabase.co') || url.includes('cloudinary.com')

  const med = (item: MediaItem, priority = false) => {
    if (item.type === 'video') {
      return (
        <video
          key={item.url}
          src={item.url}
          muted
          loop
          playsInline
          preload="metadata"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
        />
      )
    }
    if (isSupabase(item.url)) {
      return (
        <div key={item.url} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: '#13203a' }}>
          <Image
            fill
            src={item.url}
            alt=""
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
            quality={85}
            priority={priority}
          />
        </div>
      )
    }
    return (
      <div
        key={item.url}
        style={{ position: 'absolute', inset: 0, backgroundImage: `url("${item.url}")`, backgroundSize: 'cover', backgroundPosition: 'center', pointerEvents: 'none' }}
      />
    )
  }

  if (!avant || !apres || avant.url === apres.url) {
    const item = avant ?? media[0]
    if (!item) return null
    if (item.type === 'video') {
      return (
        <video
          src={item.url}
          muted
          loop
          playsInline
          preload="metadata"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )
    }
    if (isSupabase(item.url)) {
      return (
        <div style={{ position: 'absolute', inset: 0, background: '#13203a' }}>
          <Image fill src={item.url} alt="" sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} quality={85} />
        </div>
      )
    }
    return <div className="gv-bg" style={{ backgroundImage: `url("${item.url}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
  }

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, userSelect: 'none', cursor: 'ew-resize', touchAction: 'none' }}
      onPointerDown={onPD}
      onPointerMove={onPM}
      onPointerUp={onPU}
      onPointerCancel={onPU}
      onMouseEnter={playAll}
      onMouseLeave={pauseAll}
    >
      {med(avant, true)}
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${pos}%)`, pointerEvents: 'none' }}>
        {med(apres)}
      </div>
      <div className="bas-line" style={{ left: `${pos}%` }} />
      <div className="bas-handle" style={{ left: `${pos}%` }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12H3M15 6l6 6-6 6M9 6l-6 6 6 6" />
        </svg>
      </div>
      <span className="gvt bef bas-badge-l">Avant</span>
      <span className="gvt aft bas-badge-r">Après</span>
    </div>
  )
}

export default memo(BeforeAfterSlider)
