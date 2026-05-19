export async function sendWhatsApp(to: string, text: string) {
  await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  })
}

export async function getMediaUrl(mediaId: string): Promise<string> {
  const res = await fetch(`https://graph.facebook.com/v18.0/${mediaId}`, {
    headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}` },
  })
  const data = await res.json()
  return data.url
}

export async function downloadMedia(url: string): Promise<Buffer> {
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}` },
  })
  return Buffer.from(await res.arrayBuffer())
}
