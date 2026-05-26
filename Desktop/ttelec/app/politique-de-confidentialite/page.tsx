import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politique de confidentialité | TT Elec',
  description: 'Politique de confidentialité de TT Elec, électricien agréé RGIE à Bruxelles.',
}

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '760px', margin: '0 auto', padding: '80px 24px', color: '#111827', lineHeight: '1.7' }}>
      <Link href="/" style={{ color: '#c8921e', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '40px' }}>
        ← Retour au site
      </Link>

      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px', color: '#0c1428' }}>Politique de confidentialité</h1>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '40px' }}>Dernière mise à jour : mai 2026</p>

      <p style={{ marginBottom: '24px' }}>
        TT Elec (ci-après &quot;nous&quot;) s&apos;engage à protéger la vie privée des utilisateurs de son site web <strong>tt-elec.be</strong> et de ses outils de communication (WhatsApp, formulaires de contact).
      </p>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0c1428', marginTop: '36px', marginBottom: '12px' }}>1. Données collectées</h2>
      <p style={{ marginBottom: '12px' }}>Nous collectons uniquement les données que vous nous transmettez volontairement :</p>
      <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
        <li>Nom et prénom</li>
        <li>Numéro de téléphone</li>
        <li>Adresse ou localité</li>
        <li>Description de votre projet ou demande</li>
        <li>Photos de chantier envoyées via WhatsApp (avec votre accord)</li>
      </ul>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0c1428', marginTop: '36px', marginBottom: '12px' }}>2. Utilisation des données</h2>
      <p style={{ marginBottom: '24px' }}>
        Vos données sont utilisées exclusivement pour répondre à vos demandes de devis et d&apos;intervention, et pour publier les réalisations de chantiers sur notre site web (photos uniquement, avec votre accord préalable).
      </p>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0c1428', marginTop: '36px', marginBottom: '12px' }}>3. WhatsApp et API Meta</h2>
      <p style={{ marginBottom: '24px' }}>
        Notre site utilise l&apos;API WhatsApp Business (Meta) pour recevoir et envoyer des messages. Les messages sont traités conformément aux{' '}
        <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#c8921e' }}>conditions d&apos;utilisation de WhatsApp</a>.
        Nous ne partageons pas vos données avec des tiers à des fins commerciales.
      </p>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0c1428', marginTop: '36px', marginBottom: '12px' }}>4. Conservation des données</h2>
      <p style={{ marginBottom: '24px' }}>
        Vos données sont conservées uniquement le temps nécessaire au traitement de votre demande. Les photos de réalisations publiées sur le site peuvent être retirées sur simple demande.
      </p>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0c1428', marginTop: '36px', marginBottom: '12px' }}>5. Vos droits</h2>
      <p style={{ marginBottom: '24px' }}>
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous par WhatsApp au <a href="tel:0465904372" style={{ color: '#c8921e' }}>0465 90 43 72</a>.
      </p>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0c1428', marginTop: '36px', marginBottom: '12px' }}>6. Contact</h2>
      <p>
        TT Elec · Bruxelles, Belgique<br />
        Téléphone : <a href="tel:0465904372" style={{ color: '#c8921e' }}>0465 90 43 72</a><br />
        WhatsApp : <a href="https://wa.me/32465904372" style={{ color: '#c8921e' }}>wa.me/32465904372</a>
      </p>
    </div>
  )
}
