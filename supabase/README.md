# Supabase Setup

## What you need to do

1. Go to https://supabase.com/dashboard/project/xoynlmscwkimaopkavkj/sql/new
2. Paste the contents of these files one after another, in order:
   - `migrations/0002_diagnostics.sql`
   - `migrations/0003_diagnostic_uploads.sql`
3. Click **Run** after each one (or paste both and run once — they're idempotent with `IF NOT EXISTS`)

## Migrations

| File | Status | Purpose |
|------|--------|---------|
| `migrations/0001_fabrica_artifacts.sql` | ✅ Already applied | Artifact storage |
| `migrations/0002_diagnostics.sql` | ⏳ Needs apply | Crash reports + feedback |
| `migrations/0003_diagnostic_uploads.sql` | ⏳ Needs apply | Token-based bundle upload flow |

## Final schema (3 tables)

| Table | Purpose | RLS |
|-------|---------|-----|
| `fabrica_artifacts` | Publishable HTML/Markdown docs with share URLs | owner read/insert/update/delete |
| `diagnostics` | Crash reports + feedback from desktop | none (admin client only) |
| `diagnostic_uploads` | Short-lived tokens for two-step bundle upload | none (admin client only) |

## Auth: email confirmation

**Supabase Dashboard → Authentication → Providers → Email → toggle OFF "Confirm email"**

Without this, email sign-in fails because the user must confirm their email before signing in.
