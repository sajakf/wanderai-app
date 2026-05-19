import OpenAI from 'openai'
import { SYSTEM_PROMPT, ERROR_MESSAGE } from './prompts'
import { TRAVEL_TOOLS } from './tools'
import {
  searchFlights, confirmFlightPrice, createFlightOrder,
  formatFlightOffersForWhatsApp,
} from '@/lib/travel/duffel'
import { searchHotels, formatHotelOffersForWhatsApp } from '@/lib/travel/bookingcom'
import { searchExperiences, formatExperiencesForWhatsApp } from '@/lib/travel/viator'
import { getConversationMessages, appendMessage } from '@/lib/agent/conversations'

// Lazy init — avoids build-time crash when OPENROUTER_API_KEY is not set
let _ai: OpenAI | null = null
function getAI() {
  if (!_ai) {
    _ai = new OpenAI({
      apiKey:  process.env.OPENROUTER_API_KEY ?? 'placeholder',
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'https://app.thewanderlust.app',
        'X-Title':      'WanderAI Travel Agent',
      },
    })
  }
  return _ai
}

const MODEL = 'anthropic/claude-sonnet-4-5'

// ── Main agent entry point ────────────────────────────────────────────────────

export async function runAgent(
  conversationId: string,
  userMessage: string,
): Promise<string> {
  try {
    // 1. Persist user message
    await appendMessage(conversationId, { role: 'user', content: userMessage })

    // 2. Load full history (last 30 messages to stay within context)
    const history = await getConversationMessages(conversationId, 30)

    // 3. Call Claude with tools
    const response = await getAI().chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
      ],
      tools: TRAVEL_TOOLS,
      tool_choice: 'auto',
      max_tokens: 1024,
    })

    const msg = response.choices[0].message

    // 4. Handle tool calls (agentic loop — up to 5 rounds)
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      // Persist assistant message with tool calls
      await appendMessage(conversationId, {
        role:       'assistant',
        content:    msg.content ?? '',
        tool_calls: msg.tool_calls,
      })

      // Execute each tool
      const toolResults: string[] = []

      for (const tc of msg.tool_calls) {
        const fn   = (tc as { id: string; function: { name: string; arguments: string } }).function
        const args = JSON.parse(fn.arguments)
        let result: string

        try {
          result = await dispatchTool(fn.name, args, conversationId)
        } catch (err) {
          result = `Tool error: ${(err as Error).message}`
        }

        toolResults.push(result)

        // Persist tool result
        await appendMessage(conversationId, {
          role:        'tool',
          content:     result,
          tool_call_id: tc.id,
          tool_name:   fn.name,
        })
      }

      // 5. Get Claude's final response after tool results
      const finalHistory = await getConversationMessages(conversationId, 30)
      const finalResponse = await getAI().chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...finalHistory,
        ],
        max_tokens: 1024,
      })

      const finalText = finalResponse.choices[0].message.content ?? ERROR_MESSAGE
      await appendMessage(conversationId, { role: 'assistant', content: finalText })
      return finalText
    }

    // 5. No tool calls — direct text response
    const text = msg.content ?? ERROR_MESSAGE
    await appendMessage(conversationId, { role: 'assistant', content: text })
    return text

  } catch (err) {
    console.error('[WanderAI Agent Error]', err)
    return ERROR_MESSAGE
  }
}

// ── Tool dispatcher ────────────────────────────────────────────────────────────

async function dispatchTool(
  name: string,
  args: Record<string, unknown>,
  conversationId: string,
): Promise<string> {
  switch (name) {
    case 'search_flights': {
      const offers = await searchFlights({
        origin:        args.origin as string,
        destination:   args.destination as string,
        departureDate: args.departureDate as string,
        returnDate:    args.returnDate as string | undefined,
        adults:        args.adults as number,
        cabinClass:    args.cabinClass as 'economy' | 'business' | 'first' | undefined,
      })
      // Store offer IDs in conversation state for later selection
      return formatFlightOffersForWhatsApp(offers, args.origin as string, args.destination as string)
        + `\n\n[INTERNAL: offer_ids=${offers.map(o => o.id).join(',')}]`
    }

    case 'search_hotels': {
      const nights = Math.ceil(
        (new Date(args.checkout as string).getTime() -
         new Date(args.checkin as string).getTime()) / 86_400_000
      )
      const offers = await searchHotels({
        cityName:     args.cityName as string,
        checkin:      args.checkin as string,
        checkout:     args.checkout as string,
        adults:       args.adults as number,
        rooms:        (args.rooms as number) ?? 1,
        starRating:   args.starRating as number | undefined,
        maxBudgetUsd: args.maxBudgetUsd as number | undefined,
      })
      return formatHotelOffersForWhatsApp(offers, args.cityName as string, nights)
    }

    case 'search_experiences': {
      const offers = await searchExperiences(
        args.destination as string,
        args.category as string | undefined,
      )
      return formatExperiencesForWhatsApp(offers, args.destination as string)
    }

    case 'confirm_flight_price': {
      const result = await confirmFlightPrice(args.offerId as string)
      return `✅ Price confirmed: ${result.priceDisplay} (total for all passengers). Ready to book!`
    }

    case 'create_flight_booking': {
      const { bookingRef, status } = await createFlightOrder(
        [args.offerId as string],
        [args.passenger as Parameters<typeof createFlightOrder>[1][0]],
      )
      return `🎉 Booking confirmed!\nReference: *${bookingRef}*\nStatus: ${status}\nCheck your email for the e-ticket.`
    }

    default:
      return `Unknown tool: ${name}`
  }
}
