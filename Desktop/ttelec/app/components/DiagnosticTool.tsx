'use client'
import { useState } from 'react'

const SERVICES = [
  { id: 'tableau',    n: '01', t: 'Tableau électrique',      d: 'Remplacement, mise aux normes RGIE, disjoncteur' },
  { id: 'cablage',    n: '02', t: 'Câblage & Installation',  d: 'Rénovation, prises, construction neuve' },
  { id: 'eclairage',  n: '03', t: 'Éclairage',               d: 'Spots LED, éclairage extérieur, variation' },
  { id: 'domotique',  n: '04', t: 'Domotique & Smart Home',  d: 'Contrôle à distance, volets, chauffage' },
  { id: 'cameras',    n: '05', t: 'Caméras de sécurité',     d: 'Installation CCTV, surveillance intérieure/extérieure' },
  { id: 'depannage',  n: '06', t: 'Dépannage urgent',        d: 'Panne totale, court-circuit, intervention rapide' },
  { id: 'conformite', n: '07', t: 'Conformité RGIE',         d: 'Contrôle, certificat, rapport de conformité' },
  { id: 'borne',      n: '08', t: 'Borne de recharge EV',    d: 'Installation borne voiture électrique' },
  { id: 'alarme',     n: '09', t: 'Alarme & Incendie',       d: 'Détecteurs fumée, anti-intrusion, maintenance' },
  { id: 'parlophone', n: '10', t: 'Parlophone & Visiophone', d: 'Installation, remplacement, visiophone vidéo' },
]

const DETAILS: Record<string, { n: string; t: string }[]> = {
  tableau:    [{ n:'01', t:'Remplacement complet du tableau' }, { n:'02', t:'Disjoncteur qui saute régulièrement' }, { n:'03', t:'Mise aux normes RGIE' }, { n:'04', t:'Ajout de circuits' }],
  cablage:    [{ n:'01', t:'Rénovation câblage complet' }, { n:'02', t:'Ajout de prises / interrupteurs' }, { n:'03', t:'Construction neuve' }, { n:'04', t:'Câble ou prise défaillante' }],
  eclairage:  [{ n:'01', t:'Installation spots LED encastrés' }, { n:'02', t:'Éclairage extérieur / jardin' }, { n:'03', t:'Variateur / domotique lumière' }, { n:'04', t:'Remplacement luminaires' }],
  domotique:  [{ n:'01', t:'Système domotique complet' }, { n:'02', t:'Volets / stores motorisés' }, { n:'03', t:'Chauffage intelligent' }, { n:'04', t:'Contrôle à distance (app)' }],
  cameras:    [{ n:'01', t:'Système caméras neuf' }, { n:'02', t:'Extension système existant' }, { n:'03', t:'Caméra extérieure / périmètre' }, { n:'04', t:'Remplacement caméras' }],
  depannage:  [{ n:'01', t:'Panne totale — plus de courant' }, { n:'02', t:'Circuit ou prise mort' }, { n:'03', t:'Court-circuit / odeur brûlée' }, { n:'04', t:'Autre urgence électrique' }],
  conformite: [{ n:'01', t:'Contrôle RGIE (achat / vente)' }, { n:'02', t:'Mise aux normes location' }, { n:'03', t:'Rapport de conformité' }, { n:'04', t:'Travaux de mise en conformité' }],
  borne:      [{ n:'01', t:'Borne maison (résidentiel)' }, { n:'02', t:'Borne immeuble / copropriété' }, { n:'03', t:'Borne entreprise / parking' }, { n:'04', t:'Upgrade borne existante' }],
  alarme:     [{ n:'01', t:'Alarme incendie / détecteurs fumée' }, { n:'02', t:'Système anti-intrusion' }, { n:'03', t:'Maintenance / remplacement' }, { n:'04', t:'Alarme complète neuve' }],
  parlophone: [{ n:'01', t:'Installation neuve' }, { n:'02', t:'Remplacement interphone existant' }, { n:'03', t:'Visiophone avec caméra vidéo' }, { n:'04', t:'Interphone immeuble / copropriété' }],
}

