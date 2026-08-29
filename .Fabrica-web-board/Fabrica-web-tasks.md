# Fabrica-web — Tasks

> Single source of truth for all landing page / API route work. The Roadmap (`.Fabrica-board/Fabrica-Roadmap.md`) tracks cross-cutting status only — this file owns execution details. Schema: `.Fabrica-board/Fabrica-Schema.md`.

## High-Level Goals

> WHAT THIS PROJECT IS FOR — read this before any task:

1. **A launch-grade landing page.** Every word traceable to the 3 internal marketing files; honest claims only; flawless on mobile; en/fr/ar in perfect parity.
2. **Working backend endpoints.** Auth/share/diagnostics/telemetry routes live and matching what the desktop client expects (lockstep with Fabrica-app).
3. **Beta-launch ready.** Live deployment verified (fabrica-ai.vercel.app), signup flow working, static JSON contracts (changelog/nudge/kill-list) served correctly — gate for Roadmap Phase B.

---

## Rollup

| Metric | Value |
|---|---|
| Total tasks | 38 |
| ✅ DONE | 38 |
| 🔶 IN_PROGRESS | 0 |
| ✅ DONE | 0 |
| ⬜ TODO | 0 |
| 🚫 BLOCKED | 0 |
| ❌ CANCELLED | 0 |
| Completion | 100% |

