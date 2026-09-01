-- Diagnostic uploads: short-lived tokens for the desktop app's two-step
-- crash-bundle upload flow. The desktop POSTs to /api/diagnostics/token to
-- get a token + upload_url, then POSTs the NDJSON bundle to the upload_url.
-- This table tracks the token and links it to the final diagnostics row.

CREATE TABLE IF NOT EXISTS public.diagnostic_uploads (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_submission_id  text NOT NULL,
  upload_token          text NOT NULL,
  max_bytes             integer NOT NULL DEFAULT 4194304,
  expires_at            timestamptz NOT NULL,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS diagnostic_uploads_token_idx
  ON public.diagnostic_uploads (upload_token);

CREATE INDEX IF NOT EXISTS diagnostic_uploads_expires_idx
  ON public.diagnostic_uploads (expires_at);