const URGENCY = [
  { id: 'urgent',   t: 'Urgent — aujourd\'hui' },
  { id: 'semaine',  t: 'Cette semaine' },
  { id: 'mois',     t: 'Ce mois-ci' },
  { id: 'flexible', t: 'Pas de contrainte' },
]

export default function DiagnosticTool() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [service, setService] = useState('')
  const [detail, setDetail] = useState('')
  const [localite, setLocalite] = useState('')
  const [urgency, setUrgency] = useState('')

  const selectedService = SERVICES.find(s => s.id === service)

  const buildMsg = () => [
    'Bonjour TT Elec 👋',
    '',
    `*Service :* ${selectedService?.t ?? ''}`,
    `*Besoin :* ${detail}`,
    localite  ? `*Localité :* ${localite}`       : '',
    urgency   ? `*Disponibilité :* ${urgency}`   : '',
    '',
    'Pouvez-vous me contacter pour un devis ?',
  ].filter(l => l !== undefined).join('\n')

  return (
    <div className="diag-wrap rv d1">
      <div className="diag-head">
        <div className="dhi">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
        </div>
        <div>
          <h3>Diagnostic électrique en ligne</h3>
          <p>Identifiez votre besoin en 3 étapes — réponse sous 24h</p>
        </div>
      </div>

      <div className="diag-body">
        {step === 1 && (
          <>
            <div className="diag-q">Quel type de travaux vous intéresse ?</div>
            <div className="diag-opts">
              {SERVICES.map(s => (
                <div key={s.id} className={`dopt${service === s.id ? ' sel' : ''}`} onClick={() => { setService(s.id); setDetail('') }}>
                  <div className="doptn">{s.n}</div>
                  <div><div className="doptt">{s.t}</div><div className="doptd">{s.d}</div></div>
                </div>
              ))}
            </div>
            <div className="diag-nav">
              <span />
              <button className="diag-next" disabled={!service} onClick={() => setStep(2)}>
                Continuer
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="diag-q">Précisez votre besoin</div>
            <div className="diag-opts">
              {(DETAILS[service] ?? []).map(d => (
                <div key={d.n} className={`dopt${detail === d.t ? ' sel' : ''}`} onClick={() => setDetail(d.t)}>
                  <div className="doptn">{d.n}</div>
                  <div><div className="doptt">{d.t}</div></div>
                </div>
              ))}
            </div>
            <div className="diag-nav">
              <button className="diag-back" onClick={() => setStep(1)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Retour
              </button>
              <button className="diag-next" disabled={!detail} onClick={() => setStep(3)}>
                Continuer
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="diag-q">Où êtes-vous situé ?</div>
            <input
              className="diag-input"
              placeholder="Ex : Ixelles, Bruxelles"
              value={localite}
              onChange={e => setLocalite(e.target.value)}
            />
            <div className="diag-q" style={{ marginTop: '28px' }}>Quand souhaitez-vous une intervention ?</div>
            <div className="diag-opts">
              {URGENCY.map(u => (
                <div key={u.id} className={`dopt${urgency === u.t ? ' sel' : ''}`} onClick={() => setUrgency(u.t)}>
                  <div><div className="doptt">{u.t}</div></div>
                </div>
              ))}
            </div>
            <div className="diag-nav">
              <button className="diag-back" onClick={() => setStep(2)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Retour
              </button>
              <a
                className="diag-finish"
                href={`https://wa.me/32465904372?text=${encodeURIComponent(buildMsg())}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" /><path d="M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.462 3.49 11.815 11.815 0 0012.05 0z" /></svg>
                Envoyer sur WhatsApp
              </a>
            </div>
          </>
        )}
      </div>

      <div className="diag-foot">
        <span className="diag-step">Étape {step} / 3</span>
        <div className="diag-bar">
          <div className={`dbs${step >= 1 ? ' on' : ''}`} />
          <div className={`dbs${step >= 2 ? ' on' : ''}`} />
          <div className={`dbs${step >= 3 ? ' on' : ''}`} />
        </div>
      </div>
    </div>
  )
}
