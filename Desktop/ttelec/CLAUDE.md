# CLAUDE.md — Projet TT Elec

## Client
- **Société** : TT Elec
- **Secteur** : Électricien — travaux électriques tous types
- **Zone** : Bruxelles et alentours (19 communes + périphérie)
- **Téléphone / WhatsApp** : 0465 90 43 72
- **TikTok** : @tt.elec
- **Logo** : Disponible dans `public/brand_assets/`
- **Certification** : Agréé RGIE
- **Slogan FR** : "Électricité maîtrisée, tranquillité assurée"
- **Slogan NL** : "Beheerste elektriciteit, gegarandeerde veiligheid"

## Services proposés
1. Installation électrique (neuf + rénovation)
2. Tableau électrique (remplacement + mise aux normes RGIE)
3. Éclairage (LED, spots, luminaires architecturaux)
4. Domotique & Smart Home
5. Caméras de sécurité / CCTV
6. Dépannage urgence 24h/7j

---

## Stack technique
```
Framework     : Next.js 14 (App Router)
Style         : Tailwind CSS (config custom — voir Design System)
Base de données : Supabase (PostgreSQL)
Stockage images : Cloudinary
Emails          : Resend
Déploiement     : Vercel
Automatisation  : Make.com
WhatsApp API    : Meta Cloud API
IA messages     : Claude API (Anthropic)
```

---

## Design System

### ⚠️ RÈGLES ABSOLUES — NE JAMAIS VIOLER
- **JAMAIS** d'emojis comme icônes → SVG uniquement
- Emojis autorisés UNIQUEMENT : `✦` sur bouton CTA principal, `⚡` sur badge urgence
- **JAMAIS** de composants UI génériques ou "template" — tout doit être custom
- Référence visuelle obligatoire : `tt-elec-final-v7.html` à la racine
- Toujours s'y référer avant de créer un composant

### Couleurs
```js
// tailwind.config.js — extend colors
colors: {
  navy:   '#0c1428',
  navy2:  '#13203a',
  navy3:  '#1d2e4f',
  gold:   '#c8921e',
  gold2:  '#dba94a',
  gold3:  '#f2d07e',
  'off-white': '#f8f6f2',
  warm:   '#f2ede4',
  cream:  '#e8e1d5',
  'text-mid':  '#4a5068',
  'text-soft': '#8a90a8',
}
```

### Typographies (Google Fonts)
```js
// next/font/google
Fraunces  // Titres — serif, italique pour les accents em
Syne      // Labels, boutons, nav — bold, uppercase
DM_Sans   // Corps de texte — light 300/400
```

### Spacing & Radius
```
Padding sections  : py-[120px] px-[6%]
Border-radius cards : rounded-2xl (16px)
Border-radius éléments : rounded-xl (10px)
Border-radius boutons : rounded-full
```

### Animations — Règles
```
Easing universel  : cubic-bezier(.16,1,.3,1)
Scroll reveal     : translateY(26px) → 0 + opacity 0 → 1
Stagger delay     : 80ms par élément
Tilt 3D cards     : perspective(700px) rotateY/X max 7deg au hover
Blobs hero        : animation drift 14s ease-in-out infinite
Curseur custom    : point gold 9px + ring 34px, lag effect
```

### Alternance fonds de sections
```
Hero          → bg-off-white
Stats strip   → bg-navy
Services      → bg-white
Galerie       → bg-navy
Processus     → bg-warm
TikTok        → bg-off-white
Diagnostic    → bg-white
Devis         → bg-warm
CTA           → bg-navy
Footer        → bg-white
```

### Composants récurrents
Toujours créer ces composants réutilisables :
- `<SectionHeader>` : overline gold + titre Fraunces + lien optionnel à droite
- `<RevealWrapper>` : scroll reveal avec stagger delay prop
- `<BentoCard>` : card avec tilt 3D, numéro géant en fond, SVG déco, arrow hover
- `<BeforeAfterSlider>` : slider interactif avant/après
- `<NavBar>` : nav fixe avec badge "Disponible" dynamique + CTA
- `<DiagnosticTool>` : questionnaire 3 étapes
- `<ServicePicker>` : sélecteur visuel de services pour le formulaire devis

