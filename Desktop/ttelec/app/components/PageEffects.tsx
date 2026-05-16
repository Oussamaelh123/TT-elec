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
    }
  }, [])

  return (
    <>
      <div id="cur" />
      <div id="curR" />
    </>
  )
}
