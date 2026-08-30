-- Fabrica Supabase — NUCLEAR RESET
-- ================================================
-- This deletes EVERYTHING in the public schema.
-- Run this if you want to start completely fresh.
--
-- Go to: https://supabase.com/dashboard/project/xoynlmscwkimaopkavkj/sql/new

-- 1. Drop all policies
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- 2. Drop all tables (cascades to indexes, constraints, triggers)
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', r.tablename);
  END LOOP;
END $$;

-- 3. Drop all views
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN (SELECT viewname FROM pg_views WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP VIEW IF EXISTS public.%I CASCADE', r.viewname);
  END LOOP;
END $$;

-- 4. Drop all functions
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN (SELECT proname, oidvectortypes(proargtypes) AS args FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public') LOOP
    EXECUTE format('DROP FUNCTION IF EXISTS public.%I(%s) CASCADE', r.proname, r.args);
  END LOOP;
END $$;

-- 5. Drop all custom types
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN (SELECT typname FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid WHERE n.nspname = 'public' AND typtype = 'c') LOOP
    EXECUTE format('DROP TYPE IF EXISTS public.%I CASCADE', r.typname);
  END LOOP;
END $$;

-- 6. Drop all sequences
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN (SELECT sequencename FROM pg_sequences WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP SEQUENCE IF EXISTS public.%I CASCADE', r.sequencename);
  END LOOP;
END $$;

-- 7. Verify — should be empty
SELECT 'public schema is clean' AS status
WHERE NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public')
  AND NOT EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public')
  AND NOT EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public');
