-- Diagnostics table: stores crash reports and feedback from the desktop app.
-- Referenced by app/api/diagnostics/route.ts but was never migrated.

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
