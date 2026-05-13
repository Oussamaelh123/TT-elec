import FadeUp from "@/components/FadeUp";
import Contact from "@/components/Contact";

/* ── Data ── */
const services = [
  {
    icon: "⚡",
    name: "Installation Électrique",
    desc: "Nouvelle installation, rénovation complète ou mise aux normes. Travaux résidentiels et commerciaux.",
  },
  {
    icon: "📷",
    name: "Caméras de Sécurité",
    desc: "Installation de systèmes CCTV, caméras IP, alarmes et interphones pour votre sécurité.",
  },
  {
    icon: "🔧",
    name: "Tableau Électrique",
    desc: "Remplacement, mise en conformité et extension de tableaux électriques. Normes RGIE respectées.",
  },
  {
    icon: "🏠",
    name: "Domotique & Smart Home",
    desc: "Automatisation de votre habitat : éclairage intelligent, volets, chauffage connecté.",
  },
  {
    icon: "🚨",
    name: "Dépannage Urgence",
    desc: "Panne, court-circuit, disjoncteur qui saute — intervention rapide 24h/7j sur Bruxelles.",
    dark: true,
    link: { href: "tel:0465904372", label: "Appeler maintenant →" },
  },
];

const methodeSteps = [
  {
    num: "01",
    icon: "📞",
    title: "Prise de contact gratuite",
    desc: "Décrivez-nous votre projet par téléphone, WhatsApp ou via le formulaire. Nous répondons dans les 24h avec une première estimation.",
  },
  {
    num: "02",
    icon: "📋",
    title: "Devis détaillé sur place",
    desc: "On se déplace chez vous pour évaluer précisément les travaux. Vous recevez un devis clair et détaillé, sans surprise ni frais cachés.",
  },
  {
    num: "03",
    icon: "⚡",
    title: "Réalisation & livraison",
    desc: "Nos électriciens interviennent dans les délais convenus. Chantier propre, travail aux normes RGIE, et vérification finale avec vous.",
  },
];

const competences = [
  {
    icon: "⚡",
    title: "Installations électriques résidentielles",
    sub: "Maisons, appartements, nouvelles constructions, rénovations",
  },
  {
    icon: "🏢",
    title: "Électricité commerciale & industrielle",
    sub: "Bureaux, commerces, entrepôts, halls industriels",
  },
  {
    icon: "🔒",
    title: "Sécurité & surveillance",
    sub: "Caméras CCTV, alarmes, contrôle d'accès, interphones",
  },
  {
    icon: "🏠",
    title: "Domotique & automatisation",
    sub: "Smart home, éclairage connecté, volets automatiques",
  },
  {
    icon: "📋",
    title: "Mise en conformité RGIE",
    sub: "Contrôle, rapport, mise aux normes, attestation",
  },
];

const gallery = [
  { cls: "ph-1", icon: "⚡", label: "Installation complète", sub: "Villa — Uccle, Bruxelles", large: true },
  { cls: "ph-2", icon: "📷", label: "Système CCTV", sub: "Commerce — Ixelles" },
  { cls: "ph-3", icon: "🔧", label: "Tableau électrique", sub: "Appartement — Etterbeek" },
  { cls: "ph-4", icon: "🏠", label: "Domotique", sub: "Maison — Woluwe" },
  { cls: "ph-5", icon: "⚡", label: "Installation électrique", sub: "Résidence — Anderlecht" },
];

const avantages = [
  {
    title: "Devis gratuit & sans engagement",
    desc: "Réponse sous 24h. Prix clairs, pas de mauvaises surprises.",
  },
  {
    title: "Agréé & assuré RC professionnelle",
    desc: "Tous nos travaux respectent le RGIE. Vous êtes couverts.",
  },
  {
    title: "Ponctualité & propreté garanties",
    desc: "On arrive à l'heure et on repart en laissant le chantier propre.",
  },
  {
    title: "Urgences traitées 24h/7j",
    desc: "Panne nocturne ou week-end ? On répond présent.",
  },
];

