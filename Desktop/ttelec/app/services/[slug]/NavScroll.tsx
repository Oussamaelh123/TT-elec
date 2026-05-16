'use client'
import { useEffect } from 'react'

export default function NavScroll() {
  useEffect(() => {
    const onScroll = () =>
      document.getElementById('nav')?.classList.toggle('stuck', scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return null
}
