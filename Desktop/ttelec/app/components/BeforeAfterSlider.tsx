'use client'
import { useState, useRef, useCallback } from 'react'

type MediaItem = { url: string; type: string; label?: string }

export default function BeforeAfterSlider({ media, onOpen }: { media: MediaItem[]; onOpen?: () => void }) {
  const avant = media.find(m => m.label === 'avant') ?? media[0]
  const apres = media.find(m => m.label === 'apres') ?? media[1]
  const [pos, setPos] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const startX = useRef<number | null>(null)
  const dragging = useRef(false)

  const calc = useCallback((clientX: number) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)))
  }, [])

  const onPD = (e: React.PointerEvent) => {
    startX.current = e.clientX
    dragging.current = false
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPM = (e: React.PointerEvent) => {
    if (startX.current === null) return
    if (!dragging.current && Math.abs(e.clientX - startX.current) > 5) {
      dragging.current = true
    }
    if (dragging.current) calc(e.clientX)
  }
  const onPU = () => {
    if (!dragging.current) onOpen?.()
    dragging.current = false
    startX.current = null
  }

  const med = (item: MediaItem) => item.type === 'video'
    ? <video key={item.url} src={item.url} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    : <div key={item.url} style={{ position: 'absolute', inset: 0, backgroundImage: `url("${item.url}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />

  if (!avant || !apres || avant.url === apres.url) {
    const item = avant ?? media[0]
    if (!item) return null
    return item.type === 'video'
      ? <video src={item.url} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      : <div className="gv-bg" style={{ backgroundImage: `url("${item.url}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
  }

  return (
    <div
      ref={ref}
      style={{ position: 'absolute', inset: 0, userSelect: 'none', cursor: 'ew-resize', touchAction: 'none' }}
      onPointerDown={onPD}
      onPointerMove={onPM}
      onPointerUp={onPU}
      onPointerCancel={onPU}
    >
      {med(apres)}
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {med(avant)}
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
