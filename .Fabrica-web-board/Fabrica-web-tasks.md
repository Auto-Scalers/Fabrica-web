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
| W1 | `/api/auth/authorize` | OAuth authorize (PKCE) | **VERIFY** | Supabase auth |
| W2 | `/api/auth/session` | Session management | **VERIFY** | |
| W3 | `/api/auth/refresh` | Token refresh | **VERIFY** | |
| W4 | `/api/auth/logout` | Session destroy | **VERIFY** | |
| W5 | `/api/share/*` | Artifact sharing CRUD | **VERIFY** | Supabase Storage |
| W6 | `/api/diagnostics/*` | Crash/feedback upload | **VERIFY** | |
| W7 | `/api/telemetry` | Analytics events (fallback) | **VERIFY** | PostHog is primary |

---

## Static Files

| # | File | Purpose | Status | Notes |
|---|------|---------|--------|-------|
| W8 | `/whats-new/changelog.json` | In-app changelog display | **VERIFY** | Created in public/whats-new/ |
| W9 | `/whats-new/nudge.json` | Update nudge config | **VERIFY** | Created in public/whats-new/ |
| W10 | `/plugins/kill-list.json` | Plugin block list | **VERIFY** | Created in public/plugins/ |

---

## Docs Site

| # | Task | Status | Notes |
|---|------|--------|-------|
| W11 | `/docs/*` — documentation pages | **DONE** | Created layout, catch-all page, sidebar, prose, content, nav. Build compiles. Zero orca/stablyai refs. |

---

## Landing Page Updates

> **PLANNING MODE** — Plan and refine only. Do not execute code changes.

| # | Task | Status | Notes |
|---|------|--------|-------|
| W12 | Update any Orca references in page copy | **DONE** | Audit complete: 3 refs in public/ (historical changelog + kill-list plugin). Not page copy. No changes needed. |
| W13 | Update meta tags / OG images if needed | **DONE** | Audit complete: all OG/Twitter/meta tags already say Fabrica with correct URLs. No changes needed. |

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

## Session Ledger

> Tracks orchestration sessions and workers for this task file. Updated when sessions are created, released, or worktrees merged.

| Session Handle | Type | Task/Group | Status | Created | Worktree Branch | Merged |
|---------------|------|-----------|--------|---------|----------------|--------|
| `term_0adb1b43-ceeb-47c7-ad47-f65f6df17d3e` | orchestrator | web-orchestrator | **active** | Aug 2026 | `main` (Fabrica-web/) | — |
| `ctx_3325b3345a41` | worker | W12 Orca copy audit | **active** | Aug 2026 | `web-W12-audit` | — |
| `ctx_00d2c7b7121a` | worker | W13 meta/OG rebrand | **active** | Aug 2026 | `web-W13-meta` | — |

**Rules:**
- Only the main orchestrator creates sessions in this ledger
- Workers are released after review
- Worktrees are merged immediately after approval
- Never leave orphaned sessions

---

_Created: Aug 2026_
