// ─── WanderAI WhatsApp Webhook ────────────────────────────────────────────────
// Twilio sends a POST (form-urlencoded) for every inbound WhatsApp message.
// We return 200 immediately, then process + reply asynchronously via Twilio API.
// This avoids Twilio's 15s timeout while allowing LLM calls to take 30-60s.

import { NextResponse } from 'next/server'
import { after } from 'next/server'
import twilio from 'twilio'
import { runAgent } from '@/lib/agent'
import { getOrCreateConversation } from '@/lib/agent/conversations'
import { GREETING_MESSAGE } from '@/lib/agent/prompts'

// Lazy init — avoids build-time crash when env vars are placeholders
let _twilioClient: ReturnType<typeof twilio> | null = null
function getTwilio() {
  if (!_twilioClient) {
    _twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!,
    )
  }
  return _twilioClient
}

const FROM_NUMBER = () => process.env.TWILIO_WHATSAPP_FROM ?? 'whatsapp:+14155238886'

// ── Webhook verification (GET) ─────────────────────────────────────────────────
// Twilio doesn't use a GET verify for WhatsApp (unlike Facebook) — but keep for
// future reference or ngrok testing.
export async function GET() {
  return new NextResponse('WanderAI WhatsApp webhook is live ✅', { status: 200 })
}

// ── Main webhook (POST) ────────────────────────────────────────────────────────
export async function POST(req: Request) {
  // Parse Twilio's form-encoded body
  const formData  = await req.formData()
  const from      = formData.get('From')      as string // "whatsapp:+96512345678"
  const body      = formData.get('Body')      as string // message text
  const name      = formData.get('ProfileName') as string | undefined
  const mediaUrl  = formData.get('MediaUrl0') as string | null

  // Validate required fields
  if (!from || (!body && !mediaUrl)) {
    return new NextResponse('Bad request', { status: 400 })
  }

  // ── Acknowledge Twilio immediately (must be < 15s) ────────────────────────
  // We return empty TwiML — actual reply is sent via REST API after processing.
  const twimlResponse = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>'

  // ── Process message async (runs after response is sent) ──────────────────
  after(async () => {
    try {
      const userText = body?.trim() ?? ''

      // Get or create conversation in Supabase
      const conversationId = await getOrCreateConversation(from, name ?? undefined)

      // Handle media (images — future: passport upload)
      if (mediaUrl && !userText) {
        await sendWhatsApp(from, '📎 I received your document! _Passport/document scanning coming soon._ For now, please type your request.')
        return
      }

      // Handle restart command
      if (userText.toLowerCase() === 'restart' || userText.toLowerCase() === 'hi' || userText.toLowerCase() === 'hello' || userText === '1') {
        if (userText.toLowerCase() === 'restart') {
          await sendWhatsApp(from, GREETING_MESSAGE)
          return
        }
      }

      // Run agent
      const reply = await runAgent(conversationId, userText)

      // Send reply back via Twilio (split if > 1500 chars)
      const chunks = splitMessage(reply)
      for (const chunk of chunks) {
        await sendWhatsApp(from, chunk)
        // Small delay between multiple messages
        if (chunks.length > 1) await sleep(600)
      }

    } catch (err) {
      console.error('[WhatsApp webhook error]', err)
      try {
        await sendWhatsApp(from, '😅 Something went wrong. Please try again in a moment.')
      } catch { /* ignore send failure */ }
    }
  })

  return new NextResponse(twimlResponse, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}

// ── Helpers ────────────────────────────────────────────────────────────────────

async function sendWhatsApp(to: string, body: string): Promise<void> {
  await getTwilio().messages.create({
    from: FROM_NUMBER(),
    to,
    body,
  })
}

/** Split long messages at natural break points (paragraph or 1400 chars) */
function splitMessage(text: string, maxLen = 1400): string[] {
  if (text.length <= maxLen) return [text]

  const chunks: string[] = []
  const paragraphs = text.split('\n\n')
  let current = ''

  for (const para of paragraphs) {
    if ((current + '\n\n' + para).length > maxLen && current.length > 0) {
      chunks.push(current.trim())
      current = para
    } else {
      current = current ? current + '\n\n' + para : para
    }
  }

  if (current.trim()) chunks.push(current.trim())
  return chunks.filter(Boolean)
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