_Last recount: 2026-08-29 (ALL 5 Phase 8 tasks DONE + MERGED into Fabrica-web main. Build clean: /[locale]/login, /whats-new, /download, /dashboard all registered. Conflict resolution: navbar.tsx W33+W37 combined; dashboard.tsx took W36 rebuild + re-applied W35 /login re-auth link; messages/*.json kept 4-platform list + all namespaces.)_

## Parallelism & Anti-Overlap Policy

> This project runs REAL 24/7 multi-terminal orchestration. Parallelism is the
> default: unlimited tokens, multi-terminal app, massive project, close deadline.

- **Minimum fleet:** the orchestrator keeps AT LEAST 3 active worker terminals at
  all times. Fewer than 3 on resume or cycle end => launching more comes FIRST,
  chosen from the highest-priority TODO/VERIFY tasks in this file, focused on
  high-level goals and principles, not micro-edits.
- **One task = one worker:** claim a task by setting its status IN_PROGRESS and
  recording your terminal handle in the Session Ledger BEFORE starting. Claimed
  tasks are forbidden to everyone else.
- **One folder = one orchestrator:** never work another slot's folder.
- **One file = one writer:** two live workers never edit the same file; such tasks
  run sequentially.
- **Claim-before-work:** confirm your Task ID is still unclaimed before executing;
  if done or claimed, stop and report instead of duplicating.
- **Cross-project dependencies:** record them as notes in the OTHER project's task
  file; never edit another project directly.
- **Quality bar unchanged under deadline pressure:** no DONE without verified
  evidence; status change and Rollup update happen in the same edit.

---

## Status Legend

| Status | Meaning |
|---|---|
| `TODO` ⬜ | Not started |
| `IN_PROGRESS` 🔶 | Started, partially done |
| `VERIFY` 👀 | Implemented, awaiting orchestrator review |
| `DONE` ✅ | Implemented and verified |
| `BLOCKED` 🚫 | Waiting on dependency/decision |
| `CANCELLED` ❌ | Dropped |

_Legacy mapping applied in migration: `IN PROGRESS→IN_PROGRESS`, `[~]→VERIFY`. No outcome changed._

---

## API Routes (Vercel)

> WHAT THIS GROUP DOES: server endpoints for the desktop app. The app already has client code pointing to them.
> WHAT THIS GROUP DOES NOT DO: desktop-side client code (owned by Fabrica-app).

> **LIVE-VERIFY-2 2026-08-24 (after PM added `NEXT_PUBLIC_SUPABASE_ANON_KEY` + redeploy):** auth env config FIXED — authorize now returns Supabase OAuth URL (200), logout returns {"success":true} (200), session correct 401 JSON. Residual minor bug on WEB-W3 only. First-pass report: opencode temp/liveverify-report-task_e72cda1d36e9.md

| # | Task | Status | Notes |
|---|------|--------|-------|
| WEB-W1 | `/api/auth/authorize` — OAuth authorize (PKCE) | ✅ DONE | Live PASS: 200, returns GitHub OAuth URL with redirect_to=/api/auth/callback |
| WEB-W2 | `/api/auth/session` — Session management | ✅ DONE | Live PASS: unauth returns {"authenticated":false} correctly |
| WEB-W3 | `/api/auth/refresh` — Token refresh | ✅ DONE | Orchestrator-verified diff (+8/-2): req.json() wrapped in try/catch → 400 "Invalid JSON body"; refresh_token type-checked; happy path unchanged. Build clean, zero new lint findings. Deploys on next push |
| WEB-W4 | `/api/auth/logout` — Session destroy | ✅ DONE | Live PASS: {"success":true} |
| WEB-W5 | `/api/share/*` — Artifact sharing CRUD | ✅ DONE | Live PASS: GET list + GET [id] both 401 Unauthorized as expected |
| WEB-W6 | `/api/diagnostics/*` — Crash/feedback upload | ✅ DONE | Live PASS: GET + POST both 401 auth-gated |
| WEB-W7 | `/api/telemetry` — Analytics events (fallback) | ✅ DONE | Live PASS: POST-only confirmed via GET 405 |

---

## Static Files

| # | Task | Status | Notes |
|---|------|--------|-------|
| WEB-W8 | `/whats-new/changelog.json` — In-app changelog display | ✅ DONE | Live 200, valid shape. Local W32 rebrand-prose fix landed; deploys on next push |
| WEB-W9 | `/whats-new/nudge.json` — Update nudge config | ✅ DONE | Live 200 (old schema). Local W30 schema fix `{id,minVersion,maxVersion}` landed; deploys on next push |
| WEB-W10 | `/plugins/kill-list.json` — Plugin block list | ✅ DONE | Live PASS: {version:1, generatedAt, plugins:[]} expected shape |

---

## PM Decision Fixes (from Fabrica-app)

> Cross-project tasks added by orchestrator. These fix issues identified in PM decisions D7 and D8.

| # | Task | Status | Notes |
|---|------|--------|-------|
| WEB-W30 | Fix nudge.json schema — current `{enabled, channel, minimumVersion, message}` doesn't match app contract `{id, minVersion, maxVersion}`. App returns null (dead code). | ✅ DONE | Orchestrator-verified: `public/whats-new/nudge.json` now `{id: "update-1.4.0", minVersion: "1.4.0", maxVersion: "2.0.0"}`; matches `updater-nudge.ts` contract exactly (id non-empty trim check, version bounds present + valid). Old dead fields removed. Worker `term_61d57f10`. |
| WEB-W32 | Reword old-brand prose in changelog.json — live entry contains 'Orca is now Fabrica - a full rebrand...' rendered in app What's New screen. Prose-only reword, JSON structure unchanged. | ✅ DONE | Orchestrator-verified: grep `[Oo]rca` in `public/whats-new/changelog.json` returns zero hits; JSON keys/versions preserved, node parse validated by worker. Entry now leads with "Fabrica is here...". Worker `term_b26beadf`. |

---

## Docs Site

| # | Task | Status | Notes |
|---|------|--------|-------|
| WEB-W11 | `/docs/*` — documentation pages | ✅ DONE | Created layout, catch-all page, sidebar, prose, content, nav. Build compiles. Zero orca/stablyai refs. |

---

## Landing Page Updates

> WHAT THIS GROUP DOES: plan and refine page copy/meta/pricing.
> WHAT THIS GROUP DOES NOT DO: execute unplanned code changes.

| # | Task | Status | Notes |
|---|------|--------|-------|
| WEB-W12 | Update any Orca references in page copy | ✅ DONE | Audit complete: 3 refs in public/ (historical changelog + kill-list plugin). Not page copy. No changes needed. |
| WEB-W13 | Update meta tags / OG images if needed | ✅ DONE | Audit complete: all OG/Twitter/meta tags already say Fabrica with correct URLs. No changes needed. |
| WEB-W13b | Update pricing tiers in landing page | ✅ DONE | Tiers renamed: Power User, One-Person Company, Agency & Teams. All CTAs say "Start 14-Day Free Trial". Updated en.json, fr.json, ar.json. Prices remain placeholders ($29/$79/$199). |

---

## Phase 6 — Landing Page Enhancement

> **CRITICAL:** Every element of the landing page must be derived from the 3 internal marketing files. Read each file line by line, word by word. No copy should exist that doesn't align with these files.
>
> **Source files (read all 3 before writing any copy):**
> - `Fabrica-marketing/internal/brand/brand-guidelines.md` — voice, tone, visual identity, word bank, blacklist, correct/incorrect usage examples
> - `Fabrica-marketing/internal/brand/positioning-statement.md` — positioning, key differentiators, messaging hierarchy, proof points
> - `Fabrica-marketing/internal/research/competitor-landscape.md` — competitor insights, positioning opportunities, market gaps, Fabrica response to each competitor
>
> WHAT THIS GROUP DOES: visual assets, full copy rewrite grounded in internal docs, localization quality, mobile responsiveness.
> WHAT THIS GROUP DOES NOT DO: invent copy not traceable to the 3 source files.

| # | Task | Status | Notes |
|---|------|--------|-------|
| WEB-W14 | Replace carousel images with new assets from `public/images/` | ✅ DONE | Updated ShowcaseCarousel.tsx with correct image paths (carousel-00 through carousel-10). Fixed aspect ratio to 16/9, switched to object-contain for full images. |
| WEB-W15 | Add standalone images with text overlays from `public/images/standalones/` | ✅ DONE | All 5 standalone images added: pain-exhausted-developer (PainSection), social-parallel-agents (TurnSection), social-approval-gate (ControlSection), mobile-companion-remote (OrchestrationSection), hands-on-architecture (FeatureSection). All use object-contain. |
| WEB-W16 | Apply `fabrica-buttom-bg` as background to bottom section | ✅ DONE | Added fabrica-buttom-bg.png background to FinalCta.tsx following Hero.tsx pattern (absolute inset, backgroundSize 100% auto, bg-white/20 dark overlay). |
| WEB-W17 | Rewrite ALL landing page copy using the 3 marketing internal files | ✅ DONE | Full rewrite of en.json using brand-guidelines.md, positioning-statement.md, and competitor-landscape.md. All sections grounded in source docs. Blacklisted terms removed. |
| WEB-W18 | French & Arabic localization quality pass | ✅ DONE | fr.json and ar.json fully updated to match new en.json. Natural phrasing, brand voice preserved. All sections aligned. |
| WEB-W19 | Mobile responsiveness audit — verify all new sections | ✅ DONE | Orchestrator-verified diff. Fixes: (1) touch targets — carousel dot hit-areas 32px, Hero toggles min-h-36px, navbar drawer links py-2 + locale switcher px-3 py-2; (2) RTL/ar.json — left/right → start/end + pl/pr → ps/pe in FinalCta, Carousel arrows, Hero pillar grid (layout sets dir=rtl); (3) object-cover for mismatched-aspect images (pain-exhausted-developer, hands-on-architecture, mobile-companion-remote), social-approval-gate kept object-contain intentionally; (4) overflow verified contained at 360px. Build clean (35.9s, TS ✓, 15/15 pages); lint = 51 pre-existing only |

**Rules for WEB-W17:**
1. Read `brand/brand-guidelines.md` — adopt the voice, use the word bank, respect the blacklist
2. Read `brand/positioning-statement.md` — use the positioning statement, key differentiators, and messaging hierarchy verbatim where appropriate
3. Read `research/competitor-landscape.md` — use competitor insights, proof points, and Fabrica responses for the "Why Fabrica" section
4. Every section of the landing page must trace back to one of these 3 files
5. No generic marketing copy — everything must be grounded in the internal docs

### Phase 6b — PM Review Feedback (Aug 2026)

> Feedback from PM visual review of the landing page. Execute after W14-W19.

| # | Task | Status | Notes |
|---|------|--------|-------|
| WEB-W20 | Top background: darken text in light theme | ✅ DONE | Light-theme text contrast adjusted; hero headline sizes tuned per PM follow-up in-session |
| WEB-W21 | Audit: all carousel + standalone images present? | ✅ DONE | Carousel: all 11 images now shown as slides s1-s11 (en/fr/ar). Standalones: all 5 visible on page load — mobile-companion image promoted out of hidden tab into always-visible block |
| WEB-W22 | Standalone images: side-by-side layout with relevant text | ✅ DONE | All 5 standalones in half-width two-column layouts with strictly matching text, stacked on mobile |
| WEB-W23 | Bottom background: add blur + strengthen overlay | ✅ DONE | Per PM follow-up in-session: removed blur layers that softened FinalCta text, content pinned to top with z-10, scrim tuned |
| WEB-W24 | Deduplicate content across all sections | ✅ DONE | 23 strings deduped across en/fr/ar. Worktrees star = features/orchestration/faq; budget star = control.card3; approval gates star = control; BYOK star = integrations/control.card2; cta.paragraph rewritten. 702 keys per locale, build passes |
| WEB-W25 | Coverage audit vs internal marketing files | ✅ DONE | Report delivered: W25-coverage-audit.md (33KB). PM reviewed and approved ALL recommendations → split into WEB-W27 (P1) and WEB-W28 (P2+P3) |
| WEB-W26 | Top navigation bar: align with page sections | ✅ DONE | Closeout by `term_b468e39b` (run_31a1a28a59a3) after reclaim; W29's C1 pass verified rather than redone. Findings: (1) all 7 navbar hrefs (#product #crew #how-it-works #controls #comparison #pricing #faq + /docs) match rendered section ids in components/Blocks + page.tsx; (2) zero duplicate ids — legacy `command-center` survives only as a unique inner div (Hero.tsx:318, scroll-mt-24) targeted by Hero CTA + 2 footer links; (3) scroll-mt present on every nav-targeted section after fix: added missing scroll-mt-20 to Hero id="product" (crew/how-it-works/controls/comparison/pricing/faq already had it via W29; waitlist has scroll-mt-16); (4) ScrollSpy SECTION_IDS (components/scroll-spy.tsx) all resolve to live DOM nodes; hash-sync via IntersectionObserver works. Evidence: npm run build ✓ clean (Next 16.3.1, compiled 37s, TS ✓, 15/15 pages). npm run lint: 45 pre-existing errors (unescaped entities in docs-content/OrchestrationSection/Hero, `<a>` vs Link in docs-content, require() in scripts/, any in request.ts) — all out of W26 scope, none introduced by this change (git diff confirms only Hero.tsx touched) |
| WEB-W27 | P1 honesty fixes from W25 audit | ✅ DONE | Testimonials section removed (page.tsx + component deleted; JSON keys kept for future real quotes). $149/mo → "current tier" (incl. Hero.tsx fallback log). Free tier → 14-day trial. Unlimited crews → tier-based. 3.5 hrs/day → illustrative. Build passes |
| WEB-W28 | P2+P3 content additions from W25 audit | ✅ DONE | 6/7 landed by term_4bc0bb56 before terminal death; ADD5 (non-tech pain beat p4) completed by WEB-W29. Verified: n8n card, roadmap+vault copy, adaptive UI pillar, hero audience+control promise, spend scoping, CrewSection fix |
| WEB-W29 | W25 audit leftovers + W26 nav + W28 completion — final sweep | ✅ DONE | A1: p4 pain (non-technical operator → plain-language direction, en/fr/ar + PainSection card). B1: platformSetup → "Bring your own CLI agents and keys". B2: faq q9/a9 spend-tracking qualifier. B3: brand promise in turn.promise. B4: tagline clarifier under hero badge. B5: comparison columns → Cloud Autonomous Agents / AI Code Editors with category-honest cells. B6: kanban k3/k5/k7 + eisenhower t1/t2/t6 as founder outcomes. B7: kill-switch circuit-breaker sentence in control.card3.desc. B8: team.tagline = per-client budget partitioning. B9: triad in hero.triad (once site-wide). C1: OrchestrationSection id command-center→how-it-works (dup ID resolved), nav+scroll-spy updated, scroll-mt-20 added to crew/how-it-works/controls/comparison/pricing/faq. Locale parity 716/716/716 verified by node script; grep confirms "Zero Technical Setup" gone from shipped copy; npm run build passes |

---

## Phase 7 — CTA → Download / Sign-in + Dashboard (WEB-CTA)

> Replace the email-capture "Get Early Access" CTA with two actions (Download + Sign in); add a /download installer page and an authenticated /dashboard; wire the OAuth browser flow to land on /dashboard. Cross-project note: G4-ENV worker only sets Vercel env (no source edits) — no conflict.

| # | Task | Status | Notes |
|---|------|--------|-------|
| WEB-CTA | FinalCta: two buttons — Download (primary ShimmerButton → /download via router.push) and Sign in (secondary → /api/auth/authorize browser OAuth); new `app/[locale]/download/page.tsx` (Server Component) lists Windows/macOS/Linux/Android installers linking to GitHub Releases; new `app/[locale]/dashboard/page.tsx` (client) reads token hash, shows profile/orgs/capabilities/recent artifacts/relay; `GET /api/auth/authorize` returns 302 to OAuth URL; callback redirects to /dashboard (tokens in hash); removed orphaned `/api/early-access` route + fetches; i18n cta.getEarlyAccess→download+signIn, added `download`+`dashboard` namespaces (en/fr/ar parity) | ✅ DONE | Worker `term_9f2c4a17` (self-assigned). Build clean: Next 16.3.1, TS ✓, 17/17 pages, `/[locale]/download` + `/[locale]/dashboard` present. Lint: 0 NEW errors (46 pre-existing out of scope — docs-content unescaped entities, `require()` in scripts, `any` in request.ts, `no-html-link` in `/docs`). No Orca/Stably branding. |

---

## Phase 8 — Top-Bar Nav + Download / Auth / Dashboard Enhancements (WEB-UX2)

> Follow-up to Phase 7 (WEB-CTA). WEB-CTA replaced the **bottom** FinalCta email-capture with Download + Sign in buttons and shipped the `/download` + `/dashboard` pages. This phase targets the **top navigation bar** (still showing the old "Get Early Access" button) and meaningfully enhances the three pages WEB-CTA created as minimal scaffolds.
>
> WHAT THIS GROUP DOES: top-bar nav buttons, richer installer page, polished login/signup → dashboard handoff, and a higher-fidelity authenticated dashboard workspace.
> WHAT THIS GROUP DOES NOT DO: re-place the bottom FinalCta (already DONE in WEB-CTA); change API auth contracts (those live in API Routes + Fabrica-app lockstep).

| # | Task | Status | Notes |
|---|------|--------|-------|
| WEB-W33 | Top-bar nav: replace "Get Early Access" button with two actions — **Download** (primary, → /download) and **Sign in / Dashboard** (secondary, → /api/auth/authorize for OAuth; or → /dashboard if already authed). Apply to desktop nav + mobile drawer nav. Keep i18n parity (en/fr/ar) — add `nav.download` + `nav.signIn` / `nav.dashboard` keys; remove/replace `nav.getEarlyAccess`. Honor existing navbar Strikingly/ShimmerButton styling + dark theme/copper palette. | ✅ DONE | Orchestrator-verified: grep confirms `Get Early Access`/`getEarlyAccess` gone from navbar + i18n; navbar.tsx has Download (→/download) + Sign in (→/api/auth/authorize, →/dashboard if authed) buttons (desktop + mobile drawer); nav.download/signIn/dashboard added en/fr/ar; no orca/stablyai branding. Worker `term_f886d746` (ctx_d6358586dd8a). Build claimed clean. MERGE NOTE: shares `components/navbar.tsx` with WEB-W37 (which removed #pricing link). |
| WEB-W34 | Enhance the `/download` installer page — go beyond a bare list of GitHub Release links. Add: platform detection (auto-highlight the user's OS), prominent primary download CTA per platform (Windows .exe / macOS .dmg / Linux .AppImage / Android .apk), copy for what Fabrica is + "free to start", secondary links (release notes → /whats-new, GitHub Releases, checksums/verify), mobile-companion note (phone↔desktop relay), and i18n parity. Server Component for static parts; client island for OS detection. Keep brand voice grounded in the 3 internal marketing files. | ✅ DONE | Orchestrator-verified: `components/download/OsPlatformGrid.tsx` exists; download/page.tsx imports it + links /whats-new; no orca/stablyai branding; added /whats-new release-notes page + download/whatsNew i18n. Worker `term_a6263719` (ctx_b8c713eb7a4b). Build + lint-on-changed claimed clean. MERGE NOTE: edits messages/*.json (download namespace) — same files as W33/W35/W36; merge sequentially, resolve complementary key additions. |
| WEB-W35 | Enhance login / sign-up → dashboard flow. The OAuth browser flow already lands on /dashboard (WEB-CTA). Enhance: a branded `/login` (or sign-in) entry that explains "Sign in with GitHub to access your Fabrica dashboard", handles the returning-from-OAuth hash, shows loading/error states, and a clear "New here? Download the app" path. Add sign-up framing (account created via GitHub OAuth; link to download). Ensure token-hash parsing, session state, and redirect-to-/dashboard are robust and mobile-friendly. i18n parity for all new copy. | ✅ DONE | Orchestrator-verified: `app/[locale]/login/page.tsx` exists; no orca/stablyai branding; login i18n namespace added en/fr/ar (line ~789). Worker `term_7295705a` (ctx_a2fbde7c5934). Build + lint claimed clean. NOTE: also edited `app/[locale]/dashboard/page.tsx` (CTA→/login) + `components/Blocks/FinalCta.tsx` + callback/authorize routes — overlaps `dashboard/page.tsx` with WEB-W36 (full rebuild). Resolve at merge. |
| WEB-W36 | Enhance the authenticated `/dashboard` workspace. Current scaffold (WEB-CTA) shows profile/orgs/capabilities/recent artifacts/relay. Elevate to a real workspace: clearer empty states, "Connect your desktop app" / relay-pairing CTA, recent artifacts grid with share links, org switcher, usage/capabilities panel, quick actions (Download app, Open docs, Invite), and responsive layout. Keep the token-hash read + Supabase session logic; improve UX, loading/error/empty states, and i18n parity. | ✅ DONE | Orchestrator-verified: no orca/stablyai branding; dashboard rebuilt (33 new dashboard i18n keys en/fr/ar parity). Worker `term_6f707b1d` (ctx_6300ab36aaf2). Build + lint claimed clean. MERGE NOTE: full rewrite of `app/[locale]/dashboard/page.tsx` — SAME file WEB-W35 edited (CTA→/login). Take W36 as authoritative dashboard, then re-apply W35's /login routing intent onto it. |
| WEB-W37 | Hide the pricing section from the landing page — Fabrica is going free for now. Remove/hide the pricing block (and its nav link `#pricing` in the top bar) without deleting the underlying component or copy (keep for later re-enable). Ensure no dead anchor references remain (nav + footer + scroll-spy SECTION_IDS). Keep i18n keys intact. Re-verify build + scroll anchors. | ✅ DONE | Orchestrator-verified: grep `#pricing` in .tsx = 0 hits; `PricingSection` only its own component file (import/render removed from page.tsx); no orca/stablyai branding. Worker `term_bda12904` (ctx_8d27b23ead49). Build claimed clean. MERGE NOTE: also edited `components/navbar.tsx` (removed #pricing link) — same file as WEB-W33; merge W33 first, then rebase W37 onto it. |

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

### G4-ENV — Vercel env (2026-08-28)

> **STATUS: NOT APPLIED — BLOCKED by Vercel CLI auth.** `vercel whoami` failed
> (worker timeout / EPIPE); `VERCEL_TOKEN` unset; `vercel login` non-interactive.
> The PM must set these manually in the Vercel dashboard → project `fabrica-ai`,
> target **Production** (and Preview/Development if needed).

**Required env vars (exact names the new `/api/v1/desktop/*` + `/api/v1/artifacts/*` routes read):**

| Env var | Source / reader | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase-auth.ts`, `lib/supabase.ts`, session/authorize routes | Supabase project URL. Falls back to `SUPABASE_URL`. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase-auth.ts`, admin fallback | Anon key. Falls back to `SUPABASE_ANON_KEY`. |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase.ts:58` `getSupabaseAdmin()` | **Mandatory** for `/api/v1/artifacts` GET/POST (`route.ts:25,86`). |
| `FABRICA_RELAY_JWT_SECRET` | `app/api/v1/desktop/auth/relay-token/route.ts:37` | HMAC secret for relay JWT mint. Must match Fabrica-relay worker. |

**Optional:**
- `FABRICA_OAUTH_PROVIDER` — `authorize/route.ts:44` (default `github`).

**Generated secret (set as `FABRICA_RELAY_JWT_SECRET`):**
```
78f77f31506d77d3c65bb721e36da6ae3530853abbaabb222bf01ccd4a0f1893
```

**Apply commands (once authenticated):**
```
vercel env add NEXT_PUBLIC_SUPABASE_URL      <value> production fabrica-ai
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY <value> production fabrica-ai
vercel env add SUPABASE_SERVICE_ROLE_KEY      <value> production fabrica-ai
vercel env add FABRICA_RELAY_JWT_SECRET       78f77f31506d77d3c65bb721e36da6ae3530853abbaabb222bf01ccd4a0f1893 production fabrica-ai
```

**DB schema:** `supabase/migrations/0001_fabrica_artifacts.sql` creates `public.fabrica_artifacts` + RLS owner policies. Non-destructive (`CREATE TABLE/INDEX IF NOT EXISTS`). Decision: **KEEP** the `supabase/` folder (defines the artifacts table).

---

## Dependencies & Coordination Rules

1. **Both-sides rule:** identifiers shared with Fabrica-app (auth/share/diagnostics endpoints) change in lockstep with APP-BE1..BE7
2. **Static JSON contract:** changelog.json, nudge.json, kill-list.json are consumed by the packaged app — schema changes require APP-side sign-off
3. **Copy grounding:** every landing-page string must trace to one of the 3 internal marketing files (see Phase 6)
4. **i18n parity:** any string changed in en.json must be mirrored in fr.json and ar.json with identical key structure

---

## What Needs Verification

- [ ] Landing page deployed (`fabrica-ai.vercel.app`)
- [ ] Early-access signup flow (`/api/early-access` → Supabase)
- [ ] Dark theme + copper/amber palette
- [ ] Vercel deployment pipeline

---

## Checkpoint (Current State)

| Field | Value |
|---|---|
| **Current Group** | Phase 8 — WEB-UX2 (5 tasks, ALL DONE + MERGED) |
| **Current Task** | none — idle, awaiting PM commit & push to deploy |
| **Last Action** | Phase 8 complete: W33 (nav Download+Sign in), W34 (/download enhanced + /whats-new page), W35 (/login branded page + OAuth→/login routing), W36 (/dashboard rebuilt), W37 (pricing hidden). All 5 merged into Fabrica-web main, conflicts resolved, `npm run build` clean (17+ routes). Not pushed (PM does that). |
| **Next Action** | PM: commit & push Fabrica-web main → Vercel deploy. Verify live: top-bar Download+Sign in, /download, /login → /dashboard, pricing section absent, scroll anchors intact. |
| **Blockers** | none (relay/artifacts X1 is backend-only; UX shipped) |
| **Last Checkpoint** | 2026-08-29 |

---

## Autonomous Work System

On heartbeat kick:
1. Read the Checkpoint table FIRST, then task tables, then continue Next Action
2. Never restart completed work — check Status + Notes before dispatching
3. Any status change updates the Rollup in the same edit
4. Workers report via `worker_done`; orchestrator verifies, flips VERIFY→DONE, releases the session
5. Only the main orchestrator edits the Session Ledger

---

## Cross-Project Dependencies (from Fabrica-app)

| # | Dependency | From | Status | Notes |
|---|-----------|------|--------|-------|
| X1 | Deploy `/v1/desktop/*` backend API | APP-G4-FIX | ⬜ TODO | Fabrica-app desktop calls `/v1/desktop/auth/authorize`, `/v1/artifacts`, `/v1/desktop/auth/relay-token` (etc.) which do NOT exist on the current web backend (only `/api/auth/*` Supabase web login exists, different contract). Without this, cloud sign-in, artifact share/publish, and mobile relay pairing are non-functional. Either implement+deploy the desktop API, set `FABRICA_CLOUD_API_URL` env, or feature-flag those features as "coming soon". `fabrica-ai.vercel.app` also failed DNS resolution from the build env — confirm the site is actually deployed. |

---

## Session Ledger

> Tracks orchestration sessions and workers for this task file. Updated when sessions are created, released, or worktrees merged. Status uses the schema enum plus `RELEASED` (worker finished + released) and `DEAD` (terminal lost; cause noted).

| Handle | Type | Task ID | Orchestration IDs | Status | Created | Branch | Merged |
|--------|------|---------|-------------------|--------|---------|--------|--------|
| `term_0adb1b43-ceeb-47c7-ad47-f65f6df17d3e` | orchestrator | — | — | IN_PROGRESS | Aug 2026 | `main` (Fabrica-web/) | — |
| `ctx_3325b3345a41` | worker | WEB-W12 | — | RELEASED | Aug 2026 | `web-W12-audit` | ✅ |
| `ctx_00d2c7b7121a` | worker | WEB-W13 | — | RELEASED | Aug 2026 | `web-W13-meta` | ✅ |
| `ctx_5685e8eae1d3` | worker | WEB-W13b | — | RELEASED | Aug 2026 | `main` (Fabrica-web/) | ✅ |
| `ctx_d2bdaef9b4b8` | worker | WEB-W14+W15+W16 | — | RELEASED | Aug 2026 | `main` (Fabrica-web/) | ✅ |
| `task_4799a55a4149` | task | WEB-W17 | — | DONE | Aug 2026 | — | ✅ |
| `term_c9db7d6e-8ba3-45fc-95de-9c0f6276c2b8` | worker | WEB-W17 | — | RELEASED | Aug 2026 | Fabrica-web/ | ✅ |
| `term_a2eb2cb3-081b-473d-a188-775a29fe6fd9` | worker | WEB-W18 | — | DEAD (stopped) | Aug 2026 | Fabrica-web/ | — |
| `term_3bdeae00-c2a2-4dd7-ac80-96c34ecafb92` | worker | WEB-W18 | — | RELEASED | Aug 2026 | Fabrica-web/ | ✅ |
| `term_07702fa9-702a-45a4-847d-edd2f45a02d2` | worker | WEB-W19 | — | RELEASED | Aug 2026 | Fabrica-web/ | ✅ |
| `term_c980e3be-cdd7-499b-a9c6-062d9eb2af51` | worker | WEB-W20 | — | RELEASED | Aug 2026 | Fabrica-web/ | ✅ |
| `term_ac62af28-0da2-4c19-a9a7-cbf55e7c0679` | worker | WEB-W21 | — | RELEASED | Aug 2026 | Fabrica-web/ | ✅ |
| `term_0f27b013-a505-4f53-a910-88b43bbc3f35` | worker | WEB-W21+W22 | — | RELEASED | Aug 2026 | Fabrica-web/ | ✅ |
| `term_847538fd-65ae-4c9d-bf60-b32129175bd7` | worker | WEB-W23 | — | RELEASED | Aug 2026 | Fabrica-web/ | ✅ |
| `term_830c3392-100c-4bec-9f5e-c674dc5c32b5` | worker | WEB-W24 | — | RELEASED | Aug 2026 | Fabrica-web/ | ✅ |
| `term_f8b9ed52-49d6-4784-a969-f40f091a818b` | worker | WEB-W25 | — | RELEASED | Aug 2026 | Fabrica-web/ | — |
| `term_5bd02937-9574-4cba-b7de-4f93c0e465f3` | worker | WEB-W27 P1 honesty fixes | RELEASED | Aug 2026 | Fabrica-web/ | ✅ |
| `term_4bc0bb56-28f4-4feb-b818-7b83b7f3de61` | worker | WEB-W28 P2+P3 additions | DEAD (exited after 6/7 items; ADD5 folded into W29) | Aug 2026 | Fabrica-web/ | — |
| `term_f576d128-3490-4f30-a712-b9712d228852` | worker | WEB-W29 final sweep | RELEASED | Aug 2026 | Fabrica-web/ | ✅ |
| `term_b061232d-b623-4f1d-9e7b-b33e938ec5a0` | worker | WEB-W26 (heartbeat duplicate — stopped, folded into W29) | CANCELLED | Aug 2026 | Fabrica-web/ | — |
| `term_c14988d3-6524-45f4-92f3-94744b9e42b7` | worker | WEB-W28 (duplicate instance) | RELEASED | Aug 2026 | Fabrica-web/ | ✅ |
| `term_a79e1c78-d22d-42ac-ab27-c6ca60171c37` | worker | WEB-W27 (duplicate instance) | RELEASED | Aug 2026 | Fabrica-web/ | ✅ |
| `term_57f456ac-35fc-42a0-b24d-49bbc91690e9` | worker | WEB-W25 audit (duplicate instance) | RELEASED | Aug 2026 | Fabrica-web/ | ✅ |
| `term_efb4abec-27ae-41d5-ae1e-498f0e3454ba` | worker | none (found work claimed; stopped idle) | CANCELLED | Aug 2026 | Fabrica-web/ | — |
| `term_14e2a27c-b273-4598-85e5-01dc15e8f132` | worker | STATIC-JSON (changelog+kill-list) | `run_effeaea830f9 / task_88c8534c1c42 / ctx_ed060bcdc7d3` | DEAD (terminal lost; deliverables verified present: public/whats-new/changelog.json, nudge.json, public/plugins/kill-list.json) | Aug 21 2026 | Fabrica-web/ | ✅ |
| `term_99c98028-50a4-4c06-97d1-c45344c4ec62` | worker | WEB-W24+W26 | `run_effeaea830f9 / task_e7d2fee2a3ed / ctx_2495f8df3ffc` | DEAD (terminal lost; W24 half completed via term_830c3392; W26 reclaimed by term_d3e5b29c) | Aug 21 2026 | Fabrica-web/ | — |
| `term_6180e0da-9d37-48df-a0fc-2a33fa9ed08b` | worker | WEB-W25 (read-only) | `run_effeaea830f9 / task_707a4694155d / ctx_3b988764f1c6` | DEAD (terminal lost; W25 deliverable landed + verified) | Aug 21 2026 | Fabrica-web/ | ✅ |
| `term_d3e5b29c-dd96-48e2-a591-4a311a1ed925` | worker | WEB-W26 nav alignment | — | DEAD (terminal lost; task reclaimed by term_b468e39b in run_31a1a28a59a3) | Aug 23 2026 | Fabrica-web/ (active worktree) | — |
| `term_ea92976b-3a40-4f68-b909-f7cd1e5c746e` | worker | — (intended W27; superseded — W27 already DONE by term_5bd02937) | — | CANCELLED (stopped before dispatch, no unclaimed tasks) | Aug 23 2026 | Fabrica-web/ (active worktree) | — |
| `term_61d57f10-f40e-4ad4-891a-8de7bcd9acbf` | worker | WEB-W30 nudge schema fix | `run_31a1a28a59a3 / task_2e436aa5a100 / ctx_041b1019c35e` | RELEASED (work verified DONE; terminal stopped) | Aug 24 2026 | Fabrica-web/ (active worktree) | n/a |
| `term_b26beadf-c0ae-43f4-a3d6-1b5d9c59a4b1` | worker | WEB-W32 changelog rebrand prose | `run_31a1a28a59a3 / task_39a1b5bb4c87 / ctx_5ae5cd619c5f` | RELEASED (work verified DONE; terminal stopped) | Aug 24 2026 | Fabrica-web/ (active worktree) | n/a |
| `term_b468e39b-7eff-4be7-99fc-caddd23bf665` | worker | WEB-W26 nav alignment closeout | `run_31a1a28a59a3 / task_271455c9c3a1 / ctx_18185ff2cbe9` | RELEASED (worker_done sent: anchors verified, Hero #product scroll-mt fix, build clean) | Aug 24 2026 | Fabrica-web/ (active worktree) | n/a |
| `term_dc52c747-f6b4-4561-83d0-19c8250245f5` | worker | LIVE-VERIFY W1-W10 | `run_31a1a28a59a3 / task_e72cda1d36e9 / ctx_71efaab56e36` | RELEASED (report reviewed + statuses flipped; terminal stopped) | Aug 24 2026 | Fabrica-web/ (active worktree) | n/a |
| `term_ca035e02-320b-444a-9afa-c0d3649e3768` | worker | LIVE-VERIFY-2 (post env fix) | `run_31a1a28a59a3 / task_73c4fbe8cc6a / ctx_8239fa832ade` | RELEASED (env fix confirmed live: authorize/logout 200; terminal stopped) | Aug 24 2026 | Fabrica-web/ (active worktree) | n/a |
| `term_9d547abb-308f-4bbd-bf9c-560217c2349e` | worker | WEB-W3 refresh polish | `run_31a1a28a59a3 / task_1f9d160c0ead / ctx_5707350cc3c6` | RELEASED (diff verified: 400 on bad JSON; terminal stopped) | Aug 24 2026 | Fabrica-web/ (active worktree) | n/a |
| `term_3a912103-fe5e-4079-a2fd-e2db89a6efe8` | worker | WEB-W19 mobile audit closeout | `run_31a1a28a59a3 / task_517861b72f41 / ctx_d100c84f83b4` | RELEASED (diff verified: RTL + touch targets + object-cover; terminal stopped) | Aug 24 2026 | Fabrica-web/ (active worktree) | n/a |
| `term_9f2c4a17-2b3c-4d1e-8f5a-1c6e7b9a0d42` | worker | WEB-CTA (CTA→Download/Sign-in + /download + /dashboard + OAuth flow) | `task_5bbe58249b8e` | RELEASED (build clean, 0 new lint errors, i18n parity en/fr/ar; terminal stopped) | Aug 29 2026 | Fabrica-web/ | n/a |
| `term_f886d746-9e29-4d06-b440-de495420f9a7` | worker | WEB-W33 top-bar nav Download+Sign in | `run_bd4ac74e357b / task_5c0f257a93ef / ctx_d6358586dd8a` | RELEASED (merged into main; navbar combined w/ W37) | Aug 29 2026 | web-W33-nav | ✅ |
| `term_a6263719-1165-4f13-a87c-e1e6b50b7103` | worker | WEB-W34 enhance /download | `run_bd4ac74e357b / task_913b73e10c6f / ctx_b8c713eb7a4b` | RELEASED (merged into main; clean) | Aug 29 2026 | web-W34-dl | ✅ |
| `term_7295705a-c17e-4fe5-8035-cce7406ffd25` | worker | WEB-W35 enhance login/signup→dashboard | `run_bd4ac74e357b / task_9af3f7c023b1 / ctx_a2fbde7c5934` | RELEASED (merged into main; /login routing applied) | Aug 29 2026 | web-W35-auth | ✅ |
| `term_6f707b1d-c851-43cd-95e3-6a83e2a3a4e7` | worker | WEB-W36 enhance /dashboard | `run_bd4ac74e357b / task_16d4a0955487 / ctx_6300ab36aaf2` | RELEASED (merged into main; dashboard rebuild authoritative) | Aug 29 2026 | web-W36-dash | ✅ |
| `term_bda12904-6de6-4710-9c10-5ee280e82292` | worker | WEB-W37 hide pricing section | `run_bd4ac74e357b / task_621371a23275 / ctx_8d27b23ead49` | RELEASED (merged into main; #pricing anchors removed) | Aug 29 2026 | web-W37-pricing | ✅ |

> Note: pushed commit `334413b` → origin/main (Aug 2026). Vercel auto-deploys.

**Rules:**
- Only the main orchestrator creates sessions in this ledger
- Workers are released after review
- Worktrees are merged immediately after approval
- Never leave orphaned sessions

---

_Created: Aug 2026. Migrated from `Fabrica-web-tasks.md` per `.Fabrica-board/Fabrica-Schema.md`; original left unmodified._

_Last updated: 2026-08-29_

---

## Migration verification

- **Source:** `.Fabrica-web-board/Fabrica-web-tasks.md` (untouched original)
- **Target:** `.Fabrica-web-board/Fabrica-web-tasks.v2.md` (this file)
- **Task count:** original 27 task rows (7 API Routes + 3 Static Files + 1 Docs Site + 3 Landing Page Updates + 6 Phase 6 + 7 Phase 6b) vs v2 **27** — match (script-checked)
- **Zero missing IDs:** all original IDs W1…W26 incl. W13b present in v2 as `WEB-W1`…`WEB-W26`/`WEB-W13b`; 27/27 unique, none dropped (script-checked)
- **Rollup recount from v2 tables:** DONE 14 · IN_PROGRESS 1 · VERIFY 11 · TODO 1 · BLOCKED 0 · CANCELLED 0 = 27 ✓
- **Status mapping applied:** `IN PROGRESS→IN_PROGRESS` (WEB-W25); legacy dual-definition `VERIFY` legend fixed — second entry ("implemented and verified") is `DONE` per schema enum; no task outcome changed
- **Status cell normalization (review fix):** all 27 task-row Status cells converted from bold words (`**VERIFY**`/`**DONE**`/`**TODO**`/`**IN_PROGRESS**`) to the canonical emoji enum per Fabrica-Schema.md §1 — 👀 VERIFY · ✅ DONE · ⬜ TODO · 🔶 IN_PROGRESS. Columns, notes, and Rollup counts unchanged (recounted after normalization: 14+1+11+1 = 27 ✓)
- **Notes preserved verbatim** for every task row; group prose (Phase 6 critical block, W17 rules, Phase 6b intro) carried over intact
- **Session Ledger:** canonical columns applied (`Handle | Type | Task ID | Orchestration IDs | Status | Created | Branch | Merged`); legacy free-text statuses mapped — `active→IN_PROGRESS`, `released→RELEASED`, `stopped→DEAD (stopped)`; stray mid-ledger "Pushed:" line moved to a ledger note
- **Discrepancies:** (1) `W13b` is a known cross-project duplicate ID (web + marketing) — kept here as `WEB-W13b`; final owner resolution pending per schema §2. (2) Ledger row originally labeled "STATIC-JSON changelog+kill-list" maps to work overlapping WEB-W8/W10 but carries no W-ID in the original — kept verbatim rather than inventing an ID. (3) Original "What Needs Verification" used `- [~]` checkboxes — normalized to unchecked `- [ ]` per schema §3 (items remain unverified).

## CROSS-PROJECT NOTE from Fabrica-app (Aug 23, APP-ORCH)

- **nudge.json SCHEMA MISMATCH (What's New silently broken):** Fabrica-web serves /whats-new/nudge.json with fields {enabled, channel, minimumVersion, latestVersion, severity, message, detailsUrl, downloadUrl, enforcedAtVersion, enforceMessage, updatedAt} but the desktop app parser (Fabrica-app src/main/updater-nudge.ts:5-33) requires id (non-empty string) + optional minVersion/maxVersion — without id fetchNudge returns null and the nudge never fires. Fix options: (a) rename web fields to the app schema, or (b) adapt the app parser — needs PM/coord decision. changelog.json and plugins/kill-list.json both VALIDATED PASS against app parsers.


## CROSS-PROJECT NOTE from Fabrica-app (Aug 23, APP-ORCH) #2

- **Live changelog.json release-notes copy contains old-brand prose:** the entry served at /whats-new/changelog.json includes text like 'Orca is now Fabrica - a full rebrand...'. Desktop app What's New renders this to users - old-brand word visible in UI. Recommend rewording the entry copy to avoid leading with the old name (end-to-end parse otherwise VALIDATED PASS by Fabrica-app LIVE-PARSER-CHECK). Also D7 from prior note stands: nudge.json schema still mismatches the app parser.

