import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider

  let authUrl: string
  let options: Record<string, string>

  switch (provider) {
    case 'google':
      authUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
      options = {
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        response_type: 'code',
        scope: 'openid email profile',
      }
      break
    case 'instagram':
      authUrl = 'https://api.instagram.com/oauth/authorize'
      options = {
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/instagram/callback`,
        client_id: process.env.INSTAGRAM_CLIENT_ID || '',
        response_type: 'code',
        scope: 'user_profile,user_media',
      }
      break
    case 'tiktok':
      authUrl = 'https://open-api.tiktok.com/platform/oauth/connect/'
      options = {
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/tiktok/callback`,
        client_key: process.env.TIKTOK_CLIENT_KEY || '',
        response_type: 'code',
        scope: 'user.info.basic',
      }
      break
    default:
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
  }

  const qs = new URLSearchParams(options)
  return NextResponse.redirect(`${authUrl}?${qs.toString()}`)
}