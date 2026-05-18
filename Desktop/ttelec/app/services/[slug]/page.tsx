import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import PageEffects from '@/app/components/PageEffects'
import LogoSVG from '@/app/components/LogoSVG'

const services: Record<string, {
  title: string
  subtitle: string
  description: string
  image: string | null
  features: { title: string; desc: string; icon: string }[]
  seoTitle: string
  seoDesc: string
}> = {
  'tableau-electrique': {
    title: 'Tableau électrique',
    subtitle: 'Remplacement, mise en conformité et installation selon les normes RGIE belges.',
    image: '/images/panneau-electrique.png',
    description: "Le tableau électrique est le cœur de votre installation. TT Elec intervient pour le remplacement, la mise en conformité RGIE et l'optimisation de votre tableau à Bruxelles et dans toute la Belgique.",
    features: [
      { title: 'Remplacement complet', desc: "Remplacement de votre ancien tableau par un modèle neuf, dimensionné pour vos besoins actuels et futurs.", icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
      { title: 'Mise en conformité RGIE', desc: "Mise aux normes obligatoires pour la vente, la location ou après un rapport de contrôle négatif.", icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
      { title: 'Ajout de circuits', desc: "Extension de votre tableau pour de nouveaux équipements (four, borne EV, jacuzzi) ou de nouvelles pièces.", icon: 'M12 5v14M5 12h14' },
      { title: 'Disjoncteurs différentiels', desc: "Installation des protections 30mA obligatoires pour la sécurité des personnes et des biens.", icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
    ],
    seoTitle: 'Tableau Électrique Bruxelles — Remplacement & Mise en Conformité RGIE | TT Elec',
    seoDesc: 'TT Elec remplace et met en conformité votre tableau électrique à Bruxelles. Agréé RGIE. Devis gratuit sous 24h. Intervention rapide.',
  },
  'cablage': {
    title: 'Câblage complet',
    subtitle: "Installation et rénovation du câblage pour habitations, bureaux et commerces.",
    image: '/images/cablage.jpg',
    description: "TT Elec réalise tous vos travaux de câblage électrique à Bruxelles. Nouvelle installation ou rénovation complète — nos techniciens certifiés garantissent un travail soigné, discret et conforme RGIE.",
    features: [
      { title: 'Câblage neuf', desc: "Installation complète du câblage pour nouvelles constructions, extensions et transformations.", icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
      { title: 'Rénovation', desc: "Remplacement de câblage ancien, vétuste ou non conforme pour sécuriser votre installation.", icon: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z' },
      { title: 'Passages de gaines', desc: "Discrets et propres — encastrés dans les murs ou en moulures selon votre souhait.", icon: 'M5 12h14M12 5l7 7-7 7' },
      { title: 'Prises & interrupteurs', desc: "Installation ou remplacement de tous types de prises, interrupteurs et variateurs.", icon: 'M12 5v14M5 12h14' },
    ],
    seoTitle: 'Câblage Électrique Bruxelles — Installation & Rénovation | TT Elec',
    seoDesc: 'Câblage électrique à Bruxelles par TT Elec, électricien agréé RGIE. Installation neuve ou rénovation complète. Devis gratuit sous 24h.',
  },
  'eclairage': {
    title: 'Éclairage',
    subtitle: "Systèmes LED modernes, spots encastrés et luminaires architecturaux.",
    image: '/images/eclairage.jpg',
    description: "Transformez l'ambiance de votre intérieur et extérieur avec les solutions d'éclairage LED de TT Elec. Spots encastrés, rubans LED, luminaires design — nous concevons et installons des systèmes sur mesure à Bruxelles.",
    features: [
      { title: 'Spots encastrés', desc: "Installation propre et précise de spots LED dans plafonds, faux-plafonds et dalles suspendues.", icon: 'M12 2a10 10 0 100 20 10 10 0 000-20z' },
      { title: "Éclairage d'ambiance", desc: "Rubans LED, lumières indirectes, guirlandes architecturales pour créer l'atmosphère parfaite.", icon: 'M9 18V5l12-2v13' },
      { title: 'Éclairage extérieur', desc: "Sécurité et esthétique pour vos terrasses, allées, jardins et façades.", icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z' },
      { title: 'Variateurs', desc: "Systèmes dimmers compatibles LED pour contrôler l'intensité lumineuse selon vos besoins et vos scènes.", icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
    ],
    seoTitle: 'Éclairage LED Bruxelles — Spots & Luminaires | TT Elec Électricien',
    seoDesc: "Installation d'éclairage LED à Bruxelles. Spots, rubans LED, éclairage architectural par TT Elec, agréé RGIE. Devis gratuit.",
  },
  'domotique': {
    title: 'Domotique',
    subtitle: "Automatisation intelligente : volets, éclairage et thermostats connectés.",
    image: '/images/domotique.jpg',
    description: "Transformez votre maison en smart home avec les solutions domotiques de TT Elec. Contrôlez votre éclairage, vos volets, votre chauffage et vos caméras depuis votre smartphone, où que vous soyez.",
    features: [
      { title: 'Volets automatiques', desc: "Programmation, minuterie et contrôle à distance de vos volets roulants et stores.", icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
      { title: 'Éclairage connecté', desc: "Scènes d'éclairage automatisées, contrôlées par smartphone, tablette ou commande vocale.", icon: 'M12 2a10 10 0 100 20 10 10 0 000-20z' },
      { title: 'Thermostat intelligent', desc: "Économies d'énergie grâce au contrôle précis et programmable de votre chauffage.", icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
      { title: 'Caméras & sécurité', desc: "Système de surveillance intégré, enregistrement en cloud, accessible depuis n'importe où.", icon: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z' },
    ],
    seoTitle: 'Domotique Bruxelles — Smart Home & Automatisation | TT Elec',
    seoDesc: 'Installation domotique à Bruxelles par TT Elec. Volets, éclairage connecté, thermostat intelligent. Agréé RGIE. Devis gratuit.',
  },
  'depannage-urgence': {
    title: 'Dépannage urgent',
    subtitle: "Intervention rapide 24h/24, 7j/7 dans toute la Belgique.",
    image: null,
    description: "Panne électrique totale, disjoncteur qui saute, court-circuit — TT Elec intervient en urgence 24h/24 et 7j/7 à Bruxelles et dans toute la Belgique. Nos électriciens certifiés RGIE arrivent rapidement pour diagnostiquer et résoudre votre problème.",
    features: [
      { title: 'Disponible 24h/24', desc: "Pas de supplément de nuit ou de week-end — nos techniciens sont disponibles à toute heure.", icon: 'M12 22c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zM12 7v5l3 3' },
      { title: 'Intervention rapide', desc: "Nos techniciens arrivent au plus vite pour rétablir votre électricité et votre sécurité.", icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
      { title: 'Diagnostic précis', desc: "Identification rapide de la panne avec le matériel de test approprié pour une réparation efficace.", icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
      { title: 'Devis immédiat', desc: "Prix transparent communiqué avant toute intervention. Aucune surprise sur la facture finale.", icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' },
    ],
    seoTitle: 'Électricien Urgence Bruxelles 24h/7j — Dépannage Rapide | TT Elec',
    seoDesc: 'Dépannage électrique urgence à Bruxelles, 24h/24 7j/7. TT Elec intervient rapidement. Agréé RGIE. Appelez le 0465 90 43 72.',
  },
  'mise-en-conformite': {
    title: 'Mise en conformité',
    subtitle: "Diagnostic complet et mise aux normes RGIE de votre installation existante.",
    image: '/images/mise-en-conformite.jpg',
    description: "La mise en conformité électrique est obligatoire lors de la vente ou la location de votre bien en Belgique. TT Elec réalise le diagnostic RGIE et effectue les travaux nécessaires pour obtenir votre attestation de conformité.",
    features: [
      { title: 'Diagnostic RGIE', desc: "Audit complet de votre installation électrique selon la réglementation RGIE belge en vigueur.", icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
      { title: 'Rapport détaillé', desc: "Liste précise des non-conformités et des travaux à réaliser, avec chiffrage transparent.", icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' },
      { title: 'Travaux de mise en conformité', desc: "Réalisation de tous les travaux nécessaires pour passer avec succès le contrôle de conformité.", icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
      { title: 'Attestation de conformité', desc: "Accompagnement complet jusqu'à l'obtention du certificat officiel reconnu par les organismes agréés.", icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    ],
    seoTitle: 'Mise en Conformité RGIE Bruxelles — Diagnostic Électrique | TT Elec',
    seoDesc: 'Mise en conformité électrique RGIE à Bruxelles. Diagnostic, travaux et attestation par TT Elec, agréé RGIE. Devis gratuit.',
  },
  'borne-recharge': {
    title: 'Borne de recharge',
    subtitle: "Installation de bornes de recharge pour véhicules électriques à domicile et en entreprise.",
    image: '/images/borne-recharge.jpg',
    description: "TT Elec installe vos bornes de recharge pour véhicules électriques à Bruxelles. Que ce soit pour votre domicile ou votre entreprise, nos électriciens agréés RGIE réalisent le câblage dédié et l'installation complète de votre borne EV en toute conformité.",
    features: [
      { title: 'Installation résidentielle', desc: "Borne wall-box 7 kW à domicile — câblage dédié, coffret de protection et mise en service complète.", icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
      { title: 'Installation professionnelle', desc: "Bornes de recharge pour parkings, commerces, bureaux et flottes de véhicules d'entreprise.", icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
      { title: 'Câblage & tableau dédié', desc: "Création d'un circuit dédié depuis le tableau électrique, protections 30mA et conformité RGIE garantie.", icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
      { title: 'Primes & subsides', desc: "Accompagnement pour les primes de recharge disponibles en Région bruxelloise et en Belgique.", icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    ],
    seoTitle: 'Borne de Recharge Bruxelles — Installation EV & Wall-Box | TT Elec',
    seoDesc: "Installation de bornes de recharge pour voitures électriques à Bruxelles. TT Elec, agréé RGIE. Résidentiel & professionnel. Devis gratuit.",
  },
  'alarme-incendie': {
    title: 'Alarme & Incendie',
    subtitle: "Installation de systèmes d'alarme intrusion et de détection incendie certifiés.",
    image: '/images/alarme-incendie.jpg',
    description: "TT Elec installe et configure vos systèmes d'alarme anti-intrusion et de détection incendie à Bruxelles. Qu'il s'agisse d'une habitation ou d'un commerce, nous proposons des solutions filaires et sans-fil adaptées à vos besoins, conformes aux normes belges en vigueur.",
    features: [
      { title: 'Alarme anti-intrusion', desc: "Détecteurs de mouvement, contacts de portes et fenêtres, sirènes intérieure et extérieure. Système filaire ou sans-fil.", icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
      { title: 'Détection incendie', desc: "Détecteurs de fumée interconnectés, centrales incendie et systèmes conformes aux normes NBN S21-100 belges.", icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
      { title: 'Caméras de surveillance', desc: "Installation de systèmes CCTV HD, IP et NVR pour habitations, commerces et parkings.", icon: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z' },
      { title: 'Télécommandes & application', desc: "Pilotez et recevez les alertes de votre système depuis votre smartphone, où que vous soyez.", icon: 'M12 22c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z' },
    ],
    seoTitle: 'Alarme & Détection Incendie Bruxelles — Installation Sécurité | TT Elec',
    seoDesc: "Installation de systèmes d'alarme et de détection incendie à Bruxelles. TT Elec, agréé RGIE. Résidentiel & professionnel. Devis gratuit.",
  },
  'parlophone-visiophone': {
    title: 'Parlophone & Visiophone',
    subtitle: "Interphones filaires et visiophonie connectée pour un contrôle d'accès intelligent.",
    image: '/images/parlophone-visiophone.png',
    description: "TT Elec installe vos systèmes de parlophonie et visiophonie à Bruxelles. Du simple interphone filaire au visiophone connecté avec contrôle via smartphone, nous concevons et posons la solution adaptée à votre habitation ou immeuble, avec le câblage intégré.",
    features: [
      { title: 'Parlophone filaire', desc: "Installation complète de systèmes interphones filaires multi-appartements ou individuels, avec câblage encastré.", icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 012 2.18 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z' },
      { title: 'Visiophone avec écran', desc: "Visiophone couleur avec écran intérieur HD. Visualisez vos visiteurs et ouvrez à distance en toute sécurité.", icon: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z' },
      { title: 'Visiophone connecté', desc: "Contrôle d'accès via application smartphone — recevez les appels et ouvrez votre porte de n'importe où.", icon: 'M12 22c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z' },
      { title: 'Contrôle d\'accès', desc: "Gâches électriques, lecteurs de badges et systèmes de contrôle d'accès pour immeubles et bureaux.", icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    ],
    seoTitle: 'Parlophone & Visiophone Bruxelles — Installation Interphone | TT Elec',
    seoDesc: "Installation de parlophones et visiophones à Bruxelles. TT Elec, agréé RGIE. Filaire & connecté. Devis gratuit sous 24h.",
  },
}

const slugToLabel: Record<string, string> = {
  'tableau-electrique': 'Tableau électrique',
  'cablage': 'Câblage complet',
  'eclairage': 'Éclairage',
  'domotique': 'Domotique',
  'depannage-urgence': 'Dépannage urgent',
  'mise-en-conformite': 'Mise en conformité',
  'borne-recharge': 'Borne de recharge',
  'alarme-incendie': 'Alarme & Incendie',
  'parlophone-visiophone': 'Parlophone & Visiophone',
}

export async function generateStaticParams() {
  return Object.keys(services).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const svc = services[slug]
  if (!svc) return {}
  return {
    title: svc.seoTitle,
    description: svc.seoDesc,
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const svc = services[slug]
  if (!svc) notFound()

  const isUrgence = slug === 'depannage-urgence'

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
          <Link href="/#devis" className="nlink">Contact</Link>
        </div>
        <div className="nright">
          <div className="nbadge"><span className="ndot" /> Disponible</div>
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
      <section
        className="svch"
        style={svc.image ? {
          backgroundImage: `linear-gradient(to bottom, rgba(12,20,40,.82) 0%, rgba(12,20,40,.72) 60%, rgba(12,20,40,.95) 100%), url(${svc.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : { background: 'var(--navy)' }}
      >
        {isUrgence && <div className="svch-urgence-blob" />}
        <div className="svch-inner">
          <div className="svch-bc">
            <Link href="/">Accueil</Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            <Link href="/#services">Services</Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            <span>{slugToLabel[slug]}</span>
          </div>
          {isUrgence && <div className="svch-urgence-badge"><span className="ndot" />&nbsp;⚡ Urgence — Disponible maintenant</div>}
          <h1 className="svch-h1">{svc.title}</h1>
          <p className="svch-sub">{svc.subtitle}</p>
          <div className="svch-acts">
            <a href="tel:0465904372" className="btn-fill">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 012 2.18 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
              {isUrgence ? '⚡ Appeler maintenant' : '✦ Devis gratuit'}
            </a>
            <a href="https://wa.me/32465904372" target="_blank" rel="noopener noreferrer" className="btn-line" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.25)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              WhatsApp
            </a>
          </div>
        </div>
        <div className="svch-scroll">
          <div className="scr-line" />
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="svcd-sec">
        <div className="svcd-inner">
          <div className="ovl">À propos</div>
          <h2 className="stitle">{svc.title} à <em>Bruxelles</em></h2>
          <p className="svcd-p">{svc.description}</p>
          <div className="svcd-trust">
            {[
              { label: 'Agréé RGIE', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
              { label: 'Devis gratuit 24h', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' },
              { label: 'Disponible 24h/7j', icon: 'M12 22c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z' },
              { label: '250+ chantiers', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' },
            ].map(t => (
              <div key={t.label} className="svcd-trust-item">
                <div className="svcd-trust-ico">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={t.icon} /></svg>
                </div>
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="e-divider" />

      {/* FEATURES */}
      <section className="svcf-sec">
        <div className="sh">
          <div>
            <div className="ovl">Nos prestations</div>
            <h2 className="stitle">Ce que nous <em>réalisons</em></h2>
          </div>
        </div>
        <div className="svcf-grid">
          {svc.features.map((f, i) => (
            <div key={i} className="svcf-card">
              <div className="svcf-num">0{i + 1}</div>
              <div className="svcf-ico">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon} /></svg>
              </div>
              <div className="svcf-line" />
              <h3 className="svcf-title">{f.title}</h3>
              <p className="svcf-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="e-divider" />

      {/* WHY TT ELEC */}
      <section className="svcw-sec">
        <div className="sh">
          <div>
            <div className="ovl">Pourquoi nous choisir</div>
            <h2 className="stitle">TT Elec, votre partenaire <em>de confiance</em></h2>
          </div>
        </div>
        <div className="svcw-grid">
          {[
            { num: '01', title: 'Électricien agréé RGIE', desc: "Nos travaux sont réalisés selon les normes RGIE en vigueur. Attestation de conformité fournie sur demande.", icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
            { num: '02', title: 'Devis gratuit sous 24h', desc: "Nous répondons à chaque demande de devis dans les 24 heures, avec un prix clair et sans engagement.", icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' },
            { num: '03', title: '250+ chantiers réalisés', desc: "Une expérience solide sur tous types de chantiers : habitations, commerces, bureaux et immeubles.", icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' },
            { num: '04', title: 'Garantie & suivi', desc: "Nos travaux sont garantis. Nous restons disponibles pour tout suivi ou question après intervention.", icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          ].map(w => (
            <div key={w.num} className="svcw-card">
              <div className="svcw-n">{w.num}</div>
              <div className="svcw-ico">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={w.icon} /></svg>
              </div>
              <h3 className="svcw-title">{w.title}</h3>
              <p className="svcw-desc">{w.desc}</p>
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
              <a href="https://www.tiktok.com/@tt.elec" target="_blank" rel="noopener noreferrer" className="fsoc"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" /></svg></a>
              <a href="https://wa.me/32465904372" className="fsoc"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" /></svg></a>
            </div>
          </div>
          <div className="fcol">
            <h4>Navigation</h4>
            <Link href="/">Accueil</Link>
            <Link href="/#services">Services</Link>
            <Link href="/#gallery">Réalisations</Link>
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
