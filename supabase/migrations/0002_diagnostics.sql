-- Diagnostics table: stores crash reports and feedback from the desktop app.
-- Referenced by app/v1/feedback/route.ts.
-- user_id is TEXT (not uuid) because /v1/feedback accepts anonymous
-- submissions identified by github login string, not Supabase auth UUIDs.

CREATE TABLE IF NOT EXISTS public.diagnostics (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     text NOT NULL DEFAULT 'anonymous',
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
