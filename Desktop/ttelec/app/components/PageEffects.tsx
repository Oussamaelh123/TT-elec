'use client'
import { useEffect } from 'react'

export default function PageEffects() {
  useEffect(() => {
    const cur = document.getElementById('cur')
    const curR = document.getElementById('curR')
    let rafId: number
    let onMove: ((e: MouseEvent) => void) | null = null
    let mx = 0, my = 0, rx = 0, ry = 0

    if (cur && curR) {
      onMove = (e: MouseEvent) => {
        mx = e.clientX; my = e.clientY
        cur.style.left = mx + 'px'; cur.style.top = my + 'px'
      }
      document.addEventListener('mousemove', onMove)

      const loop = () => {
        rx += (mx - rx) * .1; ry += (my - ry) * .1
        curR.style.left = rx + 'px'; curR.style.top = ry + 'px'
        rafId = requestAnimationFrame(loop)
      }
      rafId = requestAnimationFrame(loop)

      document.querySelectorAll('a,button,.svcf-card,.svcw-card,.ncta,.btn-fill,.btn-cta,.svch-acts a').forEach(el => {
        el.addEventListener('mouseenter', () => { cur.style.width = '15px'; cur.style.height = '15px'; curR.style.width = '52px'; curR.style.height = '52px' })
        el.addEventListener('mouseleave', () => { cur.style.width = '9px'; cur.style.height = '9px'; curR.style.width = '34px'; curR.style.height = '34px' })
      })
    }

    /* LOGO 3D TILT */
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

    /* NAV SCROLL */
    const onScroll = () => document.getElementById('nav')?.classList.toggle('stuck', scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })

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

    /* PARTICLES (réutilisable gallery + real-hero) */
    const runParticles = (canvasId: string, max: number) => {
      const COLORS = ['#c8921e','#dba94a','#f2d07e','rgba(200,146,30,.4)','rgba(255,255,255,.12)','rgba(255,255,255,.08)']
      const gc = document.getElementById(canvasId) as HTMLCanvasElement
      if (!gc) return
      const gctx = gc.getContext('2d')!
      const rnd = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
      type P = { type:string; x:number; y:number; vx:number; vy:number; alpha:number; color:string; sw:number; d?:number; angle?:number; len?:number; rspeed?:number; rcw?:boolean }
      let particles: P[] = []
      const resize = () => { gc.width = gc.offsetWidth; gc.height = gc.offsetHeight }
      window.addEventListener('resize', resize); resize()
      const mkP = (): P => {
        const type = Math.random() < .8 ? 'bubble' : 'line'
        const p: P = { type, x: Math.random()*gc.width, y: Math.random()*gc.height, vx:(Math.random()<.5?-1:1)*(Math.random()*1.1+.2), vy:(Math.random()<.5?-1:1)*(Math.random()*1.1+.2), alpha:.1, color:rnd(COLORS), sw:Math.random()*(Math.random()>.5?1.2:2) }
        if (type==='bubble') { let d=0; while(d<2) d=Math.random()*14; p.d=d }
        else { p.angle=Math.atan2(p.y,p.x); p.len=[4,6,9,12][Math.floor(Math.random()*4)]; p.rspeed=[8,20,45,90][Math.floor(Math.random()*4)]; p.rcw=Math.random()<.5 }
        return p
      }
      const drawP = (p: P) => {
        gctx.save(); gctx.globalAlpha = Math.min(p.alpha,.92); gctx.strokeStyle = p.color; gctx.lineWidth = p.sw
        if (p.type==='bubble') { gctx.beginPath(); gctx.arc(p.x, p.y, p.d!/2, 0, Math.PI*2); gctx.stroke() }
        else { const a = p.angle!; const l = p.len!/2; gctx.beginPath(); gctx.moveTo(p.x-Math.cos(a)*l, p.y-Math.sin(a)*l); gctx.lineTo(p.x+Math.cos(a)*l, p.y+Math.sin(a)*l); gctx.stroke() }
        gctx.restore()
      }
      let pRaf: number
      const loop = () => {
        gctx.clearRect(0,0,gc.width,gc.height)
        while (particles.length < max) particles.push(mkP())
        particles = particles.filter(p => {
          if (p.alpha < .92) p.alpha += .018
          p.x += p.vx; p.y += p.vy
          if (p.type==='line') { const a=Math.PI/p.rspeed!; p.angle! += p.rcw ? -Math.abs(a) : Math.abs(a) }
          const bx=gc.width/2+5, by=gc.height/2+5
          if (p.x/2>bx||p.x/2<-5||p.y/2>by||p.y/2<-5) return false
          drawP(p); return true
        })
        pRaf = requestAnimationFrame(loop)
      }
      loop()
      return () => cancelAnimationFrame(pRaf)
    }
    const stopGal = runParticles('gallery-particles', 130)
    const stopReal = runParticles('real-particles', 220)

    /* REVEAL */
    const ro = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }),
      { threshold: .07, rootMargin: '0px 0px -36px 0px' }
    )
    document.querySelectorAll('.rv').forEach(el => ro.observe(el))

    return () => {
      if (onMove) document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      ro.disconnect()
      stopGal?.()
      stopReal?.()
    }
  }, [])

  return (
    <>
      <div id="cur" />
      <div id="curR" />
    </>
  )
}
