# Supabase Setup

## What you need to do

1. Go to https://supabase.com/dashboard/project/xoynlmscwkimaopkavkj/sql/new
2. Paste the contents of these files one after another, in order:
   - `migrations/0002_diagnostics.sql`
   - `migrations/0003_fabrica_pair_invites.sql`
   - `migrations/0004_drop_dead_tables.sql`
3. Click **Run** after each one (or paste all three and run once — they're idempotent with `IF NOT EXISTS`)

## Migrations

| File | Status | Purpose |
|------|--------|---------|
| `migrations/0001_fabrica_artifacts.sql` | ✅ Already applied | Artifact storage |
| `migrations/0002_diagnostics.sql` | ⏳ Needs apply | Crash reports + feedback |
| `migrations/0003_fabrica_pair_invites.sql` | ⏳ Needs apply | Phone-desktop pairing |
| `migrations/0004_drop_dead_tables.sql` | ⏳ Needs apply | Drops dead `early_access_signups` |

## Final schema (3 tables)

| Table | Purpose | RLS |
|-------|---------|-----|
| `fabrica_artifacts` | Publishable HTML/Markdown docs with share URLs | owner read/insert/update/delete |
| `diagnostics` | Crash reports + feedback from desktop | owner read/insert |
| `fabrica_pair_invites` | Phone-desktop pairing invite tokens | owner read/insert/delete |

## Auth: email confirmation

**Supabase Dashboard → Authentication → Providers → Email → toggle OFF "Confirm email"**

Without this, email sign-in fails because the user must confirm their email before signing in.
