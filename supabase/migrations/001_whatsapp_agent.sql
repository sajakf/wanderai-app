-- ─────────────────────────────────────────────────────────────────────────────
-- WanderAI WhatsApp Agent — Database Schema
-- Run this in Supabase SQL Editor (dashboard.supabase.com → SQL Editor)
-- ─────────────────────────────────────────────────────────────────────────────

-- Conversations: one row per phone number, holds state + language preference
CREATE TABLE IF NOT EXISTS wa_conversations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number     TEXT UNIQUE NOT NULL,   -- e.g. "whatsapp:+96512345678"
  display_name     TEXT,                   -- WhatsApp profile name
  language         TEXT DEFAULT 'en',      -- 'en' | 'ar'
  state            JSONB DEFAULT '{}',     -- active search state (dates, dest, pax)
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Messages: full conversation history fed to Claude each turn
CREATE TABLE IF NOT EXISTS wa_messages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  UUID NOT NULL REFERENCES wa_conversations(id) ON DELETE CASCADE,
  role             TEXT NOT NULL CHECK (role IN ('user','assistant','tool')),
  content          TEXT,                   -- text content
  tool_calls       JSONB,                  -- when role=assistant and tools were called
  tool_call_id     TEXT,                   -- when role=tool, matches the call id
  tool_name        TEXT,                   -- tool that was called
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings: every confirmed or pending booking
CREATE TABLE IF NOT EXISTS wa_bookings (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id      UUID REFERENCES wa_conversations(id),
  type                 TEXT NOT NULL CHECK (type IN ('flight','hotel','experience','transfer')),
  status               TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','failed')),
  provider             TEXT,               -- 'duffel' | 'bookingcom' | 'viator'
  provider_booking_id  TEXT,
  details              JSONB NOT NULL,     -- full offer snapshot
  total_usd            NUMERIC(10,2),
  total_kwd            NUMERIC(10,3),
  traveler_details     JSONB,              -- name, passport, DOB etc.
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_wa_messages_conv
  ON wa_messages(conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_wa_bookings_conv
  ON wa_bookings(conversation_id);

CREATE INDEX IF NOT EXISTS idx_wa_conv_phone
  ON wa_conversations(phone_number);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE OR REPLACE TRIGGER wa_conversations_updated
  BEFORE UPDATE ON wa_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER wa_bookings_updated
  BEFORE UPDATE ON wa_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security (allow service role full access)
ALTER TABLE wa_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_bookings      ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON wa_conversations FOR ALL USING (true);
CREATE POLICY "service_role_all" ON wa_messages      FOR ALL USING (true);
CREATE POLICY "service_role_all" ON wa_bookings      FOR ALL USING (true);
