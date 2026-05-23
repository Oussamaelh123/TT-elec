import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ thumbnail_url: null }, { status: 400 })

  try {
    const oembedUrl = `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@tt.elec/video/${id}`
    const res = await fetch(oembedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TT-Elec/1.0)' },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return NextResponse.json({ thumbnail_url: null })
    const data = await res.json()
    return NextResponse.json({ thumbnail_url: data.thumbnail_url ?? null })
  } catch {
    return NextResponse.json({ thumbnail_url: null })
  }
}
