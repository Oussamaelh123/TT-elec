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

      // ── Liste des chantiers numérotés ────────────────────────────────────────
      if (txt === 'liste') {
        const [{ data: published }, { data: drafts }] = await Promise.all([
          supabaseAdmin.from('realisations').select('titre, lieu').eq('publie', true).order('created_at', { ascending: false }).limit(10),
          supabaseAdmin.from('realisations').select('titre, lieu').eq('publie', false).order('created_at', { ascending: false }).limit(5),
        ])
        let msg = ''
        if (!published?.length) {
          msg = '📋 Aucun chantier publié pour le moment.'
        } else {
          const lines = published.map((r, i) => `${i + 1}. ${r.titre} — ${r.lieu}`).join('\n')
          msg = `📋 *Chantiers publiés :*\n\n${lines}\n\n_Tapez *masque [numéro]* ou *supprime [numéro]*_`
        }
        if (drafts?.length) {
          const draftLines = drafts.map(r => `⏳ ${r.titre} — ${r.lieu}`).join('\n')
          msg += `\n\n*En attente du "après" :*\n${draftLines}`
        }
        await sendWhatsApp(from, msg)
        return NextResponse.json({ ok: true })
      }

      // ── Confirmation suppression (réponse OUI) ───────────────────────────────
      if (txt === 'oui') {
        const { data: pd } = await supabaseAdmin.from('settings').select('valeur').eq('cle', 'pending_delete').single()
        if (!pd?.valeur) {
          await sendWhatsApp(from, '❌ Aucune suppression en attente.')
          return NextResponse.json({ ok: true })
        }
        const pending = JSON.parse(pd.valeur) as { id: string; titre: string; expires: number }
        if (Date.now() > pending.expires) {
          await supabaseAdmin.from('settings').delete().eq('cle', 'pending_delete')
          await sendWhatsApp(from, '⏱️ Confirmation expirée (5 min). Recommencez avec *supprime [numéro]*.')
          return NextResponse.json({ ok: true })
        }
        await supabaseAdmin.from('realisations').update({ publie: false }).eq('id', pending.id)
        await supabaseAdmin.from('settings').delete().eq('cle', 'pending_delete')
        await sendWhatsApp(from, `🗑️ *${pending.titre}* supprimé du site.`)
        return NextResponse.json({ ok: true })
      }

      // ── Masquer / Supprimer ──────────────────────────────────────────────────
      if (txt.startsWith('supprime ') || txt.startsWith('masque ')) {
        const action = txt.startsWith('supprime') ? 'supprime' : 'masque'
        const search = txt.replace(action + ' ', '').trim()

        let found: { id: string; titre: string } | null = null

        const num = parseInt(search)
        if (!isNaN(num) && num >= 1 && num <= 10) {
          // Recherche par numéro (position dans la liste)
          const { data } = await supabaseAdmin
            .from('realisations')
            .select('id, titre')
            .eq('publie', true)
            .order('created_at', { ascending: false })
            .range(num - 1, num - 1)
          found = data?.[0] ?? null
        } else {
          // Recherche par texte (fallback)
          const { data } = await supabaseAdmin
            .from('realisations')
            .select('id, titre')
            .eq('publie', true)
            .ilike('titre', `%${search}%`)
            .limit(1)
          found = data?.[0] ?? null
        }

        if (!found) {
          await sendWhatsApp(from, `❌ Chantier introuvable.\n\nTapez *liste* pour voir vos chantiers et leur numéro.`)
          return NextResponse.json({ ok: true })
        }

        if (action === 'masque') {
          await supabaseAdmin.from('realisations').update({ publie: false }).eq('id', found.id)
          await sendWhatsApp(from, `✅ *${found.titre}* masqué du site.`)
        } else {
          const pending = { id: found.id, titre: found.titre, expires: Date.now() + 5 * 60 * 1000 }
          await supabaseAdmin.from('settings').upsert({ cle: 'pending_delete', valeur: JSON.stringify(pending) })
          await sendWhatsApp(from, `⚠️ Supprimer *"${found.titre}"* ?\n\nRépondez *OUI* pour confirmer _(valable 5 minutes)_.`)
        }
        return NextResponse.json({ ok: true })
      }

      await sendWhatsApp(from, '👋 Bonjour ! Envoyez une *photo ou vidéo* de votre chantier pour l\'ajouter au site.\n\nCommandes disponibles :\n• *dispo* — badge Disponible\n• *indispo* — badge Indisponible\n• *liste* — voir vos chantiers numérotés\n• *masque [numéro ou titre]* — masquer un chantier\n• *supprime [numéro ou titre]* — supprimer (confirmation requise)')
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

      const mediaItem = { url: publicUrl, type: isVideo ? 'video' : 'image', label }
      type MediaRow = { label?: string }

      // ── Photo AVANT → crée un brouillon (publie: false) ─────────────────────
      if (label === 'avant') {
        const chantier = caption
          ? await extractChantier(caption)
          : { titre: 'Nouveau chantier', lieu: 'Bruxelles', categorie: 'installation', description: '', tags: [] as string[] }

        const { error } = await supabaseAdmin.from('realisations').insert({
          titre: chantier.titre,
          lieu: chantier.lieu,
          categorie: chantier.categorie,
          description: chantier.description,
          tags: chantier.tags,
          media: [mediaItem],
          publie: false,
        })
        if (error) throw new Error(`Insert: ${error.message}`)

        await sendWhatsApp(from,
          `📷 *Photo avant reçue !*\n\n📌 *${chantier.titre}*\n📍 ${chantier.lieu}\n\nEnvoyez maintenant la photo *après* pour publier le chantier sur le site. 👇`
        )
        return NextResponse.json({ ok: true })
      }

      // ── Photo APRÈS → trouve le brouillon, publie le chantier ───────────────
      if (label === 'apres') {
        const { data: drafts } = await supabaseAdmin
          .from('realisations')
          .select('id, titre, media')
          .eq('publie', false)
          .order('created_at', { ascending: false })
          .limit(10)

        const avantDraft = drafts?.find(r => {
          const labels = ((r.media as MediaRow[]) ?? []).map(m => m.label)
          return labels.includes('avant') && !labels.includes('apres')
        })

        if (!avantDraft) {
          await sendWhatsApp(from,
            `❓ Aucun chantier "avant" en attente trouvé.\n\nEnvoyez d'abord la photo *avant* pour créer le chantier, puis envoyez l'*après*.`
          )
          return NextResponse.json({ ok: true })
        }

        const newMedia = [...((avantDraft.media as MediaRow[]) ?? []), mediaItem]
        const { error } = await supabaseAdmin
          .from('realisations')
          .update({ media: newMedia, publie: true })
          .eq('id', avantDraft.id)
        if (error) throw new Error(`Update: ${error.message}`)

        await sendWhatsApp(from,
          `✅ *Chantier publié !*\n\n📌 *${avantDraft.titre}*\n\nLe slider avant/après est maintenant visible sur le site.\n_tt-elec.be/realisations_`
        )
        return NextResponse.json({ ok: true })
      }

      // ── Pas de label → publie immédiatement ─────────────────────────────────
      const chantier = caption
        ? await extractChantier(caption)
        : { titre: 'Nouveau chantier', lieu: 'Bruxelles', categorie: 'installation', description: '', tags: [] as string[] }

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
        `✅ *Ajouté au site !*\n\n📌 *${chantier.titre}*\n📍 ${chantier.lieu}\n🏷️ ${chantier.categorie}\n\n_Visible sur tt-elec.be/realisations_`
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