---

## Structure des pages
```
/                     → Accueil
/services             → Liste des services
/services/[slug]      → Page service individuelle (SEO)
/realisations         → Galerie dynamique Supabase
/contact              → Formulaire + infos
```

### Page Accueil `/`
1. Nav fixe (badge Disponible + CTA devis)
2. Hero : grande typo Fraunces, blobs animés, watermark SVG bolt, scroll indicator
3. Stats strip (navy) : 250+ chantiers, 24/7, 100% RGIE, 5★ — compteurs animés
4. Services bento grid (6 cards tilt 3D)
5. Galerie avant/après (cards fond navy, slider interactif)
6. Processus 6 étapes (grid)
7. TikTok feed (4 vidéos)
8. Diagnostic interactif (3 étapes)
9. Formulaire devis avec ServicePicker
10. CTA final (téléphone géant Fraunces italic)
11. Footer complet

---

## Base de données Supabase

### Table `realisations`
```sql
id            uuid primary key default gen_random_uuid()
titre         text not null
lieu          text                -- "Schaerbeek, Bruxelles"
categorie     text                -- installation|tableau|eclairage|domotique|cameras|depannage
description   text
images        text[]              -- URLs Cloudinary [avant, apres, ...]
date_chantier date default now()
publie        boolean default true
tags          text[]
created_at    timestamp default now()
```

### Table `tiktok_videos`
```sql
id          uuid primary key default gen_random_uuid()
tiktok_id   text unique
url         text
titre       text
vues        integer default 0
thumbnail   text
publie      boolean default false
created_at  timestamp default now()
```

### Table `settings`
```sql
cle         text primary key
valeur      text
-- 'disponible'     → 'true' / 'false'
-- 'phone'          → '0465904372'
-- 'whatsapp_notif' → 'true' / 'false'
```

---

## Système WhatsApp → IA → Site

### Flux complet
```
1. Client envoie message WhatsApp (photos + texte)
         ↓
2. Meta Cloud API → Webhook Next.js (/api/whatsapp)
         ↓
3. Make.com reçoit et orchestre :
         ↓
4. Claude API détecte l'intention :
   - Photos + texte  → AJOUT chantier
   - "supprime X"    → SUPPRESSION (avec confirmation)
   - "masque X"      → publie = false
   - "dispo"         → settings.disponible = true
   - "indispo"       → settings.disponible = false
   - Lien TikTok     → Proposer ajout vidéo
         ↓
5. Images → Cloudinary (upload auto) → URLs
         ↓
6. Claude API extrait : titre, lieu, catégorie, description (JSON)
         ↓
7. Insert dans Supabase table realisations
         ↓
8. Confirmation WhatsApp : "✅ Ajouté — Titre: [titre] | Lieu: [lieu]"
```

### Prompt Claude API (extraction chantier)
```
Tu es l'assistant de TT Elec, électricien agréé à Bruxelles.
Ce message WhatsApp décrit un chantier terminé : "[MESSAGE]"
Retourne UNIQUEMENT un JSON valide sans markdown :
{
  "titre": "Titre court et professionnel (max 8 mots)",
  "lieu": "Commune, Bruxelles (ex: Uccle, Bruxelles)",
  "categorie": "installation|tableau|eclairage|domotique|cameras|depannage",
  "description": "2-3 phrases professionnelles pour le site web",
  "tags": ["tag1", "tag2"]
}
```

### Flux TikTok (validation)
```
1. Bot détecte nouveau lien TikTok OU vérification automatique @tt.elec
         ↓
2. Envoi WhatsApp au client : "Nouvelle vidéo TikTok détectée — Publier sur le site ? ✅ Oui / ❌ Non"
         ↓
3. Si Oui → insert dans tiktok_videos + publie = true
4. Si Non → ignoré
```

