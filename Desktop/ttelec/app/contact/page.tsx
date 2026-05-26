'use client'

import { useState } from 'react'
import Link from 'next/link'
import PageEffects from '@/app/components/PageEffects'
import LogoSVG from '@/app/components/LogoSVG'

const SERVICES = [
  { id: 'tableau', label: 'Tableau électrique', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  { id: 'cablage', label: 'Câblage', icon: 'M5 12h14M12 5l7 7-7 7' },
  { id: 'eclairage', label: 'Éclairage', icon: 'M12 2a10 10 0 100 20 10 10 0 000-20z' },
  { id: 'domotique', label: 'Domotique', icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
  { id: 'depannage', label: 'Dépannage urgent', icon: 'M12 22c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zM12 7v5l3 3' },
  { id: 'conformite', label: 'Mise en conformité', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { id: 'borne', label: 'Borne EV', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  { id: 'alarme', label: 'Alarme & Incendie', icon: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z' },
  { id: 'parlophone', label: 'Parlophone', icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 012 2.18 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z' },
]

export default function ContactPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [urgence, setUrgence] = useState(false)

  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const services = selected.map(id => SERVICES.find(s => s.id === id)?.label).filter(Boolean).join(', ')
    const name = (form.querySelector('input[name="nom"]') as HTMLInputElement)?.value
    const phone = (form.querySelector('input[name="tel"]') as HTMLInputElement)?.value
    const localite = (form.querySelector('input[name="localite"]') as HTMLInputElement)?.value
    const desc = (form.querySelector('textarea') as HTMLTextAreaElement)?.value
    const urgTag = urgence ? '🚨 *URGENCE* — ' : ''
    const msg = `${urgTag}Bonjour TT Elec 👋\n\n*Services:* ${services || 'Non précisé'}\n*Nom:* ${name}\n*Téléphone:* ${phone}\n*Localité:* ${localite}\n\n*Description:*\n${desc}`
    window.open(`https://wa.me/32465904372?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <>
      <PageEffects />

      <nav id="nav">
        <Link href="/" className="nlogo">
          <div className="logo-3d-wrap">
            <LogoSVG />
          </div>
        </Link>
        <div className="nlinks">
          <Link href="/#services" className="nlink">Services</Link>
          <Link href="/#gallery" className="nlink">Réalisations</Link>
          <Link href="/#diagnostic" className="nlink">Diagnostic</Link>
          <Link href="/contact" className="nlink">Contact</Link>
        </div>
        <div className="nright">
          <div className="nbadge"><span className="ndot" /> Disponible</div>
          <Link href="/contact" className="ncta">✦ Devis gratuit</Link>
          <button className="nham" id="nham" aria-label="Menu"><span /><span /><span /></button>
        </div>
      </nav>
      <div className="mob-overlay" id="mob-overlay" />
      <div className="mob-menu" id="mob-menu">
        <Link href="/" className="mob-link">Accueil</Link>
        <Link href="/#services" className="mob-link">Services</Link>
        <Link href="/realisations" className="mob-link">Réalisations</Link>
        <Link href="/contact" className="mob-link">Contact</Link>
        <div className="mob-cta">
          <Link href="/contact" className="mob-cta-btn">✦ Demander un devis</Link>
          <a href="tel:0465904372" className="mob-tel">0465.90.43.72</a>
        </div>
      </div>

      {/* HERO */}
      <section className="svch" style={{ background: 'var(--navy)', minHeight: '42vh' }}>
        <div className="svch-inner">
          <div className="svch-bc">
            <Link href="/">Accueil</Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            <span>Contact</span>
          </div>
          <h1 className="svch-h1">Devis <em>gratuit</em></h1>
          <p className="svch-sub">Réponse sous 24h — Disponible 24h/24 pour les urgences.</p>
        </div>
        <div className="svch-scroll"><div className="scr-line" /></div>
      </section>

      {/* MAIN CONTENT */}
      <section style={{ padding: '100px 6%', background: 'var(--off-white)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '80px', alignItems: 'start' }}>

          {/* LEFT — INFO */}
          <div>
            <div className="ovl">Nous contacter</div>
            <h2 className="stitle" style={{ marginBottom: '32px' }}>Parlons de votre <em>projet</em></h2>
            <p style={{ color: 'var(--text-mid)', lineHeight: '1.7', marginBottom: '40px', fontFamily: 'var(--font-dm-sans)' }}>
              Devis gratuit, réponse sous 24h. Pour les urgences électriques, appelez directement — intervention rapide 24h/7j à Bruxelles et alentours.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                {
                  icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 012 2.18 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z',
                  label: 'Téléphone',
                  value: '0465.90.43.72',
                  href: 'tel:0465904372',
                },
                {
                  icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
                  label: 'WhatsApp',
                  value: 'Envoyer un message',
                  href: 'https://wa.me/32465904372',
                },
                {
                  icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z',
                  label: 'Zone',
                  value: 'Bruxelles & 19 communes',
                  href: null,
                },
                {
                  icon: 'M12 22c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z',
                  label: 'Disponibilité',
                  value: '24h/24 — 7j/7',
                  href: null,
                },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'rgba(200,146,30,.08)', border: '1px solid rgba(200,146,30,.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-syne)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-soft)', marginBottom: '2px' }}>{item.label}</div>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', color: 'var(--navy)', fontWeight: 500, textDecoration: 'none' }}>
                        {item.value}
                      </a>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', color: 'var(--navy)', fontWeight: 500 }}>{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* RGIE BADGE */}
            <div style={{
              marginTop: '48px', padding: '20px 24px', borderRadius: '16px',
              background: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '14px',
            }}>
              <div style={{ background: 'rgba(200,146,30,.15)', border: '1px solid rgba(200,146,30,.3)', borderRadius: '10px', padding: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'var(--off-white)', fontSize: '13px' }}>Agréé RGIE</div>
                <div style={{ fontFamily: 'var(--font-dm-sans)', color: 'rgba(248,246,242,.6)', fontSize: '12px', marginTop: '2px' }}>Attestation de conformité fournie sur demande</div>
              </div>
            </div>
          </div>

          {/* RIGHT — FORM */}
          <div style={{
            background: '#fff', borderRadius: '24px', padding: '48px',
            boxShadow: '0 4px 40px rgba(12,20,40,.07)', border: '1px solid var(--cream)',
          }}>
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontFamily: 'var(--font-fraunces)', fontWeight: 400, fontSize: 'clamp(22px,2.5vw,28px)', color: 'var(--navy)', marginBottom: '8px' }}>
                Votre demande
              </h3>
              <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'var(--text-mid)', fontSize: '14px' }}>
                Réponse garantie sous 24h · Devis sans engagement
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* URGENCE TOGGLE */}
              <button type="button" onClick={() => setUrgence(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px',
                  borderRadius: '12px', border: `2px solid ${urgence ? 'var(--gold)' : 'var(--cream)'}`,
                  background: urgence ? 'rgba(200,146,30,.06)' : 'transparent',
                  cursor: 'pointer', fontFamily: 'var(--font-syne)', fontWeight: 700,
                  fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: urgence ? 'var(--gold)' : 'var(--text-mid)',
                  transition: 'all .2s cubic-bezier(.16,1,.3,1)', textAlign: 'left',
                }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                {urgence ? '⚡ Urgence activée' : 'Intervention urgente ?'}
              </button>

              {/* SERVICES */}
              <div>
                <label style={{ fontFamily: 'var(--font-syne)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-soft)', display: 'block', marginBottom: '10px' }}>
                  Service(s) souhaité(s)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {SERVICES.map(s => (
                    <button key={s.id} type="button" onClick={() => toggle(s.id)}
                      style={{
                        padding: '10px 8px', borderRadius: '10px', border: `1.5px solid ${selected.includes(s.id) ? 'var(--gold)' : 'var(--cream)'}`,
                        background: selected.includes(s.id) ? 'rgba(200,146,30,.07)' : '#fff',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                        transition: 'all .2s cubic-bezier(.16,1,.3,1)',
                      }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={selected.includes(s.id) ? 'var(--gold)' : 'var(--text-soft)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d={s.icon} />
                      </svg>
                      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', fontWeight: 500, color: selected.includes(s.id) ? 'var(--navy)' : 'var(--text-mid)', textAlign: 'center', lineHeight: '1.3' }}>
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* FIELDS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontFamily: 'var(--font-syne)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-soft)', display: 'block', marginBottom: '6px' }}>Nom *</label>
                  <input name="nom" required placeholder="Votre nom"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--cream)', fontFamily: 'var(--font-dm-sans)', fontSize: '14px', color: 'var(--navy)', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-syne)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-soft)', display: 'block', marginBottom: '6px' }}>Téléphone *</label>
                  <input name="tel" required type="tel" placeholder="04XX XX XX XX"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--cream)', fontFamily: 'var(--font-dm-sans)', fontSize: '14px', color: 'var(--navy)', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-syne)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-soft)', display: 'block', marginBottom: '6px' }}>Localité *</label>
                <input name="localite" required placeholder="Ex: Uccle, Bruxelles"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--cream)', fontFamily: 'var(--font-dm-sans)', fontSize: '14px', color: 'var(--navy)', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-syne)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-soft)', display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea name="desc" rows={4} placeholder="Décrivez votre projet ou votre problème..."
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--cream)', fontFamily: 'var(--font-dm-sans)', fontSize: '14px', color: 'var(--navy)', background: '#fff', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              <button type="submit" className="btn-fill" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '14px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                </svg>
                Envoyer via WhatsApp
              </button>

              <p style={{ textAlign: 'center', fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: 'var(--text-soft)' }}>
                Votre demande sera envoyée via WhatsApp. Réponse garantie sous 24h.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec" style={{ padding: '100px 6%' }}>
        <div className="ovl">Urgence ?</div>
        <a href="tel:0465904372" className="cta-phone">0465.90.43.72</a>
        <p className="cta-sub">Bruxelles &amp; alentours · 24h/24 · 7j/7</p>
        <div className="cta-btns">
          <a href="https://wa.me/32465904372" target="_blank" rel="noopener noreferrer" className="btn-cta">✦ WhatsApp direct</a>
          <a href="tel:0465904372" className="btn-cta-o">Appeler maintenant</a>
        </div>
      </section>

      <footer>
        <div className="fgrid">
          <div>
            <LogoSVG footer />
            <p className="fb-desc">Électricien certifié RGIE. Installation, rénovation et dépannage à Bruxelles et dans toute la Belgique.</p>
            <div className="f-socials">
              <a href="https://www.tiktok.com/@tt.elec" target="_blank" rel="noopener noreferrer" className="fsoc"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg></a>
              <a href="https://wa.me/32465904372" className="fsoc"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" /></svg></a>
            </div>
          </div>
          <div className="fcol">
            <h4>Navigation</h4>
            <Link href="/">Accueil</Link>
            <Link href="/services">Services</Link>
            <Link href="/realisations">Réalisations</Link>
            <Link href="/contact">Contact</Link>
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
