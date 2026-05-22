'use client'
import { useEffect, useCallback } from 'react'

type MediaItem = { url: string; type: string; label?: string }

interface LightboxProps {
  media: MediaItem[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({ media, index, onClose, onPrev, onNext }: LightboxProps) {
  const item = media[index]

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowLeft') onPrev()
    else if (e.key === 'ArrowRight') onNext()
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onKey])

  if (!item) return null

  return (
    <div className="lb-overlay" onClick={onClose}>
      <button className="lb-close" onClick={onClose} aria-label="Fermer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {media.length > 1 && (
        <div className="lb-counter">{index + 1} / {media.length}</div>
      )}

      <div className="lb-inner" onClick={e => e.stopPropagation()}>
        {item.type === 'video'
          ? <video key={item.url} src={item.url} controls autoPlay className="lb-media" />
          : <img src={item.url} alt="" className="lb-media" />
        }
      </div>

      {item.label && (
        <div className="lb-badge">{item.label === 'avant' ? 'Avant' : 'Après'}</div>
      )}

      {media.length > 1 && (
        <>
          <button className="lb-prev" onClick={e => { e.stopPropagation(); onPrev() }} aria-label="Précédent">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className="lb-next" onClick={e => { e.stopPropagation(); onNext() }} aria-label="Suivant">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}