---

## SEO

### Mots-clés prioritaires
- "électricien bruxelles"
- "électricien agréé bruxelles"
- "installation électrique bruxelles"
- "tableau électrique bruxelles"
- "caméra sécurité bruxelles"
- "électricien urgence bruxelles 24h"
- "domotique bruxelles"
- "électricien [commune]" (uccle, ixelles, schaerbeek, anderlecht…)

### Balises title par page
```
/             : Électricien Agréé Bruxelles | Installation, Dépannage 24/7 — TT Elec
/services     : Services Électricité Bruxelles | TT Elec
/realisations : Réalisations Électricien Bruxelles | TT Elec
/contact      : Contact & Devis Gratuit | Électricien Bruxelles — TT Elec
```

### Schema.org
```json
{
  "@context": "https://schema.org",
  "@type": "ElectricalContractor",
  "name": "TT Elec",
  "telephone": "+32465904372",
  "areaServed": "Bruxelles",
  "priceRange": "€€",
  "openingHours": "Mo-Su 00:00-24:00",
  "hasCredential": "RGIE",
  "url": "https://tt-elec.be",
  "sameAs": ["https://www.tiktok.com/@tt.elec"]
}
```

---

## Comptes & services à créer
| Service | Usage |
|---------|-------|
| Supabase | Base de données + Storage |
| Cloudinary | CDN images chantiers |
| Vercel | Hébergement Next.js |
| Meta Business | WhatsApp API |
| Make.com | Automatisation flux |
| Anthropic | Claude API (extraction JSON) |
| Resend | Emails formulaire de contact |

---

## Plan de développement

### Phase 1 — Structure Next.js + Design (3 jours)
- [ ] Init Next.js 14 + Tailwind config custom (couleurs + fonts)
- [ ] Composants réutilisables (NavBar, SectionHeader, BentoCard, RevealWrapper…)
- [ ] Page accueil complète (basée sur tt-elec-final-v7.html)
- [ ] Pages services statiques + [slug] dynamique
- [ ] Formulaire contact → Resend
- [ ] SEO : meta, schema.org, sitemap.xml, robots.txt

### Phase 2 — Galerie dynamique (1 jour)
- [ ] Setup Supabase + tables
- [ ] Composant BeforeAfterSlider
- [ ] Page /realisations avec filtres par catégorie
- [ ] Chargement dynamique depuis Supabase
- [ ] Seed de données de test

### Phase 3 — WhatsApp API (1 jour)
- [ ] Compte Meta Business + numéro WhatsApp API
- [ ] Webhook endpoint Next.js /api/whatsapp
- [ ] Setup Make.com : réception → traitement

### Phase 4 — IA + Automatisation (1 jour)
- [ ] Intégration Claude API dans Make.com
- [ ] Détection intention (ajout / suppression / dispo / TikTok)
- [ ] Upload Cloudinary automatique
- [ ] Confirmation WhatsApp retour client
- [ ] Flux TikTok avec validation

### Phase 5 — SEO + Déploiement (1 jour)
- [ ] Audit Lighthouse (score > 90)
- [ ] Google Search Console + sitemap
- [ ] Déploiement Vercel + domaine tt-elec.be
- [ ] Tests end-to-end complets

---

## Notes importantes
- Le numéro WhatsApp API doit être distinct du numéro perso (ou migré via Meta)
- Remplacer les placeholders par les vraies photos dès réception
- Bilingue FR/NL — toutes les pages doivent avoir les deux versions
- Ne jamais utiliser `any` en TypeScript
- Toujours utiliser les Server Components Next.js par défaut, Client Components uniquement si nécessaire (interactivité)
- Images : toujours utiliser `next/image` pour l'optimisation automatique
- Toujours lire `node_modules/next/dist/docs/` avant d'écrire du code Next.js (voir Agent.md)