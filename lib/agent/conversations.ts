import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

// Lazy init — avoids build-time crash when env vars are not yet set in CI
let _supabase: SupabaseClient | null = null
function db() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
  }
  return _supabase
}

// ── Get or create conversation ────────────────────────────────────────────────

export async function getOrCreateConversation(
  phoneNumber: string,
  displayName?: string,
): Promise<string> {
  const { data, error } = await db()
    .from('wa_conversations')
    .upsert(
      { phone_number: phoneNumber, display_name: displayName },
      { onConflict: 'phone_number', ignoreDuplicates: false },
    )
    .select('id')
    .single()

  if (error) throw new Error(`Conversation upsert failed: ${error.message}`)
  return data.id as string
}

// ── Load message history ──────────────────────────────────────────────────────

export async function getConversationMessages(
  conversationId: string,
  limit = 30,
): Promise<ChatCompletionMessageParam[]> {
  const { data, error } = await db()
    .from('wa_messages')
    .select('role, content, tool_calls, tool_call_id, tool_name')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) throw new Error(`Message fetch failed: ${error.message}`)

  return (data ?? []).map(row => {
    if (row.role === 'tool') {
      return {
        role:         'tool' as const,
        content:      row.content ?? '',
        tool_call_id: row.tool_call_id ?? '',
      }
    }
    if (row.role === 'assistant' && row.tool_calls) {
      return {
        role:       'assistant' as const,
        content:    row.content ?? null,
        tool_calls: row.tool_calls,
      }
    }
    return {
      role:    row.role as 'user' | 'assistant',
      content: row.content ?? '',
    }
  })
}

// ── Append message ────────────────────────────────────────────────────────────

interface MessageRow {
  role:         'user' | 'assistant' | 'tool'
  content:      string | null
  tool_calls?:  unknown
  tool_call_id?: string
  tool_name?:   string
}

export async function appendMessage(
  conversationId: string,
  msg: MessageRow,
): Promise<void> {
  const { error } = await db().from('wa_messages').insert({
    conversation_id: conversationId,
    role:            msg.role,
    content:         msg.content,
    tool_calls:      msg.tool_calls ?? null,
    tool_call_id:    msg.tool_call_id ?? null,
    tool_name:       msg.tool_name ?? null,
  })

  if (error) console.error('Failed to save message:', error.message)
}

// ── Save booking ──────────────────────────────────────────────────────────────

export async function saveBooking(
  conversationId: string,
  booking: {
    type: 'flight' | 'hotel' | 'experience' | 'transfer'
    provider: string
    providerBookingId?: string
    details: unknown
    totalUsd: number
  },
) {
  await db().from('wa_bookings').insert({
    conversation_id:     conversationId,
    type:                booking.type,
    provider:            booking.provider,
    provider_booking_id: booking.providerBookingId,
    details:             booking.details,
    total_usd:           booking.totalUsd,
    total_kwd:           booking.totalUsd * 0.307,
    status:              'confirmed',
  })
}
