'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Plane, MapPin, Sparkles, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  chips?: string[]
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "✦ Hey there! I'm your WanderAI planner. Tell me your dream trip in plain language — destination, dates, budget, vibe. I'll handle the rest.",
    chips: ['10 days in Japan 🇯🇵', 'Beach week under $1,500 🏖️', 'Europe on a budget 🇪🇺', 'Surprise me ✨'],
  },
]

const MOCK_ITINERARY = {
  destination: 'Kyoto, Japan',
  dates: 'Oct 14 – 25, 2025',
  budget: '$2,400',
  days: [
    { day: 1, title: 'Arrival & Gion District', activities: ['Land at KIX', 'Check-in ryokan', 'Evening walk in Gion'] },
    { day: 2, title: 'Temples & Tea', activities: ['Fushimi Inari sunrise', 'Nishiki Market lunch', 'Tea ceremony'] },
    { day: 3, title: 'Arashiyama', activities: ['Bamboo grove', 'Monkey park', 'River boat'] },
  ],
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showItinerary, setShowItinerary] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)

    // Mock AI response
    await new Promise(r => setTimeout(r, 1500))
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: "Perfect! I'm building your itinerary for Japan 🇯🇵 — 10 days, culture-focused, under $2,400. Give me a moment to search live flights and hotels…\n\nYour day-by-day plan is ready on the right ✦",
      chips: ['Looks great, book it!', 'Adjust the budget', 'Change dates', 'Add more cities'],
    }
    setMessages(m => [...m, aiMsg])
    setShowItinerary(true)
    setLoading(false)
  }

  return (
    <div className="flex h-dvh bg-ocean-900 overflow-hidden">

      {/* ── Left: Chat panel ── */}
      <div className="flex flex-col w-full md:w-1/2 border-r border-gold-subtle/30">

        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gold-subtle/30 bg-ocean-800/60 backdrop-blur-md flex-shrink-0">
          <button onClick={() => router.back()} className="text-slate-text hover:text-cream transition-colors md:hidden">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-glow flex-shrink-0">
            <Sparkles className="w-4.5 h-4.5 text-ocean-950" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-cream">WanderAI Planner</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] text-slate-text">AI online · Searching live deals</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
          {messages.map(msg => (
            <div key={msg.id} className={cn('flex flex-col gap-2', msg.role === 'user' ? 'items-end' : 'items-start')}>
              <div className={cn(
                'max-w-[85%] px-4 py-3 text-sm leading-relaxed',
                msg.role === 'assistant' ? 'chat-bubble-ai text-cream' : 'chat-bubble-user font-medium'
              )}>
                {msg.content}
              </div>
              {/* Chips */}
              {msg.chips && msg.role === 'assistant' && (
                <div className="flex flex-wrap gap-2 max-w-[90%]">
                  {msg.chips.map(chip => (
                    <button key={chip} onClick={() => sendMessage(chip)} className="chat-chip">
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2">
              <div className="chat-bubble-ai px-4 py-3">
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-text animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gold-subtle/30 bg-ocean-800/40 flex-shrink-0">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Type your trip idea…"
              className="input-ocean flex-1 rounded-2xl px-4 py-3 text-sm"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className={cn(
                'w-11 h-11 rounded-2xl flex items-center justify-center transition-all flex-shrink-0',
                input.trim() ? 'btn-gold shadow-gold-glow' : 'bg-ocean-700 text-slate-text cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Right: Live Itinerary panel (desktop) ── */}
      <div className="hidden md:flex flex-col w-1/2 overflow-hidden">
        {showItinerary ? (
          <div className="flex flex-col h-full">
            {/* Itinerary header */}
            <div className="px-6 py-4 border-b border-gold-subtle/30 bg-ocean-800/40 flex-shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-gold-500" />
                <h3 className="font-serif font-bold text-cream">{MOCK_ITINERARY.destination}</h3>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-text">
                <span>{MOCK_ITINERARY.dates}</span>
                <span>·</span>
                <span className="text-gold-500 font-semibold">{MOCK_ITINERARY.budget} total</span>
              </div>
            </div>

            {/* Day cards */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-hide">
              {MOCK_ITINERARY.days.map(day => (
                <div key={day.day} className="glass-card rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-gold-500/15 flex items-center justify-center">
                      <span className="text-gold-500 font-bold text-xs">{day.day}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-cream">{day.title}</h4>
                  </div>
                  <ul className="space-y-2">
                    {day.activities.map(a => (
                      <li key={a} className="flex items-center gap-2 text-xs text-slate-text">
                        <span className="w-1 h-1 rounded-full bg-gold-500/60 flex-shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Book CTA */}
              <button className="btn-gold w-full rounded-2xl py-4 text-sm flex items-center justify-center gap-2 mt-2">
                <Plane className="w-4 h-4" />
                Confirm & Book
              </button>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gold-500/8 border border-gold-500/15 flex items-center justify-center text-4xl">
              🗺️
            </div>
            <div>
              <h3 className="font-serif font-bold text-cream text-lg mb-2">Your itinerary builds here</h3>
              <p className="text-sm text-slate-text leading-relaxed">
                As you chat, your day-by-day trip plan, flights, and hotel options will appear live in this panel.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
