import { Metadata } from 'next'
import Link from 'next/link'
import PageEffects from '@/app/components/PageEffects'
import LogoSVG from '@/app/components/LogoSVG'

export const metadata: Metadata = {
  title: 'Services Électricité Bruxelles | TT Elec',
  description: 'TT Elec, électricien agréé RGIE à Bruxelles. Tableau électrique, câblage, éclairage, domotique, caméras, dépannage urgence 24h/7j. Devis gratuit sous 24h.',
}

const services = [
  {
    slug: 'tableau-electrique',
    title: 'Tableau électrique',
    desc: 'Remplacement, mise en conformité RGIE et installation de tableaux électriques neufs.',
    icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    tag: 'Obligatoire RGIE',
  },
  {
    slug: 'cablage',
    title: 'Câblage complet',
    desc: 'Installation et rénovation du câblage pour habitations, bureaux et commerces.',
    icon: 'M5 12h14M12 5l7 7-7 7',
    tag: 'Neuf & Rénovation',
  },
  {
    slug: 'eclairage',
    title: 'Éclairage',
    desc: 'Spots encastrés, rubans LED, luminaires architecturaux intérieur et extérieur.',
    icon: 'M12 2a10 10 0 100 20 10 10 0 000-20z',
    tag: 'LED & Ambiance',
  },
  {
    slug: 'domotique',
    title: 'Domotique',
    desc: 'Automatisation intelligente : volets, éclairage et thermostats connectés.',
    icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
    tag: 'Smart Home',
  },
  {
    slug: 'depannage-urgence',
    title: 'Dépannage urgent',
    desc: 'Intervention rapide 24h/24, 7j/7. Panne, disjoncteur, court-circuit.',
    icon: 'M12 22c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zM12 7v5l3 3',
    tag: '⚡ 24h/7j',
  },
  {
    slug: 'mise-en-conformite',
    title: 'Mise en conformité',
    desc: 'Diagnostic RGIE, travaux de mise aux normes et attestation officielle.',
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    tag: 'Attestation RGIE',
  },
  {
    slug: 'borne-recharge',
    title: 'Borne de recharge',
    desc: 'Installation de bornes wall-box pour véhicules électriques, résidentiel et professionnel.',
    icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    tag: 'EV & Wall-Box',
  },
  {
    slug: 'alarme-incendie',
    title: 'Alarme & Incendie',
    desc: 'Systèmes d'alarme anti-intrusion et détection incendie certifiés, filaires ou sans-fil.',
    icon: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z',
    tag: 'Sécurité',
  },
  {
    slug: 'parlophone-visiophone',
    title: 'Parlophone & Visiophone',
    desc: 'Interphones filaires et visiophonie connectée pour contrôle d'accès intelligent.',
    icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 012 2.18 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z',
    tag: 'Contrôle d'accès',
  },
]

export default function ServicesPage() {
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
        <div className="mob-sub">
          {services.map(s => (
            <Link key={s.slug} href={`/services/${s.slug}`}>{s.title}</Link>
          ))}
        </div>
        <div className="mob-cta">
          <Link href="/contact" className="mob-cta-btn">✦ Demander un devis</Link>
          <a href="tel:0465904372" className="mob-tel">0465.90.43.72</a>
        </div>
      </div>

      {/* HERO */}
      <section className="svch" style={{ background: 'var(--navy)' }}>
        <div className="svch-inner">
          <div className="svch-bc">
            <Link href="/">Accueil</Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            <span>Services</span>
          </div>
          <h1 className="svch-h1">Nos <em>services</em></h1>
          <p className="svch-sub">Installation, rénovation, dépannage et mise en conformité électrique à Bruxelles et dans toute la Belgique.</p>
          <div className="svch-acts">
            <a href="tel:0465904372" className="btn-fill">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 012 2.18 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
              ✦ Devis gratuit
            </a>
            <a href="https://wa.me/32465904372" target="_blank" rel="noopener noreferrer" className="btn-line" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.25)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              WhatsApp
            </a>
          </div>
        </div>
        <div className="svch-scroll"><div className="scr-line" /></div>
      </section>

      {/* SERVICES GRID */}
      <section className="svcf-sec" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="sh rv">
          <div>
            <div className="ovl">Nos prestations</div>
            <h2 className="stitle">Tous nos <em>services</em></h2>
          </div>
          <p className="sh-sub">Électricien agréé RGIE à Bruxelles — devis gratuit sous 24h pour toutes vos demandes.</p>
        </div>
        <div className="svc-list-grid">
          {services.map((s, i) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className={`svc-list-card rv d${Math.min(i % 3, 4)}`}>
              <div className="svc-list-top">
                <div className="svc-list-ico">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.icon} />
                  </svg>
                </div>
                <span className="svc-list-tag">{s.tag}</span>
              </div>
              <h3 className="svc-list-title">{s.title}</h3>
              <p className="svc-list-desc">{s.desc}</p>
              <div className="svc-list-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                En savoir plus
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="svcd-sec" style={{ background: 'var(--navy)', padding: '70px 6%' }}>
        <div className="svcd-trust" style={{ justifyContent: 'center', gap: '48px' }}>
          {[
            { label: 'Agréé RGIE', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
            { label: 'Devis gratuit 24h', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' },
            { label: 'Disponible 24h/7j', icon: 'M12 22c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z' },
            { label: '250+ chantiers', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' },
          ].map(t => (
            <div key={t.label} className="svcd-trust-item" style={{ color: 'var(--off-white)' }}>
              <div className="svcd-trust-ico" style={{ background: 'rgba(200,146,30,.15)', border: '1px solid rgba(200,146,30,.3)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={t.icon} /></svg>
              </div>
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec" style={{ padding: '100px 6%' }}>
        <div className="ovl">Contactez-nous</div>
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
