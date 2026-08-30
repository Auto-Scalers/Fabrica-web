-- Fabrica Supabase Migration — Clean schema (run once)
-- ================================================
-- Paste this entire file into Supabase Dashboard → SQL Editor → New Query → Run
-- https://supabase.com/dashboard/project/xoynlmscwkimaopkavkj/sql/new

-- 0001: fabrica_artifacts (already exists from prior migration — skipping)

-- 0002: diagnostics
CREATE TABLE IF NOT EXISTS public.diagnostics (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        text NOT NULL CHECK (type IN ('crash', 'feedback')),
  app_version text NOT NULL,
  os          text NOT NULL,
  error       text,
  stack       text,
  message     text,
  screenshot  text,
  metadata    jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS diagnostics_user_id_idx
  ON public.diagnostics (user_id, created_at DESC);

ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner read" ON public.diagnostics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "owner insert" ON public.diagnostics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 0003: fabrica_pair_invites
CREATE TABLE IF NOT EXISTS public.fabrica_pair_invites (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  relay_host_id   text NOT NULL,
  relay_device_id text NOT NULL DEFAULT '',
  invite_token    text NOT NULL,
  max_attempts    integer NOT NULL DEFAULT 16,
  created_at      timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS fabrica_pair_invites_user_host_idx
  ON public.fabrica_pair_invites (user_id, relay_host_id, created_at DESC);

ALTER TABLE public.fabrica_pair_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner read" ON public.fabrica_pair_invites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "owner insert" ON public.fabrica_pair_invites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "owner delete" ON public.fabrica_pair_invites
  FOR DELETE USING (auth.uid() = user_id);

-- 0004: drop dead tables
DROP TABLE IF EXISTS public.early_access_signups;
