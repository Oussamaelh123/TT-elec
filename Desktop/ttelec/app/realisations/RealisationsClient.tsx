'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PageEffects from '@/app/components/PageEffects'
import LogoSVG from '@/app/components/LogoSVG'
import BeforeAfterSlider from '@/app/components/BeforeAfterSlider'
import Lightbox from '@/app/components/Lightbox'
import { supabase } from '@/lib/supabase'

type MediaItem = {
  url: string
  type: 'image' | 'video'
  label?: string
}

type Realisation = {
  id: string
  titre: string
  lieu: string
  categorie: string
  date_chantier: string
  tags: string[]
  media: MediaItem[]
  images: string[]
  publie: boolean
}

const PAGE_SIZE = 6

const getMedia = (r: Realisation): MediaItem[] => {
  if (r.media?.length > 0) return r.media
  if (r.images?.length > 0) return r.images.map(url => ({ url, type: 'image' as const }))
  return []
}

const getFirstMedia = (r: Realisation): MediaItem | null => getMedia(r)[0] ?? null

const hasSlider = (r: Realisation): boolean => {
  const labels = r.media?.map(m => m.label) ?? []
  return labels.includes('avant') && labels.includes('apres')
}

const isRemote = (url: string) => url.includes('supabase.co') || url.includes('cloudinary.com')

const categories = ['Tous', 'Tableau', 'Câblage', 'Éclairage', 'Domotique', 'Caméras', 'Conformité', 'Installation', 'Dépannage']

