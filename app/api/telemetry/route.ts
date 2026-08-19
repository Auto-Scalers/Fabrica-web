import { NextRequest, NextResponse } from 'next/server'

interface TelemetryEvent {
  event: string
  properties?: Record<string, unknown>
  timestamp?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, properties, timestamp } = body as TelemetryEvent

    if (!event || typeof event !== 'string') {
      return NextResponse.json({ error: 'event is required' }, { status: 400 })
    }

    const posthogKey = process.env.POSTHOG_API_KEY
    const posthogHost = process.env.POSTHOG_HOST || 'https://us.i.posthog.com'

    if (!posthogKey) {
      // No PostHog configured — accept silently (fire-and-forget)
      return NextResponse.json({ success: true, buffered: false })
    }

    const distinctId = req.headers.get('x-fabrica-user-id') || 'anonymous'

    const payload = {
      api_key: posthogKey,
      event,
      distinct_id: distinctId,
      properties: properties || {},
      timestamp: timestamp || new Date().toISOString(),
    }

    // Fire-and-forget to PostHog
    fetch(`${posthogHost}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Silently swallow — telemetry should never block the client
    })

    return NextResponse.json({ success: true, buffered: true })
  } catch (err: unknown) {
    console.error('Telemetry error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
