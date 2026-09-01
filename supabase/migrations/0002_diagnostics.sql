-- Diagnostics table: stores crash reports from the desktop app's two-step
-- bundle upload flow (see app/api/diagnostics/token + upload routes).
-- user_id is TEXT (not uuid) because the upload flow identifies submissions
-- by bundle_submission_id, not Supabase auth UUIDs.

CREATE TABLE IF NOT EXISTS public.diagnostics (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     text NOT NULL DEFAULT 'anonymous',
  type        text NOT NULL DEFAULT 'crash',
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
