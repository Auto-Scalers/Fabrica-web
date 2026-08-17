# Fabrica-web — Tasks

> Single source of truth for all landing page / API route work. The Roadmap (`.Fabrica-Board/Fabrica-Roadmap.md`) tracks cross-cutting status only — this file owns execution details.

---

## Status Legend

- **VERIFY** — implemented, needs verification
- **VERIFY** — implemented and verified
- **PARTIAL** — partially implemented
- **TODO** — planned, not started
- **BLOCKED** — waiting on dependency

---

## API Routes (Vercel)

These endpoints serve the desktop app. The app already has client code pointing to them — we need to build the servers.

| # | Endpoint | Purpose | Status | Notes |
|---|----------|---------|--------|-------|
| W1 | `/api/auth/authorize` | OAuth authorize (PKCE) | **TODO** | Supabase auth |
| W2 | `/api/auth/session` | Session management | **TODO** | |
| W3 | `/api/auth/refresh` | Token refresh | **TODO** | |
| W4 | `/api/auth/logout` | Session destroy | **TODO** | |
| W5 | `/api/share/*` | Artifact sharing CRUD | **TODO** | Supabase Storage |
| W6 | `/api/diagnostics/*` | Crash/feedback upload | **TODO** | |
| W7 | `/api/telemetry` | Analytics events (fallback) | **TODO** | PostHog is primary |

---

## Static Files

| # | File | Purpose | Status | Notes |
|---|------|---------|--------|-------|
| W8 | `/whats-new/changelog.json` | In-app changelog display | **TODO** | |
| W9 | `/whats-new/nudge.json` | Update nudge config | **TODO** | |
| W10 | `/plugins/kill-list.json` | Plugin block list | **TODO** | |

---

## Docs Site

| # | Task | Status | Notes |
|---|------|--------|-------|
| W11 | `/docs/*` — documentation pages | **TODO** | Static/SSR. Migrate from `www.onorca.dev/docs` |

---

## Landing Page Updates

> **PLANNING MODE** — Plan and refine only. Do not execute code changes.

| # | Task | Status | Notes |
|---|------|--------|-------|
| W12 | Update any Orca references in page copy | **PLANNING** | Audit all sections |
| W13 | Update meta tags / OG images if needed | **PLANNING** | |

---

## Infrastructure Notes

**Supabase project:** `xoynlmscwkimaopkavkj.supabase.co` (shared with app)

| Table | Purpose |
|-------|---------|
| `auth.users` + `auth.sessions` | Desktop app OAuth login |
| `user_profiles` | Link Supabase auth to desktop app |
| `organizations` | Multi-org support |
| `artifacts` | Share URLs for files + Storage bucket |
| `diagnostics` | Crash reports + feedback |
| `early_access_signups` | Landing page signup (exists ✅) |

**Environment variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## What Needs Verification

- [~] Landing page deployed (`fabrica-ai.vercel.app`)
- [~] Early-access signup flow (`/api/early-access` → Supabase)
- [~] Dark theme + copper/amber palette
- [~] Vercel deployment pipeline

---

_Created: Aug 2026_
