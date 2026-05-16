import { Metadata } from 'next'
import RealisationsClient from './RealisationsClient'

export const metadata: Metadata = {
  title: 'Réalisations Électricien Bruxelles | TT Elec',
  description: 'Découvrez les chantiers réalisés par TT Elec — électricien agréé RGIE à Bruxelles. Tableaux électriques, câblage, éclairage, domotique, caméras.',
}

export default function RealisationsPage() {
  return <RealisationsClient />
}
