import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') ?? ''

    let feedback: string | null = null
    let submissionType: string = 'feedback'
    let githubLogin: string | null = null
    let githubEmail: string | null = null
    let appVersion: string | null = null
    let platform: string | null = null
    let osRelease: string | null = null
    let arch: string | null = null

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      feedback = formData.get('feedback') as string | null
      submissionType = (formData.get('submissionType') as string) || 'feedback'
      githubLogin = formData.get('githubLogin') as string | null
      githubEmail = formData.get('githubEmail') as string | null
      appVersion = formData.get('appVersion') as string | null
      platform = formData.get('platform') as string | null
      osRelease = formData.get('osRelease') as string | null
      arch = formData.get('arch') as string | null
    } else {
      const body = await req.json()
      feedback = body.feedback ?? null
      submissionType = body.submissionType ?? 'feedback'
      githubLogin = body.githubLogin ?? null
      githubEmail = body.githubEmail ?? null
      appVersion = body.appVersion ?? null
      platform = body.platform ?? null
      osRelease = body.osRelease ?? null
      arch = body.arch ?? null
    }

    if (!feedback) {
      return NextResponse.json({ ok: false, error: 'feedback is required' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ ok: true })
    }

    const metadata: Record<string, unknown> = {
      githubLogin,
      githubEmail,
      platform,
      osRelease,
      arch,
    }

    await supabase.from('diagnostics').insert({
      user_id: githubLogin ?? 'anonymous',
      type: submissionType === 'crash' ? 'crash' : 'feedback',
      app_version: appVersion ?? 'unknown',
      os: platform ?? 'unknown',
      error: null,
      stack: null,
      message: feedback,
      screenshot: null,
      metadata,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
