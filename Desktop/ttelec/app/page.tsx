'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LogoSVG from '@/app/components/LogoSVG'
import { supabase } from '@/lib/supabase'
import DiagnosticTool from '@/app/components/DiagnosticTool'
import BeforeAfterSlider from '@/app/components/BeforeAfterSlider'
import Lightbox from '@/app/components/Lightbox'
import TikTokCard from '@/app/components/TikTokCard'

type MediaItem = { url: string; type: string; label?: string }

type GalItem = {
  id: string
  titre: string
  lieu: string
  date_chantier: string
  tags: string[]
  media: MediaItem[]
  images: string[]
}

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('fr-BE', { month: 'long', year: 'numeric' }) : ''
const getGalMedia = (r: GalItem): MediaItem[] => {
  if (r.media?.length > 0) return r.media
  if (r.images?.length > 0) return r.images.map(url => ({ url, type: 'image' }))
  return []
}
const firstMedia = (r: GalItem) => getGalMedia(r)[0] ?? null
const hasSliderBA = (r: GalItem) => {
  const labels = r.media?.map(m => m.label) ?? []
  return labels.includes('avant') && labels.includes('apres')
}

export default function Home() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [galReals, setGalReals] = useState<GalItem[]>([])
  const [dispo, setDispo] = useState(true)
  const [galLightbox, setGalLightbox] = useState<{ media: MediaItem[], index: number } | null>(null)

  useEffect(() => {
    supabase.from('realisations').select('id,titre,lieu,date_chantier,tags,media,images').eq('publie', true).order('created_at', { ascending: false }).limit(5).then(({ data }) => setGalReals(data ?? []))
    supabase.from('settings').select('valeur').eq('cle', 'disponible').single().then(({ data }) => {
      if (data) setDispo(data.valeur !== 'false')
    })
  }, [])

  useEffect(() => {
    if (galReals.length === 0) return
    const timer = setTimeout(() => {
      const ro = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); ro.unobserve(e.target) } }), { threshold: .05, rootMargin: '0px 0px -20px 0px' })
      document.querySelectorAll('.gal-grid .rv').forEach(el => { if (!el.classList.contains('on')) ro.observe(el) })
    }, 60)
    return () => clearTimeout(timer)
  }, [galReals])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveVideo(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = activeVideo ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [activeVideo])

  const openGalLightbox = (r: GalItem, index = 0) => {
    const media = getGalMedia(r)
    if (media.length > 0) setGalLightbox({ media, index })
  }
  const closeGalLightbox = () => setGalLightbox(null)
  const prevGalLightbox = () => setGalLightbox(prev => prev ? { ...prev, index: (prev.index - 1 + prev.media.length) % prev.media.length } : null)
  const nextGalLightbox = () => setGalLightbox(prev => prev ? { ...prev, index: (prev.index + 1) % prev.media.length } : null)

  useEffect(() => {
    const skipHeavy = window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let onMove: ((e: MouseEvent) => void) | null = null
    let rafId: number | undefined
    let onScrollP: (() => void) | null = null
    let onScrollVan: (() => void) | null = null
    let drawRaf: number | undefined

    /* CURSOR */
    if (!skipHeavy) {
      const cur = document.getElementById('cur')!
      const curR = document.getElementById('curR')!
      let mx = 0, my = 0, rx = 0, ry = 0
      onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; cur.style.left = mx + 'px'; cur.style.top = my + 'px' }
      document.addEventListener('mousemove', onMove)
      const aR = () => { rx += (mx - rx) * .1; ry += (my - ry) * .1; curR.style.left = rx + 'px'; curR.style.top = ry + 'px'; rafId = requestAnimationFrame(aR) }
      rafId = requestAnimationFrame(aR)
      document.querySelectorAll('a,button,.bc,.tkc,.gc,.dopt,.spo,.mag-btn').forEach(el => {
        el.addEventListener('mouseenter', () => { cur.style.width = '15px'; cur.style.height = '15px'; curR.style.width = '52px'; curR.style.height = '52px' })
        el.addEventListener('mouseleave', () => { cur.style.width = '9px'; cur.style.height = '9px'; curR.style.width = '34px'; curR.style.height = '34px' })
      })
    }

    /* NAV */
    const onScroll = () => document.getElementById('nav')?.classList.toggle('stuck', scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })

    /* REVEAL */
    const ro = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }), { threshold: .07, rootMargin: '0px 0px -36px 0px' })
    document.querySelectorAll('.rv').forEach(el => ro.observe(el))

    /* CANVAS SPARKS */
    if (!skipHeavy) {
      const canvas = document.getElementById('sparks-canvas') as HTMLCanvasElement
      const ctx = canvas?.getContext('2d')
      let W = 0, H = 0
      const nodes: {x:number,y:number,vx:number,vy:number,r:number,a:number}[] = []
      let arcs: {x1:number,y1:number,x2:number,y2:number,life:number}[] = []
      if (canvas && ctx) {
      const initCanvas = () => {
        W = canvas.width = canvas.offsetWidth || Math.round(window.innerWidth * .75)
        H = canvas.height = canvas.offsetHeight || Math.round(window.innerHeight * .70)
        if (W < 10 || H < 10) { requestAnimationFrame(initCanvas); return }
        nodes.length = 0
        for (let i = 0; i < 80; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .7, vy: (Math.random() - .5) * .7, r: Math.random() * 2.2 + .8, a: Math.random() * .6 + .2 })
        draw()
      }
      const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight }
      window.addEventListener('resize', resize)
      const zz = (x1: number, y1: number, x2: number, y2: number, s: number, sp: number) => { ctx.beginPath(); ctx.moveTo(x1, y1); for (let i = 1; i < s; i++) { const t = i / s; ctx.lineTo(x1 + (x2 - x1) * t + (Math.random() - .5) * sp, y1 + (y2 - y1) * t + (Math.random() - .5) * sp) } ctx.lineTo(x2, y2) }
      let tick = 0
      const draw = () => {
        ctx.clearRect(0, 0, W, H); tick++
        nodes.forEach(n => { n.x += n.vx; n.y += n.vy; if (n.x < 0 || n.x > W) n.vx *= -1; if (n.y < 0 || n.y > H) n.vy *= -1; ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(200,146,30,${n.a * .5})`; ctx.fill() })
        for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) { const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 240) { ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(200,146,30,${(1 - d / 240) * .18})`; ctx.lineWidth = .7; ctx.stroke() } }
        if (tick % 40 === 0 && Math.random() < .75) { const i = Math.floor(Math.random() * nodes.length), j = Math.floor(Math.random() * nodes.length); if (i !== j) arcs.push({ x1: nodes[i].x, y1: nodes[i].y, x2: nodes[j].x, y2: nodes[j].y, life: 1 }) }
        arcs = arcs.filter(f => { f.life -= .06; if (f.life <= 0) return false; ctx.save(); ctx.globalAlpha = f.life * .65; zz(f.x1, f.y1, f.x2, f.y2, 6, 22); ctx.strokeStyle = `rgba(242,208,126,${f.life * .8})`; ctx.lineWidth = 1; ctx.shadowColor = 'rgba(200,146,30,.6)'; ctx.shadowBlur = 6; ctx.stroke(); ctx.restore(); return true })
        drawRaf = requestAnimationFrame(draw)
      }
      initCanvas()
      }
    }

    /* HERO PARTICLES */
    if (!skipHeavy) {
      const wrap = document.getElementById('hero-particles')!
      for (let i = 0; i < 18; i++) {
        const p = document.createElement('div'); p.className = 'fp'
        p.style.cssText = `left:${Math.random() * 100}%;bottom:${Math.random() * 40}%;--dur:${3 + Math.random() * 5}s;--del:${Math.random() * 6}s;width:${2 + Math.random() * 3}px;height:${2 + Math.random() * 3}px`
        wrap?.appendChild(p)
      }
    }

    /* SCROLL PARALLAX */
    if (!skipHeavy) {
      const heroInner = document.getElementById('hero-inner')!
      onScrollP = () => { const y = window.scrollY; if (y < window.innerHeight) { heroInner.style.transform = `translateY(${y * .18}px)`; heroInner.style.opacity = String(Math.max(0, 1 - Math.max(0, y - 200) / (window.innerHeight * .9))) } }
      window.addEventListener('scroll', onScrollP, { passive: true })
    }

    /* VAN PARALLAX */
    if (!skipHeavy) {
      const vanWrap = document.getElementById('van-wrap')
      onScrollVan = () => {
        if (!vanWrap) return
        const rect = vanWrap.getBoundingClientRect()
        const viewH = window.innerHeight
        if (rect.bottom < 0 || rect.top > viewH) return
        const progress = (viewH / 2 - rect.top - rect.height / 2) / viewH
        vanWrap.style.transform = `translateY(${progress * -25}px)`
      }
      window.addEventListener('scroll', onScrollVan, { passive: true })
    }

    /* H1 LETTER SPLIT */
    const h1 = document.getElementById('hero-h1')
    h1?.querySelectorAll('span').forEach((span, si) => {
      const text = span.textContent!; span.textContent = ''
      text.split('').forEach((ch, ci) => { const s = document.createElement('span'); s.className = 'split-char'; s.textContent = ch; s.style.animationDelay = `${.3 + si * .18 + ci * .04}s`; span.appendChild(s) })
    })

    /* 3D TILT */
    if (!skipHeavy) {
      document.querySelectorAll<HTMLElement>('.bc,.tkc,.gc').forEach(card => {
        const onTilt = (e: MouseEvent) => {
          const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5
          const deg = card.classList.contains('bc') ? 10 : 12
          card.style.transform = `perspective(800px) rotateY(${x * deg}deg) rotateX(${-y * deg}deg) translateY(-6px) scale(1.01)`
          card.style.boxShadow = `${-x * 20}px ${y * 20 + 20}px 50px rgba(12,20,40,${card.classList.contains('gc') ? '.35' : '.1'})`
          card.style.setProperty('--shx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%')
          card.style.setProperty('--shy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%')
        }
        const onLeave = () => { card.style.transform = ''; card.style.boxShadow = '' }
        card.addEventListener('mousemove', onTilt)
        card.addEventListener('mouseleave', onLeave)
      })
    }

    /* LOGO 3D TILT */
    if (!skipHeavy) {
      const logoWrp = document.querySelector<HTMLElement>('.logo-3d-wrap')
      if (logoWrp) {
        logoWrp.addEventListener('mousemove', (e: MouseEvent) => {
          const r = logoWrp.getBoundingClientRect()
          const x = (e.clientX - r.left) / r.width - .5
          const y = (e.clientY - r.top) / r.height - .5
          logoWrp.style.animation = 'none'
          logoWrp.style.transform = `perspective(500px) rotateY(${x * 28}deg) rotateX(${-y * 28}deg) scale(1.06)`
        })
        logoWrp.addEventListener('mouseleave', () => {
          logoWrp.style.animation = ''
          logoWrp.style.transform = ''
        })
      }
    }

    /* MAGNETIC BUTTONS */
    if (!skipHeavy) {
      document.querySelectorAll<HTMLElement>('.mag-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => { const r = btn.getBoundingClientRect(); btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .28}px,${(e.clientY - r.top - r.height / 2) * .28}px)` })
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; btn.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)'; setTimeout(() => btn.style.transition = '', 500) })
      })
    }

    /* SPOTLIGHT */
    if (!skipHeavy) {
      const galSec = document.querySelector<HTMLElement>('.gal-sec'), galSpot = document.getElementById('gal-spotlight')
      if (galSec && galSpot) galSec.addEventListener('mousemove', e => { const r = galSec.getBoundingClientRect(); galSpot.style.setProperty('--sx', (e.clientX - r.left) + 'px'); galSpot.style.setProperty('--sy', (e.clientY - r.top) + 'px') })
      const ctaSec = document.querySelector<HTMLElement>('.cta-sec'), ctaSpot = document.getElementById('cta-spotlight')
      if (ctaSec && ctaSpot) ctaSec.addEventListener('mousemove', e => { const r = ctaSec.getBoundingClientRect(); ctaSpot.style.setProperty('--sx', (e.clientX - r.left) + 'px'); ctaSpot.style.setProperty('--sy', (e.clientY - r.top) + 'px') })
    }

    /* COUNTERS */
    const animCount = (el: Element, target: number, pre: string, suf: string) => {
      let st: number | null = null; const dur = 2200
      const step = (ts: number) => { if (!st) st = ts; const p = Math.min((ts - st) / dur, 1), e2 = 1 - Math.pow(1 - p, 4); el.innerHTML = pre + Math.floor(e2 * target) + (p >= 1 ? suf : ''); if (p < 1) requestAnimationFrame(step) }
      requestAnimationFrame(step)
    }
    const sro = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll('.sn').forEach(n => { const t = n.textContent!; if (t.includes('250')) animCount(n, 250, '', '<em>+</em>'); else if (t.includes('24')) animCount(n, 24, '', '<em>/7</em>'); else if (t.includes('5')) animCount(n, 5, '', '<em>★</em>') }); sro.unobserve(e.target) } }), { threshold: .5 })
    const strip = document.querySelector('.strip'); if (strip) sro.observe(strip)

    /* GALLERY PARTICLES */
    if (!skipHeavy) {
    ;(function () {
      const COLORS = ['#c8921e', '#dba94a', '#f2d07e', 'rgba(200,146,30,.4)', 'rgba(255,255,255,.12)', 'rgba(255,255,255,.08)']
      const gc = document.getElementById('gallery-particles') as HTMLCanvasElement
      if (!gc) return
      const gctx = gc.getContext('2d')!
      const rnd = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
      type Particle = { type: string; coords: {x:number,y:number}; velocity: {x:number,y:number}; alpha: number; hexColor: string; strokeWidth: number; diameter?: number; angle?: number; length?: number; rotateSpeed?: number; rotateClockwise?: boolean }
      let particles: Particle[] = []
      const MAX = 130
      const mkP = (): Particle => {
        const type = rnd(['bubble', 'bubble', 'bubble', 'bubble', 'line'])
        const p: Particle = { type, coords: { x: Math.round(Math.random() * gc.width), y: Math.round(Math.random() * gc.height) }, velocity: { x: (Math.random() < .5 ? -1 : 1) * (Math.random() * 1.1 + .2), y: (Math.random() < .5 ? -1 : 1) * (Math.random() * 1.1 + .2) }, alpha: 0.1, hexColor: rnd(COLORS), strokeWidth: Math.random() * (Math.random() > .5 ? 1.2 : 2) }
        if (type === 'bubble') { let d = 0; while (d < 2) d = Math.random() * 14; p.diameter = d }
        else { p.angle = Math.atan2(p.coords.y, p.coords.x); p.length = [4, 6, 9, 12][Math.floor(Math.random() * 4)]; p.rotateSpeed = [8, 20, 45, 90][Math.floor(Math.random() * 4)]; p.rotateClockwise = Math.random() < .5 }
        return p
      }
      const updateP = (p: Particle) => {
        if (p.alpha < .92) p.alpha += .018
        p.coords.x += p.velocity.x; p.coords.y += p.velocity.y
        if (p.type === 'line' && p.rotateSpeed) { const a = Math.PI / p.rotateSpeed!; p.angle! += p.rotateClockwise ? -Math.abs(a) : Math.abs(a) }
        const bx = (gc.width / 2) + 5, by = (gc.height / 2) + 5, x = p.coords.x / 2, y = p.coords.y / 2
        return !((x > bx || x < -5) || (y > by || y < -5))
      }
      const drawP = (p: Particle) => {
        const c = p.hexColor.startsWith('rgba') || p.hexColor.startsWith('rgb') ? p.hexColor : `rgba(${parseInt(p.hexColor.slice(1, 3), 16)},${parseInt(p.hexColor.slice(3, 5), 16)},${parseInt(p.hexColor.slice(5, 7), 16)},${p.alpha})`
        gctx.lineWidth = p.strokeWidth; gctx.strokeStyle = c; gctx.save()
        if (p.type === 'line') { gctx.translate(p.coords.x / 2, p.coords.y / 2); gctx.rotate(p.angle!); gctx.beginPath(); gctx.moveTo(-p.length! / 2, 0); gctx.lineTo(p.length! / 2, 0) }
        else { gctx.globalAlpha = p.alpha; gctx.beginPath(); gctx.arc(p.coords.x, p.coords.y, p.diameter!, 0, Math.PI * 2, false) }
        gctx.stroke(); gctx.restore()
      }
      const resizeGc = () => { const par = gc.parentNode as HTMLElement; gc.width = par.offsetWidth * 2; gc.height = par.offsetHeight * 2; gc.style.width = par.offsetWidth + 'px'; gc.style.height = par.offsetHeight + 'px' }
      const loopGc = () => { if (particles.length < MAX - 4) while (particles.length < MAX) particles.push(mkP()); particles = particles.filter(p => updateP(p)); gctx.clearRect(0, 0, gc.width, gc.height); particles.forEach(p => drawP(p)); requestAnimationFrame(loopGc) }
      resizeGc(); loopGc(); window.addEventListener('resize', resizeGc)
    })()
    }

    /* DIRECTION AWARE CUBES */
    if (!skipHeavy) {
      const cubeMap: Record<string, {init: string, flip: string, back: string}> = {
        left:   { init: 'rotateY(-12deg)', flip: 'rotateY(180deg)',  back: 'rotateY(180deg)' },
        right:  { init: 'rotateY(12deg)',  flip: 'rotateY(-180deg)', back: 'rotateY(180deg)' },
        top:    { init: 'rotateX(12deg)',  flip: 'rotateX(-180deg)', back: 'rotateX(-180deg)' },
        bottom: { init: 'rotateX(-12deg)', flip: 'rotateX(180deg)', back: 'rotateX(180deg)' },
      }
      document.querySelectorAll<HTMLElement>('.cw').forEach(wrap2 => {
        const cube = wrap2.querySelector<HTMLElement>('.cube')!, back = wrap2.querySelector<HTMLElement>('.cb')!
        let tid: ReturnType<typeof setTimeout> | null = null
        const getDir = (e: MouseEvent) => { const r = wrap2.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, t = y / r.height, b = 1 - t, l = x / r.width, ri = 1 - l, m = Math.min(t, b, l, ri); return m === t ? 'top' : m === b ? 'bottom' : m === l ? 'left' : 'right' }
        wrap2.addEventListener('mouseenter', (e: Event) => {
          if (tid) { clearTimeout(tid); tid = null }
          const t = cubeMap[getDir(e as MouseEvent)]
          back.style.transform = t.back; cube.style.transition = 'none'; cube.style.transform = t.init
          requestAnimationFrame(() => { cube.style.transition = 'transform .65s cubic-bezier(.16,1,.3,1)'; cube.style.transform = t.flip })
        })
        wrap2.addEventListener('mouseleave', () => {
          cube.style.transition = 'transform .65s cubic-bezier(.16,1,.3,1)'; cube.style.transform = ''
          tid = setTimeout(() => { back.style.transform = 'rotateY(180deg)'; tid = null }, 660)
        })
      })
    }

    /* HAMBURGER */
    const ham = document.getElementById('nham')
    const mobMenu = document.getElementById('mob-menu')
    const mobOverlay = document.getElementById('mob-overlay')
    const navEl = document.getElementById('nav')
    const closeMob = () => { navEl?.classList.remove('nav-open'); mobMenu?.classList.remove('open'); mobOverlay?.classList.remove('open'); document.body.style.overflow = '' }
    ham?.addEventListener('click', () => {
      const isOpen = mobMenu?.classList.contains('open')
      if (isOpen) { closeMob() } else { navEl?.classList.add('nav-open'); mobMenu?.classList.add('open'); mobOverlay?.classList.add('open'); document.body.style.overflow = 'hidden' }
    })
    mobOverlay?.addEventListener('click', closeMob)
    mobMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMob))

    /* SMOOTH SCROLL */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => { const id = (a as HTMLAnchorElement).getAttribute('href')!; if (id === '#') return; e.preventDefault(); document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' }) })
    })

    return () => {
      if (onMove) document.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      if (onScrollP) window.removeEventListener('scroll', onScrollP)
      if (onScrollVan) window.removeEventListener('scroll', onScrollVan)
      if (rafId !== undefined) cancelAnimationFrame(rafId)
      if (drawRaf !== undefined) cancelAnimationFrame(drawRaf)
      ro.disconnect()
      sro.disconnect()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const services = Array.from(form.querySelectorAll('.spo.on'))
      .map(el => el.querySelector('.spol')?.textContent).filter(Boolean).join(', ')
    const name = (form.querySelector('input[name="nom"]') as HTMLInputElement)?.value
    const phone = (form.querySelector('input[name="tel"]') as HTMLInputElement)?.value
    const localite = (form.querySelector('input[name="localite"]') as HTMLInputElement)?.value
    const desc = (form.querySelector('textarea') as HTMLTextAreaElement)?.value
    const msg = `Bonjour TT Elec 👋\n\n*Services:* ${services || 'Non précisé'}\n*Nom:* ${name}\n*Téléphone:* ${phone}\n*Localité:* ${localite}\n\n*Description:*\n${desc}`
    window.open(`https://wa.me/32465904372?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <>
      {galLightbox && (
        <Lightbox
          media={galLightbox.media}
          index={galLightbox.index}
          onClose={closeGalLightbox}
          onPrev={prevGalLightbox}
          onNext={nextGalLightbox}
        />
      )}

      {activeVideo && (
        <div className="tk-modal" onClick={() => setActiveVideo(null)}>
          <div className="tk-modal-inner" onClick={e => e.stopPropagation()}>
            <button className="tk-modal-close" onClick={() => setActiveVideo(null)} aria-label="Fermer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <iframe
              src={`https://www.tiktok.com/embed/v2/${activeVideo}`}
              className="tk-modal-frame"
              allow="encrypted-media; fullscreen; autoplay"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <div id="cur" />
      <div id="curR" />

      <nav id="nav">
        <a href="/" className="nlogo">
          <div className="logo-3d-wrap">
            <LogoSVG />
          </div>
        </a>
        <div className="nlinks">
          <a href="#services" className="nlink">Services</a>
          <a href="#gallery" className="nlink">Réalisations</a>
          <a href="#diagnostic" className="nlink">Diagnostic</a>
          <a href="#devis" className="nlink">Contact</a>
        </div>
        <div className="nright">
          <div className={`nbadge${dispo ? '' : ' nbadge-off'}`}><span className={`ndot${dispo ? '' : ' ndot-off'}`} />{dispo ? ' Disponible' : ' Indisponible'}</div>
          <a href="#devis" className="ncta mag-btn">✦ Devis gratuit</a>
          <button className="nham" id="nham" aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className="mob-overlay" id="mob-overlay" />
      <div className="mob-menu" id="mob-menu">
        <a href="#services" className="mob-link">Services</a>
        <a href="#gallery" className="mob-link">Réalisations</a>
        <a href="#diagnostic" className="mob-link">Diagnostic</a>
        <a href="#devis" className="mob-link">Contact</a>
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
          <a href="#devis" className="mob-cta-btn">✦ Demander un devis</a>
          <a href="tel:0465904372" className="mob-tel">0465.90.43.72</a>
        </div>
      </div>

      <section className="hero">
        <div className="hero-bg" />
        <canvas id="sparks-canvas" />
        <div className="hero-layer hl1" />
        <div className="hero-layer hl2" />
        <div className="hero-layer hl3" />
        <div className="hero-bolt-wm">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth=".25"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
        </div>
        <div className="hero-particles" id="hero-particles" />
        <div className="hero-3d-wrap">
          <div className="hero-3d-inner">
            <div className="hp-card">
              <div className="hp-glow" />
              <div className="hp-label">Chantiers réalisés</div>
              <div className="hp-num">250<em>+</em></div>
              <div className="hp-sub">Bruxelles &amp; alentours</div>
              <div className="hp-row"><div className="hp-dot" /><div className="hp-row-lbl">Agréé RGIE · RC Professionnelle</div></div>
            </div>
            <div className="hp-badge2"><div className="hp-b-dot" /><div className="hp-b-txt"><strong>Disponible</strong> · Intervention 24h/7j</div></div>
          </div>
        </div>
        <div className="hero-inner" id="hero-inner">
          <div className="hero-geo rv"><span />&nbsp;Bruxelles &amp; alentours · Belgique</div>
          <h1 id="hero-h1" className="rv d1">
            <span className="bl">Électricité</span>
            <span className="it">maîtrisée.</span>
            <span className="bl">Tranquillité</span>
            <span className="it">assurée.</span>
          </h1>
          <div className="hero-foot rv d2">
            <p className="hero-desc">Installation, rénovation et dépannage électrique par des professionnels <strong>certifiés RGIE</strong>. Intervention rapide à <strong>Bruxelles</strong> et dans toute la Belgique — disponible <strong>24h/24</strong>.</p>
            <div className="hero-acts">
              <a href="#devis" className="btn-fill mag-btn">✦ Demander un devis</a>
              <a href="#gallery" className="btn-line">Voir les réalisations&nbsp;
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="hero-scr"><div className="scr-line" /><span className="scr-lbl">Défiler</span></div>
      </section>

      <div className="e-divider" />

      <div className="strip">
        <div className="strip-col rv"><div className="sn">250<em>+</em></div><div className="sl">Chantiers réalisés</div></div>
        <div className="strip-col rv d1"><div className="sn">24<em>/7</em></div><div className="sl">Disponibilité</div></div>
        <div className="strip-col rv d2"><div className="sn"><em>100%</em></div><div className="sl">Conforme RGIE</div></div>
        <div className="strip-col rv d3"><div className="sn">5<em>★</em></div><div className="sl">Satisfaction client</div></div>
      </div>

      <div className="e-divider" />

      <section className="van-sec">
        <div className="van-inner">
          <div className="van-left rv">
            <div className="ovl">Notre flotte</div>
            <h2 className="stitle van-title">Toujours <em>en route</em> pour vous</h2>
            <p className="van-desc">Intervention rapide dans toute la région bruxelloise avec un véhicule équipé pour tous types de chantiers — du dépannage urgent à l&apos;installation complète.</p>
            <div className="van-badges">
              <div className="van-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Intervention 24h/7j
              </div>
              <div className="van-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Bruxelles &amp; alentours
              </div>
              <div className="van-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Véhicule équipé RGIE
              </div>
            </div>
            <a href="#devis" className="van-cta mag-btn">Demander une intervention</a>
          </div>
          <div className="van-right" id="van-wrap">
            <div className="van-circle" />
            <div className="van-img-wrap rv d1">
              <Image
                src="/images/camionnette-tt-elec-nobg.webp"
                alt="Camionnette TT Elec — Électricien à Bruxelles"
                width={620}
                height={380}
                quality={90}
                priority={false}
                className="van-img"
              />
            </div>
            <div className="van-road" />
          </div>
        </div>
      </section>

      <div className="e-divider" />

      <section className="svc-sec" id="services">
        <div className="sh rv">
          <div><div className="ovl">Nos expertises</div><h2 className="stitle">Solutions <em>complètes</em></h2></div>
          <a href="#devis" className="sh-link">Tous les services&nbsp;<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></a>
        </div>
        <div className="bento">
          <Link href="/services/tableau-electrique" className="bc bc1 bc-has-img rv">
            <div className="bc-bg" style={{ backgroundImage: "url('/images/panneau-electrique.png')" }} />
            <div className="bc-overlay" />
            <div className="bc1-glow" />
            <div className="bc-tag-img"><span className="btdot" />&nbsp;Service phare</div>
            <div className="bcn">01</div>
            <div className="bct" style={{ fontSize: '1.25rem' }}>Tableau électrique</div>
            <div className="bcd">Remplacement, mise en conformité et installation selon les normes RGIE belges. Devis gratuit, intervention rapide à Bruxelles.</div>
            <div className="bcarr" style={{ borderColor: 'rgba(200,146,30,.4)' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8921e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></div>
          </Link>
          <Link href="/services/cablage" className="bc bc2 bc-has-img rv d1">
            <div className="bc-bg" style={{ backgroundImage: "url('/images/cablage.jpg')" }} />
            <div className="bc-overlay" />
            <div className="bcn">02</div><div className="bct">Câblage complet</div>
            <div className="bcd">Installation et rénovation du câblage pour habitations, bureaux et commerces.</div>
            <div className="bcarr"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></div>
          </Link>
          <Link href="/services/eclairage" className="bc bc3 bc-has-img rv d2">
            <div className="bc-bg" style={{ backgroundImage: "url('/images/eclairage.jpg')", backgroundPosition: 'center 30%' }} />
            <div className="bc-overlay" />
            <div className="bcn">03</div><div className="bct">Éclairage</div>
            <div className="bcd">Systèmes LED modernes, spots encastrés et luminaires architecturaux.</div>
            <div className="bcarr"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></div>
          </Link>
          <Link href="/services/domotique" className="bc bc4 bc-has-img rv d3">
            <div className="bc-bg" style={{ backgroundImage: "url('/images/domotique.jpg')" }} />
            <div className="bc-overlay" />
            <div className="bcn">04</div><div className="bct">Domotique</div>
            <div className="bcd">Automatisation intelligente : volets, éclairage et thermostats connectés.</div>
            <div className="bcarr"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></div>
          </Link>
          <Link href="/services/mise-en-conformite" className="bc bc5 bc-has-img rv d4">
            <div className="bc-bg" style={{ backgroundImage: "url('/images/mise-en-conformite.jpg')" }} />
            <div className="bc-overlay" />
            <div className="bcn">05</div><div className="bct">Mise en conformité</div>
            <div className="bcd">Diagnostic complet et mise aux normes RGIE de votre installation existante.</div>
            <div className="bcarr"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></div>
          </Link>
          <Link href="/services/borne-recharge" className="bc bc6 bc-has-img rv d5">
            <div className="bc-bg" style={{ backgroundImage: "url('/images/borne-recharge.jpg')" }} />
            <div className="bc-overlay" />
            <div className="bcn">06</div>
            <div className="bct">Borne de recharge</div>
            <div className="bcd">Installation de bornes EV à domicile et en entreprise. Profitez des primes régionales.</div>
            <div className="bcarr"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></div>
          </Link>
          <Link href="/services/alarme-incendie" className="bc bc7 bc-has-img rv d6">
            <div className="bc-bg" style={{ backgroundImage: "url('/images/alarme-incendie.jpg')" }} />
            <div className="bc-overlay" style={{ background: 'linear-gradient(170deg,rgba(20,4,6,.5) 0%,rgba(8,2,3,.85) 65%,rgba(8,2,3,.97) 100%)' }} />
            <div className="bc7-rings">
              <div className="bc7-ring" /><div className="bc7-ring" /><div className="bc7-ring" /><div className="bc7-ring" />
            </div>
            <div className="bc7-dot" />
            <div className="bcn">07</div>
            <div className="bc-tag-img" style={{ color: 'rgba(239,68,68,.9)', background: 'rgba(220,38,38,.1)', borderColor: 'rgba(220,38,38,.25)' }}><span className="btdot" style={{ background: '#ef4444' }} />&nbsp;Sécurité</div>
            <div className="bct">Alarme &amp; Incendie</div>
            <div className="bcd">Installation de systèmes d&apos;alarme intrusion et détection incendie. Protection certifiée pour votre domicile ou entreprise.</div>
            <div className="bcarr" style={{ borderColor: 'rgba(220,38,38,.3)' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(239,68,68,.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></div>
          </Link>
          <Link href="/services/parlophone-visiophone" className="bc bc8 bc-has-img rv d7">
            <div className="bc-bg" style={{ backgroundImage: "url('/images/parlophone-visiophone.png')" }} />
            <div className="bc-overlay" style={{ background: 'linear-gradient(170deg,rgba(2,6,18,.5) 0%,rgba(2,4,14,.85) 65%,rgba(2,4,14,.97) 100%)' }} />
            <div className="bc8-waves">
              <div className="bc8-wave" /><div className="bc8-wave" /><div className="bc8-wave" /><div className="bc8-wave" />
            </div>
            <div className="bc8-dot" />
            <div className="bcn">08</div>
            <div className="bc-tag-img" style={{ color: 'rgba(96,165,250,.9)', background: 'rgba(59,130,246,.1)', borderColor: 'rgba(59,130,246,.25)' }}><span className="btdot" style={{ background: '#60a5fa' }} />&nbsp;Contrôle accès</div>
            <div className="bct">Parlophone &amp; Visiophone</div>
            <div className="bcd">Interphones filaires et visiophonie connectée. Contrôle d&apos;accès intelligent pour sécuriser vos entrées.</div>
            <div className="bcarr" style={{ borderColor: 'rgba(59,130,246,.3)' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(96,165,250,.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></div>
          </Link>
          <div className="bc bc9 rv">
            <div className="bc-urgence-glow" />
            <svg className="bcsvg" style={{ width: '180px', height: '180px', opacity: '.04' }} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth=".5"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            <div className="bc9-wrap">
              <div className="bc9-left">
                <div className="bcn" style={{ color: 'rgba(255,255,255,.04)', position: 'relative', fontSize: '3.5rem' }}>09</div>
                <div className="bct" style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '10px' }}>⚡ Dépannage urgent</div>
                <div className="bcd" style={{ color: 'rgba(255,255,255,.38)', maxWidth: '460px' }}>Panne totale, disjoncteur qui saute, court-circuit — nos techniciens certifiés RGIE interviennent à toute heure dans toute la Belgique.</div>
                <Link href="/services/depannage-urgence" className="bcarr" style={{ borderColor: 'rgba(200,146,30,.3)', opacity: 1, transform: 'scale(1)', position: 'relative', display: 'inline-flex', marginTop: '18px' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></Link>
              </div>
              <div className="bc9-right">
                <a href="tel:0465904372" className="bc9-tel">0465.90.43.72</a>
                <div className="bc9-avail"><span className="ndot" />&nbsp;Disponible maintenant</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="e-divider" />

      <section className="gal-sec" id="gallery">
        <canvas id="gallery-particles" />
        <div className="gal-spotlight" id="gal-spotlight" />
        <div className="sh rv" style={{ maxWidth: '1200px', margin: '0 auto 52px', position: 'relative', zIndex: 2 }}>
          <div><div className="ovl" style={{ color: 'var(--gold2)' }}>Portfolio</div><h2 className="stitle stitle-wh">Avant <em>&amp; Après</em></h2></div>
          <Link href="/realisations" className="sh-link" style={{ color: 'rgba(255,255,255,.25)' }}>Toutes les réalisations&nbsp;<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></Link>
        </div>
        <div className="gal-grid">
          {galReals.map((r, i) => {
            const media = getGalMedia(r)
            const m = firstMedia(r)
            const slider = hasSliderBA(r)
            const cls = ['feat rv', 'rv d1', 'rv d2', 'rv d3'][i] ?? 'rv'
            const isRemote = m && (m.url.includes('supabase.co') || m.url.includes('cloudinary.com'))
            return (
              <div
                key={r.id}
                className={`gc ${cls}`}
                onMouseEnter={e => e.currentTarget.querySelectorAll('video').forEach(v => v.play().catch(() => {}))}
                onMouseLeave={e => e.currentTarget.querySelectorAll('video').forEach(v => { v.pause(); v.currentTime = 0 })}
              >
                <div className="gv">
                  {slider ? (
                    <BeforeAfterSlider media={media} onOpen={() => openGalLightbox(r)} />
                  ) : (
                    <div
                      style={{ position: 'absolute', inset: 0, cursor: media.length > 0 ? 'zoom-in' : 'default' }}
                      onClick={() => openGalLightbox(r)}
                    >
                      {m?.type === 'video' ? (
                        <video
                          src={m.url}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                        />
                      ) : m && isRemote ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                          <Image
                            fill
                            src={m.url}
                            alt={r.titre}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            style={{ objectFit: 'cover' }}
                            quality={85}
                            priority={i < 2}
                            loading={i < 2 ? undefined : 'lazy'}
                          />
                        </div>
                      ) : (
                        <div className="gv-bg" style={m ? { backgroundImage: `url("${m.url}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}} />
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
                  {i === 0 && <span className="gnew" style={{ pointerEvents: 'none' }}>Récent</span>}
                </div>
                <div className="gi">
                  <div className="git">{r.titre}</div>
                  <div className="gim">{r.lieu} · {fmtDate(r.date_chantier)}</div>
                  <div className="gchips">{r.tags?.map(t => <span key={t} className="gchip">{t}</span>)}</div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="bot-strip rv">
          <div className="bsi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></div>
          <div><h4>Galerie mise à jour automatiquement</h4><p>Envoyez vos photos via WhatsApp — elles apparaissent ici instantanément.</p></div>
          <span className="bpill">⚡ Automatisé</span>
        </div>
      </section>

      <div className="e-divider" />

      <section className="proc-sec">
        <div className="sh rv"><div><div className="ovl">Notre méthode</div><h2 className="stitle">Un processus <em>simple</em> et efficace</h2></div></div>
        <div className="cube-grid">
          {[
            { num: '01', title: 'Premier contact', desc: 'Appelez-nous ou envoyez un message WhatsApp pour exposer vos besoins électriques.', iconPath: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 012 2.18 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z', delay: '' },
            { num: '02', title: 'Devis gratuit', desc: 'Nous préparons un devis personnalisé, transparent et sans engagement sous 24h.', iconPath: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', delay: 'd1' },
            { num: '03', title: 'Planification', desc: "Nous planifions l'intervention selon votre agenda et vos contraintes de vie.", iconPath: null, delay: 'd2' },
            { num: '04', title: 'Intervention', desc: 'Notre équipe certifiée RGIE intervient avec rigueur et professionnalisme sur votre chantier.', iconPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', delay: 'd3' },
            { num: '05', title: 'Contrôle qualité', desc: "Nous vérifions chaque détail avec vous avant de conclure l'intervention et remettons le PV.", iconPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', delay: 'd4' },
            { num: '06', title: 'Suivi & Garantie', desc: 'Nous restons disponibles pour tout suivi et garantissons notre travail dans la durée.', iconPath: null, delay: 'd5' },
          ].map((step) => (
            <div key={step.num} className={`cw rv ${step.delay}`}>
              <div className="cube">
                <div className="cf">
                  <div className="cf-num">{step.num}</div>
                  <div className="cf-icon">
                    {step.iconPath ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={step.iconPath} /></svg>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    )}
                  </div>
                  <div className="cf-line" />
                  <div className="cf-title">{step.title}</div>
                </div>
                <div className="cb">
                  <div className="cb-icon">
                    {step.iconPath ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={step.iconPath} /></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    )}
                  </div>
                  <div className="cb-title">{step.title}</div>
                  <div className="cb-desc">{step.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="tk-sec">
        <div className="sh rv">
          <div><div className="ovl">En vidéo</div><h2 className="stitle">Nos chantiers <em>en action</em></h2></div>
          <a href="https://www.tiktok.com/@tt.elec" target="_blank" rel="noopener noreferrer" className="tk-cta">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.76a8.18 8.18 0 0 0 4.84 1.55V6.85a4.86 4.86 0 0 1-1.07-.16z"/></svg>
            @tt.elec
          </a>
        </div>
        <div className="tk-grid">
          {[
            '7538962148899163424',
            '7571231023543880992',
            '7610946594627783969',
            '7609836996000894241',
          ].map((videoId, i) => (
            <TikTokCard
              key={videoId}
              videoId={videoId}
              index={i}
              onExpand={() => setActiveVideo(videoId)}
            />
          ))}
        </div>
      </section>

      <section className="diag-sec" id="diagnostic">
        <div className="sh rv"><div><div className="ovl">Outil interactif</div><h2 className="stitle">Diagnostic <em>rapide</em></h2></div></div>
        <DiagnosticTool />
      </section>

      <section className="dv-sec" id="devis">
        <div className="sh rv"><div><div className="ovl">Contact</div><h2 className="stitle">Parlons de votre <em>projet</em></h2></div></div>
        <div className="dv-layout">
          <div className="rv">
            <p style={{ fontSize: '.95rem', color: 'var(--mid)', lineHeight: '1.88', fontWeight: 300, maxWidth: '360px' }}>Décrivez votre besoin et recevez un devis personnalisé sous 24h.</p>
            <div className="dv-card">
              <div className="dv-row"><div className="dv-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.38 2 2 0 0 1 3.04 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.64a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" /></svg></div><div><div className="dv-lbl">Téléphone</div><div className="dv-val"><a href="tel:0465904372">0465.90.43.72</a></div></div></div>
              <div className="dv-row"><div className="dv-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></div><div><div className="dv-lbl">WhatsApp</div><div className="dv-val"><a href="https://wa.me/32465904372">Envoyer un message</a></div></div></div>
              <div className="dv-row"><div className="dv-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg></div><div><div className="dv-lbl">Zone</div><div className="dv-val">Bruxelles &amp; toute la Belgique</div></div></div>
              <div className="dv-row"><div className="dv-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div><div><div className="dv-lbl">Disponibilité</div><div className="dv-val">24h/24 — 7j/7</div></div></div>
            </div>
          </div>
          <div className="rv d1">
            <form className="dvf" onSubmit={handleSubmit}>
              <div className="fg">
                <label className="fl">Type de travaux</label>
                <div className="svc-pick">
                  {[['01','Tableau'],['02','Câblage'],['03','Éclairage'],['04','Domotique'],['05','Urgence'],['06','Conformité'],['07','Borne EV'],['08','Alarme'],['09','Parlophone']].map(([n, l]) => (
                    <div key={n} className="spo" onClick={e => e.currentTarget.classList.toggle('on')}>
                      <div className="spon">{n}</div><div className="spol">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="frow">
                <div className="fg"><label className="fl">Prénom &amp; Nom</label><input name="nom" className="fi" placeholder="Jean Dupont" /></div>
                <div className="fg"><label className="fl">Téléphone</label><input name="tel" className="fi" placeholder="+32 4XX XXX XXX" /></div>
              </div>
              <div className="fg"><label className="fl">Localité</label><input name="localite" className="fi" placeholder="Bruxelles, Ixelles…" /></div>
              <div className="fg"><label className="fl">Description</label><textarea className="fta" placeholder="Décrivez vos besoins électriques…" /></div>
              <button type="submit" className="fsub mag-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                ✦ Envoyer via WhatsApp
              </button>
              <p className="fnote">Réponse sous 24h · Devis gratuit · Sans engagement</p>
            </form>
          </div>
        </div>
      </section>

      <div className="e-divider" />

      <section className="cta-sec">
        <div className="cta-blob" />
        <div className="cta-spotlight" id="cta-spotlight" />
        <div className="ovl rv">Appelez-nous</div>
        <a href="tel:0465904372" className="cta-phone rv d1">0465.90.43.72</a>
        <p className="cta-sub rv d2">Bruxelles &amp; alentours · Toute la Belgique · 24h/24</p>
        <div className="cta-btns rv d3">
          <a href="#devis" className="btn-cta mag-btn">✦ Demander un devis</a>
          <a href="tel:0465904372" className="btn-cta-o">Appeler maintenant</a>
        </div>
      </section>

      <footer>
        <div className="fgrid">
          <div>
            <LogoSVG footer />
            <p className="fb-desc">Électricien certifié RGIE. Installation, rénovation et dépannage à Bruxelles et dans toute la Belgique.</p>
            <div className="f-socials">
              <a href="https://www.tiktok.com/@tt.elec" target="_blank" rel="noopener noreferrer" className="fsoc" aria-label="TikTok">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.76a8.18 8.18 0 0 0 4.84 1.55V6.85a4.86 4.86 0 0 1-1.07-.16z"/></svg>
              </a>
              <a href="https://wa.me/32465904372" target="_blank" rel="noopener noreferrer" className="fsoc" aria-label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              </a>
              <a href="https://www.instagram.com/ttelec3" target="_blank" rel="noopener noreferrer" className="fsoc" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
          <div className="fcol"><h4>Navigation</h4><a href="#">Accueil</a><a href="#services">Services</a><a href="#gallery">Réalisations</a><a href="#devis">Contact</a></div>
          <div className="fcol"><h4>Services</h4><Link href="/services/tableau-electrique">Tableau électrique</Link><Link href="/services/cablage">Câblage</Link><Link href="/services/eclairage">Éclairage</Link><Link href="/services/domotique">Domotique</Link><Link href="/services/depannage-urgence">Dépannage</Link><Link href="/services/mise-en-conformite">Conformité</Link><Link href="/services/borne-recharge">Borne EV</Link><Link href="/services/alarme-incendie">Alarme & Incendie</Link><Link href="/services/parlophone-visiophone">Parlophone</Link></div>
          <div className="fcol"><h4>Contact</h4><a href="tel:0465904372">0465.90.43.72</a><a href="https://wa.me/32465904372">WhatsApp</a><a href="#">Bruxelles, Belgique</a><a href="#">24h/24 — 7j/7</a></div>
        </div>
        <div className="fb2"><p>© 2026 <strong>TT Elec</strong> · Tous droits réservés</p><p><a href="#">Mentions légales</a></p></div>
      </footer>

      <a href="https://wa.me/32465904372" target="_blank" rel="noopener noreferrer" className="wa" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>
    </>
  )
}
