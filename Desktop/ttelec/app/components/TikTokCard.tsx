'use client'
import { useState, useEffect, useRef, memo } from 'react'

interface Props {
  videoId: string
  index: number
  onExpand: () => void
}

function TikTokCard({ videoId, index, onExpand }: Props) {
  const [iframeActive, setIframeActive] = useState(false)
  const [thumb, setThumb] = useState<string | null>(null)
  const [thumbFailed, setThumbFailed] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Fetch thumbnail only when card enters viewport
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        obs.disconnect()
        fetch(`/api/tiktok-thumb?id=${videoId}`)
          .then(r => r.json())
          .then(d => { if (d.thumbnail_url) setThumb(d.thumbnail_url) })
          .catch(() => {})
      },
      { rootMargin: '300px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [videoId])

  const handlePlay = () => setIframeActive(true)

  return (
    <div ref={ref} className={`tkc rv${index > 0 ? ` d${index}` : ''}`}>

      {/* ── IFRAME (loaded on demand) ── */}
      {iframeActive && (
        <iframe
          src={`https://www.tiktok.com/embed/v2/${videoId}`}
          className="tk-iframe"
          allow="encrypted-media; fullscreen; autoplay"
          allowFullScreen
          loading="lazy"
        />
      )}

      {/* ── THUMBNAIL (shown until iframe loads) ── */}
      {!iframeActive && (
        <button className="tk-thumb" onClick={handlePlay} aria-label="Jouer la vidéo TikTok">
          {thumb && !thumbFailed ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={thumb}
              alt="TikTok TT Elec"
              className="tk-thumb-img"
              loading={index < 2 ? 'eager' : 'lazy'}
              onError={() => setThumbFailed(true)}
            />
          ) : (
            <div className="tk-thumb-placeholder">
              <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.08)" width="64" height="64">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.76a8.18 8.18 0 0 0 4.84 1.55V6.85a4.86 4.86 0 0 1-1.07-.16z"/>
              </svg>
            </div>
          )}

          {/* Play button */}
          <div className="tk-play-btn">
            <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>

          {/* Bottom label */}
          <div className="tk-thumb-label">
            <svg viewBox="0 0 24 24" fill="white" width="11" height="11">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.76a8.18 8.18 0 0 0 4.84 1.55V6.85a4.86 4.86 0 0 1-1.07-.16z"/>
            </svg>
            Appuyer pour jouer
          </div>
        </button>
      )}

      {/* ── EXPAND TO MODAL ── */}
      <button
        className="tk-expand-btn"
        onClick={e => { e.stopPropagation(); onExpand() }}
        aria-label="Voir en plein écran"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
      </button>

      {/* ── VOIR SUR TIKTOK ── */}
      <div className="tk-overlay">
        <a
          href={`https://www.tiktok.com/@tt.elec/video/${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="tk-watch"
          onClick={e => e.stopPropagation()}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.76a8.18 8.18 0 0 0 4.84 1.55V6.85a4.86 4.86 0 0 1-1.07-.16z"/>
          </svg>
          Voir sur TikTok
        </a>
      </div>
    </div>
  )
}

export default memo(TikTokCard)