export default function RealisationsClient() {
  const [active, setActive] = useState('Tous')
  const [realisations, setRealisations] = useState<Realisation[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [dispo, setDispo] = useState(true)
  const [lightbox, setLightbox] = useState<{ media: MediaItem[], index: number } | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Initial load
  useEffect(() => {
    async function load() {
      const [{ data }, { data: settingsData }] = await Promise.all([
        supabase
          .from('realisations')
          .select('*')
          .eq('publie', true)
          .order('created_at', { ascending: false })
          .range(0, PAGE_SIZE - 1),
        supabase.from('settings').select('valeur').eq('cle', 'disponible').single(),
      ])
      setRealisations(data ?? [])
      if ((data?.length ?? 0) < PAGE_SIZE) setHasMore(false)
      if (settingsData) setDispo(settingsData.valeur !== 'false')
      setLoading(false)
    }
    load()
  }, [])

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const { data } = await supabase
      .from('realisations')
      .select('*')
      .eq('publie', true)
      .order('created_at', { ascending: false })
      .range(realisations.length, realisations.length + PAGE_SIZE - 1)
    if (data) {
      if (data.length < PAGE_SIZE) setHasMore(false)
      setRealisations(prev => [...prev, ...data])
    }
    setLoadingMore(false)
  }, [loadingMore, hasMore, realisations.length])

  // Infinite scroll observer
  useEffect(() => {
    if (loading) return
    observerRef.current?.disconnect()
    if (!hasMore) return
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore()
    }, { rootMargin: '200px' })
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current)
    return () => observerRef.current?.disconnect()
  }, [loading, hasMore, loadMore])

  // Scroll reveal for dynamically loaded cards
  useEffect(() => {
    if (loading) return
    const timer = setTimeout(() => {
      const ro = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); ro.unobserve(e.target) } }),
        { threshold: .05, rootMargin: '0px 0px -20px 0px' }
      )
      document.querySelectorAll('.real-grid .rv').forEach(el => { if (!el.classList.contains('on')) ro.observe(el) })
    }, 60)
    return () => clearTimeout(timer)
  }, [realisations, loading])

  const filtered = active === 'Tous'
    ? realisations
    : realisations.filter(r => r.categorie?.toLowerCase() === active.toLowerCase())

  const formatDate = (d: string) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('fr-BE', { month: 'long', year: 'numeric' })
  }

  const openLightbox = (r: Realisation, index = 0) => {
    const media = getMedia(r)
    if (media.length > 0) setLightbox({ media, index })
  }
  const closeLightbox = () => setLightbox(null)
  const prevLightbox = () => setLightbox(prev => prev ? { ...prev, index: (prev.index - 1 + prev.media.length) % prev.media.length } : null)
  const nextLightbox = () => setLightbox(prev => prev ? { ...prev, index: (prev.index + 1) % prev.media.length } : null)

  const handleCardEnter = (e: React.MouseEvent<HTMLDivElement>) =>
    e.currentTarget.querySelectorAll('video').forEach(v => v.play().catch(() => {}))
  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) =>
    e.currentTarget.querySelectorAll('video').forEach(v => { v.pause(); v.currentTime = 0 })

  return (
    <>
      {lightbox && (
        <Lightbox
          media={lightbox.media}
          index={lightbox.index}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
        />
      )}

      <PageEffects />

      <nav id="nav">
        <Link href="/" className="nlogo">
          <div className="logo-3d-wrap">
            <LogoSVG />
          </div>
        </Link>
        <div className="nlinks">
          <Link href="/#services" className="nlink">Services</Link>
          <Link href="/realisations" className="nlink" style={{ color: 'var(--gold)' }}>Réalisations</Link>
          <Link href="/#diagnostic" className="nlink">Diagnostic</Link>
          <Link href="/#devis" className="nlink">Contact</Link>
        </div>
        <div className="nright">
          <div className={`nbadge${dispo ? '' : ' nbadge-off'}`}><span className={`ndot${dispo ? '' : ' ndot-off'}`} />{dispo ? ' Disponible' : ' Indisponible'}</div>
          <Link href="/#devis" className="ncta">✦ Devis gratuit</Link>
          <button className="nham" id="nham" aria-label="Menu"><span /><span /><span /></button>
        </div>
      </nav>
      <div className="mob-overlay" id="mob-overlay" />
      <div className="mob-menu" id="mob-menu">
        <Link href="/" className="mob-link">Accueil</Link>
        <Link href="/#services" className="mob-link">Services</Link>
        <Link href="/realisations" className="mob-link">Réalisations</Link>
        <Link href="/#devis" className="mob-link">Contact</Link>
        <div className="mob-sub">
          <Link href="/services/tableau-electrique">Tableau électrique</Link>
          <Link href="/services/cablage">Câblage</Link>
          <Link href="/services/eclairage">Éclairage</Link>
          <Link href="/services/domotique">Domotique</Link>
          <Link href="/services/depannage-urgence">Dépannage urgent</Link>
          <Link href="/services/mise-en-conformite">Mise en conformité</Link>
          <Link href="/services/borne-recharge">Borne de recharge</Link>
          <Link href="/services/alarme-incendie">Alarme & Incendie</Link>
          <Link href="/services/parlophone-visiophone">Parlophone & Visiophone</Link>
        </div>
        <div className="mob-cta">
          <Link href="/#devis" className="mob-cta-btn">✦ Demander un devis</Link>
          <a href="tel:0465904372" className="mob-tel">0465.90.43.72</a>
        </div>
      </div>

      {/* HERO */}
      <section className="real-hero">
        <canvas id="real-particles" />
        <div className="real-hero-inner">
          <div className="real-bc">
            <Link href="/">Accueil</Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            <span>Réalisations</span>
          </div>
          <div className="ovl rv">Portfolio</div>
          <h1 className="stitle rv d1">Nos chantiers <em>réalisés</em></h1>
          <p className="real-sub rv d2">250+ chantiers réalisés à Bruxelles et en Belgique. Chaque intervention est documentée et mise à jour automatiquement via WhatsApp.</p>
          <div className="real-stats rv d3">
            <div className="real-stat"><strong>250+</strong><span>Chantiers</span></div>
            <div className="real-stat"><strong>19</strong><span>Communes</span></div>
            <div className="real-stat"><strong>100%</strong><span>Conforme RGIE</span></div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <div className="real-filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`real-filter${active === cat ? ' active' : ''}`}
            onClick={() => setActive(cat)}
          >
            {cat}
            {cat !== 'Tous' && realisations.filter(r => r.categorie?.toLowerCase() === cat.toLowerCase()).length > 0 && (
              <span className="real-filter-count">
                {realisations.filter(r => r.categorie?.toLowerCase() === cat.toLowerCase()).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* GRID */}
      <section className="real-sec">
        {loading ? (
          <div className="real-empty"><p>Chargement des réalisations...</p></div>
        ) : (
          <>
            <div className="real-grid">
              {filtered.map((r, i) => {
                const media = getMedia(r)
                const first = getFirstMedia(r)
                const slider = hasSlider(r)
                const isPriority = i < 3
                return (
                  <div
                    key={r.id}
                    className={`gc rv${i > 0 ? ` d${Math.min(i, 6)}` : ''}`}
                    onMouseEnter={handleCardEnter}
                    onMouseLeave={handleCardLeave}
                  >
                    <div className="gv">
                      {slider ? (
                        <BeforeAfterSlider media={media} onOpen={() => openLightbox(r)} />
                      ) : (
                        <div
                          style={{ position: 'absolute', inset: 0, cursor: media.length > 0 ? 'zoom-in' : 'default' }}
                          onClick={() => openLightbox(r)}
                        >
                          {first?.type === 'video' ? (
                            <video
                              src={first.url}
                              muted
                              loop
                              playsInline
                              preload="metadata"
                              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                            />
                          ) : first && isRemote(first.url) ? (
                            <div style={{ position: 'relative', width: '100%', height: '100%', background: '#13203a' }}>
                              <Image
                                fill
                                src={first.url}
                                alt={r.titre}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                style={{ objectFit: 'cover' }}
                                quality={85}
                                priority={isPriority}
                                loading={isPriority ? undefined : 'lazy'}
                              />
                            </div>
                          ) : (
                            <div
                              className="gv-bg"
                              style={first ? { backgroundImage: `url("${first.url}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                            />
                          )}
                        </div>
                      )}
                      <div className="gv-grid" style={{ pointerEvents: 'none' }} />
                      {!slider && <span className="gv-label" style={{ pointerEvents: 'none' }}>{r.titre} — {r.lieu}</span>}
                      {!slider && <div className="gv-line" style={{ pointerEvents: 'none' }} />}
                      {!slider && (
                        <div className="gv-handle" style={{ pointerEvents: 'none' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12H3M15 6l6 6-6 6M9 6l-6 6 6 6" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="gi">
                      <div className="git">{r.titre}</div>
                      <div className="gim">{r.lieu} · {formatDate(r.date_chantier)}</div>
                      <div className="gchips">
                        {r.tags?.map(t => <span key={t} className="gchip">{t}</span>)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Sentinel infinite scroll */}
            {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}

            {loadingMore && (
              <div className="real-loading-more">
                <div className="real-spinner" />
              </div>
            )}
          </>
        )}

        {!loading && filtered.length === 0 && (
          <div className="real-empty">
            <p>Aucun chantier dans cette catégorie pour le moment.</p>
          </div>
        )}

        <div className="real-load">
          <div className="bot-strip" style={{ maxWidth: '1200px', margin: '40px auto 0' }}>
            <div className="bsi">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
            </div>
            <div>
              <h4>Galerie mise à jour automatiquement</h4>
              <p>Envoyez vos photos via WhatsApp — elles apparaissent ici instantanément grâce au bot IA.</p>
            </div>
            <span className="bpill">⚡ Automatisé</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec" style={{ padding: '100px 6%' }}>
        <div className="cta-blob" />
        <div className="ovl" style={{ justifyContent: 'center', display: 'flex', color: 'rgba(200,146,30,.5)' }}>Votre projet</div>
        <a href="tel:0465904372" className="cta-phone">0465.90.43.72</a>
        <p className="cta-sub">Bruxelles &amp; alentours · Toute la Belgique · 24h/24</p>
        <div className="cta-btns">
          <a href="https://wa.me/32465904372" target="_blank" rel="noopener noreferrer" className="btn-cta">✦ Demander un devis</a>
          <a href="tel:0465904372" className="btn-cta-o">Appeler maintenant</a>
        </div>
      </section>

      <footer>
        <div className="fgrid">
          <div>
            <LogoSVG footer />
            <p className="fb-desc">Électricien certifié RGIE. Installation, rénovation et dépannage à Bruxelles et dans toute la Belgique.</p>
            <div className="f-socials">
              <a href="https://www.tiktok.com/@tt.elec" target="_blank" rel="noopener noreferrer" className="fsoc"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" /></svg></a>
              <a href="https://wa.me/32465904372" className="fsoc"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" /></svg></a>
            </div>
          </div>
          <div className="fcol">
            <h4>Navigation</h4>
            <Link href="/">Accueil</Link>
            <Link href="/#services">Services</Link>
            <Link href="/realisations">Réalisations</Link>
            <Link href="/#devis">Contact</Link>
          </div>
          <div className="fcol">
            <h4>Services</h4>
            <Link href="/services/tableau-electrique">Tableau électrique</Link>
            <Link href="/services/cablage">Câblage</Link>
            <Link href="/services/eclairage">Éclairage</Link>
            <Link href="/services/domotique">Domotique</Link>
            <Link href="/services/depannage-urgence">Dépannage</Link>
            <Link href="/services/mise-en-conformite">Conformité</Link>
            <Link href="/services/borne-recharge">Borne EV</Link>
            <Link href="/services/alarme-incendie">Alarme</Link>
            <Link href="/services/parlophone-visiophone">Parlophone</Link>
          </div>
          <div className="fcol">
            <h4>Contact</h4>
            <a href="tel:0465904372">0465.90.43.72</a>
            <a href="https://wa.me/32465904372">WhatsApp</a>
            <span>Bruxelles, Belgique</span>
            <span>24h/24 — 7j/7</span>
          </div>
        </div>
        <div className="fb2">
          <p>© 2026 <strong>TT Elec</strong> · Tous droits réservés</p>
          <p><Link href="/">Mentions légales</Link></p>
        </div>
      </footer>

      <a href="https://wa.me/32465904372" target="_blank" rel="noopener noreferrer" className="wa" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>
    </>
  )
}
