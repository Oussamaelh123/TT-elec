export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendWhatsApp, getMediaUrl, downloadMedia } from '@/lib/whatsapp'

const CLIENT_NUMBER = process.env.WHATSAPP_CLIENT_NUMBER!

// ─── Vérification webhook Meta ───────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const p = new URL(req.url).searchParams
  if (p.get('hub.mode') === 'subscribe' && p.get('hub.verify_token') === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(p.get('hub.challenge'), { status: 200 })
  }
  return new Response('Forbidden', { status: 403 })
}

// ─── Réception des messages ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json()
  const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
  if (!message) return NextResponse.json({ ok: true })

  const from: string = message.from
  const type: string = message.type

  // Ignorer les messages qui ne viennent pas du client
  if (from !== CLIENT_NUMBER) return NextResponse.json({ ok: true })

  try {
    // ── Commandes texte ──────────────────────────────────────────────────────
    if (type === 'text') {
      const txt = (message.text?.body ?? '').trim().toLowerCase()

      if (txt === 'dispo') {
        await supabaseAdmin.from('settings').upsert({ cle: 'disponible', valeur: 'true' })
        await sendWhatsApp(from, '✅ Statut mis à jour : *Disponible*\nLe badge vert est visible sur le site.')
        return NextResponse.json({ ok: true })
      }

      if (txt === 'indispo') {
        await supabaseAdmin.from('settings').upsert({ cle: 'disponible', valeur: 'false' })
        await sendWhatsApp(from, '⏸️ Statut mis à jour : *Indisponible*')
        return NextResponse.json({ ok: true })
      }

      if (txt.startsWith('supprime ') || txt.startsWith('masque ')) {
        const action = txt.startsWith('supprime') ? 'supprime' : 'masque'
        const search = txt.replace(action + ' ', '').trim()
        const { data } = await supabaseAdmin.from('realisations').select('id, titre').ilike('titre', `%${search}%`).limit(1)
        if (!data?.length) {
          await sendWhatsApp(from, `❌ Aucun chantier trouvé pour "${search}".`)
        } else {
          await supabaseAdmin.from('realisations').update({ publie: false }).eq('id', data[0].id)
          await sendWhatsApp(from, `✅ *${data[0].titre}* ${action === 'supprime' ? 'supprimé' : 'masqué'} du site.`)
        }
        return NextResponse.json({ ok: true })
      }

      await sendWhatsApp(from, '👋 Bonjour ! Envoyez une *photo ou vidéo* de votre chantier pour l\'ajouter au site.\n\nCommandes disponibles :\n• *dispo* — badge Disponible\n• *indispo* — badge Indisponible\n• *masque [titre]* — masquer un chantier\n• *supprime [titre]* — supprimer un chantier')
      return NextResponse.json({ ok: true })
    }

    // ── Médias : image, vidéo, document ─────────────────────────────────────
    if (['image', 'video', 'document'].includes(type)) {
      const media    = message[type]
      const mediaId  = media?.id
      const caption  = media?.caption ?? ''
      const isVideo  = type === 'video'
      const ext      = isVideo ? 'mp4' : type === 'document' ? (media?.filename?.split('.').pop() ?? 'jpg') : 'jpg'
      const filename = `${Date.now()}.${ext}`
      const mimeType = isVideo ? 'video/mp4' : type === 'document' ? 'application/octet-stream' : 'image/jpeg'

      // Détecter label avant/après depuis la légende
      const captionLower = caption.toLowerCase()
      const label = captionLower.includes('avant') ? 'avant' : captionLower.includes('après') || captionLower.includes('apres') ? 'apres' : ''

      // Télécharger depuis Meta
      const mediaUrl = await getMediaUrl(mediaId)
      const buffer   = await downloadMedia(mediaUrl)

      // Upload vers Supabase Storage (bucket: realisations)
      const storagePath = `chantiers/${filename}`
      const blob = new Blob([buffer as ArrayBuffer], { type: mimeType })
      const { error: uploadError } = await supabaseAdmin.storage
        .from('realisations')
        .upload(storagePath, blob, { contentType: mimeType, upsert: false })

      if (uploadError) throw new Error(`Storage upload: ${uploadError.message}`)

      const { data: { publicUrl } } = supabaseAdmin.storage.from('realisations').getPublicUrl(storagePath)

      // Extraire les infos du chantier via Claude
      const chantier = caption
        ? await extractChantier(caption)
        : { titre: 'Nouveau chantier', lieu: 'Bruxelles', categorie: 'installation', description: '', tags: [] as string[] }

      // Insérer en base
      const mediaItem = { url: publicUrl, type: isVideo ? 'video' : 'image', label }
      const { error: insertError } = await supabaseAdmin.from('realisations').insert({
        titre: chantier.titre,
        lieu: chantier.lieu,
        categorie: chantier.categorie,
        description: chantier.description,
        tags: chantier.tags,
        media: [mediaItem],
        publie: true,
      })

      if (insertError) throw new Error(`Insert: ${insertError.message}`)

      await sendWhatsApp(from,
        `✅ *Ajouté au site !*\n\n📌 *${chantier.titre}*\n📍 ${chantier.lieu}\n🏷️ ${chantier.categorie}${label ? `\n🔖 Label : ${label}` : ''}\n\n_Visible sur tt-elec.be/realisations_`
      )
    }
  } catch (err) {
    console.error('[WhatsApp webhook]', err)
    await sendWhatsApp(from, '❌ Une erreur s\'est produite. Réessayez ou contactez le développeur.')
  }

  return NextResponse.json({ ok: true })
}

// ─── Extraction chantier via Claude ──────────────────────────────────────────
async function extractChantier(text: string) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `Tu es l'assistant de TT Elec, électricien agréé à Bruxelles.
Ce message WhatsApp décrit un chantier terminé : "${text}"
Retourne UNIQUEMENT un JSON valide sans markdown :
{
  "titre": "Titre court et professionnel (max 8 mots)",
  "lieu": "Commune, Bruxelles (ex: Uccle, Bruxelles)",
  "categorie": "installation|tableau|eclairage|domotique|cameras|depannage|conformite|borne|alarme|parlophone",
  "description": "2-3 phrases professionnelles pour le site web",
  "tags": ["tag1", "tag2"]
}`,
    }],
  })

  const raw = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  return JSON.parse(cleaned) as { titre: string; lieu: string; categorie: string; description: string; tags: string[] }
}
