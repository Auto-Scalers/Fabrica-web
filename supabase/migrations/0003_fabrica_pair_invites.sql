-- Pair invites table: stores desktop pairing invite tokens.
-- Referenced by app/v1/desktop/auth/invites/route.ts but was never migrated.
-- The desktop app pushes invites here; the web login panel reads them.

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