const temoignages = [
  {
    initials: "SB",
    name: "Sophie B.",
    loc: "Uccle, Bruxelles",
    text: "Intervention rapide pour une panne totale un dimanche soir. Très professionnel, prix correct et chantier nickel. Je recommande vivement !",
  },
  {
    initials: "KM",
    name: "Karim M.",
    loc: "Ixelles, Bruxelles",
    text: "Installation complète d'un système de caméras pour mon commerce. Travail soigné, explications claires. Le résultat est impeccable.",
  },
  {
    initials: "AL",
    name: "Antoine L.",
    loc: "Woluwe-Saint-Lambert",
    text: "Tableau électrique remplacé et mis aux normes RGIE en une journée. Travail soigné, devis respecté, équipe au top. Je recommande sans hésiter.",
  },
];

const communes = [
  "Bruxelles-Ville", "Ixelles", "Uccle", "Etterbeek",
  "Anderlecht", "Molenbeek", "Schaerbeek", "Woluwe-St-Lambert",
  "Woluwe-St-Pierre", "Auderghem", "Forest", "Saint-Gilles",
  "Jette", "Laeken", "Waterloo", "+ Alentours",
];

/* ── Page ── */
export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section id="hero">
        <div className="hero-img" />
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-badge">Électricien agréé — Bruxelles</div>
              <h1 className="hero-title">
                L&apos;ÉLECTRICITÉ,<br />
                <em>C&apos;EST NOTRE</em>
                MÉTIER.
              </h1>
              <p className="hero-sub">
                Installation électrique, caméras de sécurité, tableaux, domotique —
                TT Elec intervient sur Bruxelles et ses alentours avec rapidité et professionnalisme.
              </p>
              <div className="hero-btns">
                <a href="#contact" className="btn-primary">Devis gratuit →</a>
                <a href="#realisations" className="btn-hero-outline">Voir nos réalisations</a>
              </div>
              <div className="hero-stats">
                <div>
                  <div className="hero-stat-num">10+</div>
                  <div className="hero-stat-label">Années d&apos;expérience</div>
                </div>
                <div>
                  <div className="hero-stat-num">500+</div>
                  <div className="hero-stat-label">Chantiers réalisés</div>
                </div>
                <div>
                  <div className="hero-stat-num">24/7</div>
                  <div className="hero-stat-label">Service urgences</div>
                </div>
                <div>
                  <div className="hero-stat-num" style={{ fontSize: "28px", letterSpacing: "1px" }}>RGIE</div>
                  <div className="hero-stat-label">Agréé & certifié</div>
                </div>
              </div>
            </div>

            <div className="hero-right">
              {[
                { icon: "⚡", title: "Installation électrique complète", sub: "Neuf, rénovation, mise aux normes" },
                { icon: "📷", title: "Caméras de sécurité", sub: "CCTV, alarmes, interphones" },
                { icon: "🏠", title: "Domotique & Smart Home", sub: "Automatisation, éclairage intelligent" },
              ].map((card) => (
                <div key={card.title} className="hero-card">
                  <div className="hero-card-icon">{card.icon}</div>
                  <div>
                    <div className="hero-card-title">{card.title}</div>
                    <div className="hero-card-sub">{card.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div id="trust">
        <div className="container">
          <div className="trust-inner">
            <div className="trust-item">🏅 Agréé RGIE</div>
            <div className="trust-dot" />
            <div className="trust-item">✓ Devis gratuit sous 24h</div>
            <div className="trust-dot" />
            <div className="trust-item">🛡️ Assurance RC professionnelle</div>
            <div className="trust-dot" />
            <div className="trust-item">📍 Bruxelles & alentours</div>
            <div className="trust-dot" />
            <div className="trust-item">⏱️ Urgences 24h/7j</div>
            <div className="trust-dot" />
            <div className="trust-item">⭐ +200 avis clients</div>
            <div className="trust-dot" />
            <div className="trust-item">⚡ 500+ chantiers réalisés</div>
          </div>
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section id="services" className="section">
        <div className="container">
          <FadeUp className="services-header">
            <div>
              <div className="tag">Nos Services</div>
              <h2 className="section-title">CE QU&apos;ON <span>FAIT</span></h2>
              <p className="section-sub">
                De l&apos;installation neuve au dépannage d&apos;urgence, nous couvrons tous vos besoins électriques.
              </p>
            </div>
            <a href="#contact" className="btn-outline">Voir tous les services →</a>
          </FadeUp>

          <div className="services-grid">
            {services.map((s, i) => (
              <FadeUp key={s.name} delay={i * 0.08}>
                <div
                  className="service-card"
                  style={s.dark ? { background: "var(--navy)", borderColor: "var(--navy)" } : undefined}
                >
                  <div
                    className="service-icon"
                    style={s.dark ? { background: "rgba(255,214,0,0.15)" } : undefined}
                  >
                    {s.icon}
                  </div>
                  <div
                    className="service-name"
                    style={s.dark ? { color: "white" } : undefined}
                  >
                    {s.name}
                  </div>
                  <p
                    className="service-desc"
                    style={s.dark ? { color: "rgba(255,255,255,0.55)" } : undefined}
                  >
                    {s.desc}
                  </p>
                  {s.link ? (
                    <a
                      href={s.link.href}
                      className="service-link"
                      style={{ color: "var(--yellow)" }}
                    >
                      {s.link.label}
                    </a>
                  ) : (
                    <div className="service-link">En savoir plus →</div>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉTHODE ── */}
      <section id="methode" className="section section-alt">
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 64px" }}>
              <div className="tag tag-dark">Notre méthode</div>
              <h2 className="section-title">
                UNE MÉTHODE ÉPROUVÉE,<br />
                <span>UN RÉSULTAT GARANTI</span>
              </h2>
              <p className="section-sub" style={{ margin: "0 auto" }}>
                Du premier contact à la réception des travaux, on vous accompagne à chaque étape.
              </p>
            </div>
          </FadeUp>

          <FadeUp>
            <div className="methode-grid">
              {methodeSteps.flatMap((step, i) => {
                const items = [
                  <div key={step.num} className="methode-step">
                    <div className="methode-num">{step.num}</div>
                    <div className="methode-icon">{step.icon}</div>
                    <h3 className="methode-title">{step.title}</h3>
                    <p className="methode-desc">{step.desc}</p>
                  </div>,
                ];
                if (i < methodeSteps.length - 1) {
                  items.push(<div key={`c-${i}`} className="methode-connector" />);
                }
                return items;
              })}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── COMPÉTENCES ── */}
      <section id="competences" className="section" style={{ background: "var(--navy)" }}>
        <div className="container">
          <FadeUp>
            <div className="competences-grid">
              <div>
                <div className="tag" style={{ color: "var(--yellow)", borderColor: "rgba(255,214,0,0.3)", background: "rgba(255,214,0,0.08)" }}>
                  Expertise
                </div>
                <h2 className="section-title" style={{ color: "white" }}>
                  DES COMPÉTENCES COUVRANT<br />
                  <span style={{ color: "var(--yellow)" }}>L&apos;ENSEMBLE DU CYCLE ÉLECTRIQUE</span>
                </h2>
                <p className="section-sub" style={{ color: "rgba(255,255,255,0.55)", marginBottom: "40px" }}>
                  De la conception à la maintenance, TT Elec maîtrise chaque étape de vos installations
                  électriques résidentielles et commerciales.
                </p>
                <a href="#contact" className="btn-primary">Parler de mon projet →</a>
              </div>

              <div className="competences-list">
                {competences.map((c) => (
                  <div key={c.title} className="competence-item">
                    <div className="competence-check">{c.icon}</div>
                    <div>
                      <div className="competence-title">{c.title}</div>
                      <div className="competence-sub">{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── RÉALISATIONS ── */}
      <section id="realisations" className="section">
        <div className="container">
          <FadeUp>
            <div className="tag">Nos Réalisations</div>
            <h2 className="section-title">
              NOS <span style={{ color: "var(--yellow)" }}>TRAVAUX</span>
            </h2>
            <p className="section-sub">
              Chaque chantier est réalisé avec soin et précision. Voici quelques-unes de nos réalisations récentes.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="gallery-grid">
              {gallery.map((item) => (
                <div key={item.label} className={`gallery-item ${item.large ? "large" : ""}`}>
                  <div className={`gallery-img ${item.cls}`}>
                    <div className="ph-icon">{item.icon}</div>
                  </div>
                  <div className="gallery-overlay">
                    <div>
                      <div className="gallery-label">{item.label}</div>
                      <div className="gallery-sub">{item.sub}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="gallery-cta">
              <a href="#contact" className="btn-white">Voir toutes les réalisations →</a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── POURQUOI NOUS ── */}
      <section id="pourquoi" className="section">
        <div className="container">
          <div className="pourquoi-grid">
            <FadeUp className="pourquoi-visual">
              <div className="pourquoi-img-main">⚡</div>
              <div className="pourquoi-badge">
                <div className="pourquoi-badge-num">10+</div>
                <div className="pourquoi-badge-label">Ans d&apos;expérience</div>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="tag tag-dark">Pourquoi nous choisir</div>
              <h2 className="section-title">
                VOTRE CONFIANCE,<br />
                <span>NOTRE PRIORITÉ</span>
              </h2>
              <p className="section-sub">
                Chez TT Elec, chaque intervention est traitée avec le même sérieux :
                ponctualité, propreté du chantier et travail aux normes.
              </p>
              <div className="avantages">
                {avantages.map((a) => (
                  <div key={a.title} className="avantage">
                    <div className="avantage-check">✓</div>
                    <div>
                      <div className="avantage-title">{a.title}</div>
                      <div className="avantage-desc">{a.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section id="temoignages" className="section section-alt">
        <div className="container">
          <FadeUp>
            <div style={{ textAlign: "center" }}>
              <div className="tag">Avis Clients</div>
              <h2 className="section-title">
                ILS NOUS FONT <span>CONFIANCE</span>
              </h2>
            </div>
          </FadeUp>

          <div className="temoignages-grid">
            {temoignages.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div className="temoignage">
                  <div className="stars">★★★★★</div>
                  <p className="temoignage-text">&ldquo;{t.text}&rdquo;</p>
                  <div className="temoignage-author">
                    <div className="author-avatar">{t.initials}</div>
                    <div>
                      <div className="author-name">{t.name}</div>
                      <div className="author-loc">{t.loc}</div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── ZONE D'INTERVENTION ── */}
      <section id="zone" className="section">
        <div className="container">
          <FadeUp>
            <div className="tag">Zone d&apos;intervention</div>
            <h2 className="section-title" style={{ color: "white" }}>
              ON INTERVIENT<br />
              <span style={{ color: "var(--yellow)" }}>PRÈS DE CHEZ VOUS</span>
            </h2>
            <p className="section-sub">
              Basés à Bruxelles, nous couvrons toute la Région bruxelloise et les communes limitrophes.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="zone-grid">
              <div className="zone-map">
                📍
                <div className="zone-map-label">Carte interactive — à intégrer</div>
              </div>
              <div>
                <div className="communes-title">Communes couvertes</div>
                <div className="communes-grid">
                  {communes.map((c) => (
                    <div key={c} className="commune-item">
                      <div className="commune-dot" />
                      {c}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "28px", fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: "1.7" }}>
                  Vous n&apos;êtes pas dans la liste ? Contactez-nous, nous étudions chaque demande.
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── DEVIS CTA ── */}
      <div id="devis-cta">
        <div className="container">
          <div className="devis-inner">
            <div>
              <div className="devis-title">DEVIS GRATUIT<br />SOUS 24H</div>
              <p style={{ fontSize: "16px", color: "rgba(26,39,68,0.7)" }}>
                Décrivez votre projet, on vous rappelle rapidement.
              </p>
            </div>
            <div className="devis-right">
              <a
                href="#contact"
                className="btn-outline"
                style={{ borderColor: "var(--navy)", color: "var(--navy)" }}
              >
                Formulaire en ligne →
              </a>
              <a
                href="https://wa.me/32465904372"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ background: "var(--navy)", color: "white" }}
              >
                WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTACT ── */}
      <Contact />

      {/* ── SEO TEXT ── */}
      <section style={{ background: "var(--bg-soft)", padding: "64px 0" }}>
        <div className="container">
          <div className="seo-grid">
            <div>
              <h2 className="seo-title">Votre électricien agréé à Bruxelles et en périphérie</h2>
              <p>
                TT Elec est votre électricien de confiance pour tous vos travaux électriques à Bruxelles
                et dans les communes environnantes. Agréé RGIE, nous intervenons aussi bien pour des
                particuliers que des professionnels, avec un engagement fort sur la qualité et le respect
                des normes en vigueur.
              </p>
              <p>
                Que vous ayez besoin d&apos;une <strong>installation électrique complète</strong> dans votre
                maison à Uccle, d&apos;une <strong>mise aux normes de votre tableau électrique</strong> à
                Schaerbeek, ou de l&apos;<strong>installation de caméras de sécurité</strong> pour votre
                commerce à Ixelles — TT Elec répond présent rapidement et efficacement.
              </p>
            </div>
            <div>
              <h3 className="seo-subtitle">Pourquoi choisir un électricien agréé RGIE ?</h3>
              <p>
                En Belgique, le RGIE (Règlement Général sur les Installations Électriques) est la norme
                de référence pour toute installation électrique. Faire appel à un électricien agréé comme
                TT Elec, c&apos;est la garantie que vos installations sont conformes, sécurisées et assurables.
                En cas de sinistre, votre assurance peut refuser d&apos;intervenir si les travaux n&apos;ont pas été
                réalisés par un professionnel agréé.
              </p>
              <h3 className="seo-subtitle" style={{ marginTop: "20px" }}>Interventions rapides sur tout Bruxelles</h3>
              <p>
                Basés à Bruxelles, nous intervenons sur l&apos;ensemble de la Région bruxelloise : Anderlecht,
                Auderghem, Berchem-Sainte-Agathe, Bruxelles-Ville, Etterbeek, Evere, Forest, Ganshoren,
                Ixelles, Jette, Koekelberg, Molenbeek, Saint-Gilles, Saint-Josse, Schaerbeek, Uccle,
                Watermael-Boitsfort, Woluwe-Saint-Lambert, Woluwe-Saint-Pierre, ainsi que les communes du
                Brabant wallon et flamand limitrophes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="nav-logo">
                <div className="logo-mark">⚡</div>
                <div className="logo-text" style={{ color: "white" }}>
                  TT<span style={{ color: "var(--yellow)" }}>ELEC</span>
                </div>
              </div>
              <p className="footer-tagline">
                Électricien agréé à Bruxelles.<br />
                Installation, sécurité, domotique — on s&apos;occupe de tout.
              </p>
            </div>

            <div>
              <div className="footer-col-title">Services</div>
              <ul className="footer-links">
                <li><a href="#services">Installation électrique</a></li>
                <li><a href="#services">Caméras de sécurité</a></li>
                <li><a href="#services">Tableau électrique</a></li>
                <li><a href="#services">Domotique</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Navigation</div>
              <ul className="footer-links">
                <li><a href="#realisations">Réalisations</a></li>
                <li><a href="#pourquoi">À propos</a></li>
                <li><a href="#zone">Zone d&apos;intervention</a></li>
                <li><a href="#contact">Contact & Devis</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Contact</div>
              <ul className="footer-links">
                <li><a href="tel:0465904372">0465 90 43 72</a></li>
                <li><a href="https://wa.me/32465904372">WhatsApp</a></li>
                <li><a href="https://instagram.com/ttelec">Instagram</a></li>
                <li><a href="https://tiktok.com/@ttelec">TikTok</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 TT Elec — Tous droits réservés</span>
            <span>
              Site réalisé par{" "}
              <a href="https://forgestudio.be" target="_blank" rel="noopener noreferrer">
                Forge Studio
              </a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
