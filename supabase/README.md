# Supabase Setup

## What you need to do

1. Go to https://supabase.com/dashboard/project/xoynlmscwkimaopkavkj/sql/new
2. Paste the entire contents of `APPLY_THIS.sql`
3. Click **Run**

This creates:
- `diagnostics` table (for crash/feedback from desktop app)
- `fabrica_pair_invites` table (for phone-desktop pairing)
- Drops dead `early_access_signups` table

## What was already done in code

- Deleted dead routes: `/api/share/*`, `/api/telemetry`
- Updated `Database` type in `lib/supabase.ts` to match real tables
- Created migration files in `migrations/`:
  - `0001_fabrica_artifacts.sql` (already applied — table exists)
  - `0002_diagnostics.sql`
  - `0003_fabrica_pair_invites.sql`
  - `0004_drop_dead_tables.sql`

## Final schema (3 tables)

| Table | Purpose | RLS |
|-------|---------|-----|
| `fabrica_artifacts` | Publishable HTML/Markdown docs with share URLs | owner read/insert/update/delete |
| `diagnostics` | Crash reports + feedback from desktop | owner read/insert |
| `fabrica_pair_invites` | Phone-desktop pairing invite tokens | owner read/insert/delete |

## Auth: email confirmation

**Supabase Dashboard → Authentication → Providers → Email → toggle OFF "Confirm email"**

Without this, email sign-in fails because the user must confirm their email before signing in.
