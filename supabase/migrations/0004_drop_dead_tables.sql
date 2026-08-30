-- Drop dead tables that are no longer referenced by any code.

-- early_access_signups: typed in lib/supabase.ts but no route reads/writes it.
-- Contains 2 test signups from Aug 2026 — safe to drop.
DROP TABLE IF EXISTS public.early_access_signups;
