# Fabrica-web — Task File

*Last updated: 2026-09-01*

---

## What's Built


| ID        | What                                                                                                                             | Status | Notes |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| W1-W25    | Landing page (Hero, Crew, Feature, Control, Comparison, Pricing, FAQ, FinalCta, Footer), i18n, dark theme, deploy                | ✅ DONE |       |
| W26-W39   | Auth: login page (email/password + Google + GitHub OAuth), Supabase session handling, desktop auth routes (`/v1/desktop/auth/*`) | ✅ DONE |       |
| W40a-W40e | Landing page polish: animation, responsive, SEO, accessibility, performance                                                      | ✅ DONE |       |
| W44-W49   | API routes: `/v1/artifacts` CRUD, `/api/diagnostics/*` (token, upload), `/diagnostics/delete/*`, early-access, docs (MDX), download page, whats-new page | ✅ DONE |       |
| W51       | Login page: removed `/login?intent=pair` PairPanel (relay pairing moved to dashboard)                                            | ✅ DONE |       |
| W54       | Dashboard: profile (email, name, userId) + artifacts list (Open, Copy link, Delete) — all from Supabase via RLS                  | ✅ DONE |       |


## Pending Tasks

> Blocked on Fabrica-marketing M4-M6 (Align with product). Cannot start until marketing delivers updated brand files.

| # | Task | Status | Depends on | Notes |
|---|------|--------|------------|-------|
| W55 | Fetch onorca.dev landing page for design reference — analyse layout, structure, copy patterns, visual hierarchy | ⬜ TODO | — | Inspiration source: https://www.onorca.dev/ |
| W56 | Update landing page copy — rewrite Hero, Feature, Control, Comparison, Pricing, FAQ, FinalCta sections using updated brand guidelines + positioning from marketing | ⬜ TODO | MKT-M4, MKT-M5, W55 | Copy must reflect actual Fabrica-app features |
| W57 | Update landing page images — replace screenshots, icons, visuals to match current Fabrica-app UI | ⬜ TODO | MKT-M4, MKT-M6 | Generate new screenshots from app |
| W58 | Sync i18n — update en.json, fr.json, ar.json with any new/changed copy keys | ⬜ TODO | W56 | Three locales must stay in sync |
| W59 | Update changelog.json + nudge.json for v0.0.5 release — replace 0.0.44 references with 0.0.5, update releaseNotesUrl to v0.0.5 tag | ✅ DONE | — | Static files in public/whats-new/ |


## Supabase Tables


| Table                 | Purpose                                        | RLS       |
| --------------------- | ---------------------------------------------- | --------- |
| `fabrica_artifacts`   | User artifacts (created by desktop app)        | ✅ Enabled |
| `diagnostics`         | Crash reports from desktop bundle upload       | None      |
| `diagnostic_uploads`  | Short-lived tokens for two-step upload flow    | None      |


---

## Rollup


| Metric      | Value                                     |
| ----------- | ----------------------------------------- |
| ✅ DONE      | 51                                        |
| ❌ CANCELLED | 3 (W50b, W52, W53 — relay/device pairing) |
| ⬜ TODO      | 4 (W55-W58 — blocked on marketing M4-M6) |
| Completion  | 93%                                       |


---

## Pages (what's in the codebase)


| Route          | File                                   | What it does                           |
| -------------- | -------------------------------------- | -------------------------------------- |
| `/`            | `app/[locale]/page.tsx`                | Landing page — 12-block narrative      |
| `/login`       | `app/[locale]/login/page.tsx`          | Auth: email/password + Google + GitHub |
| `/dashboard`   | `app/[locale]/dashboard/page.tsx`      | Authenticated: profile + artifacts     |
| `/download`    | `app/[locale]/download/page.tsx`       | Platform download links                |
| `/docs`        | `app/[locale]/docs/page.tsx`           | Documentation hub                      |
| `/docs/[slug]` | `app/[locale]/docs/[...slug]/page.tsx` | Individual doc pages                   |
| `/whats-new`   | `app/[locale]/whats-new/page.tsx`      | Changelog                              |


## API Routes (what's in the codebase)


| Route                               | Purpose                   |
| ----------------------------------- | ------------------------- |
| `POST /api/auth/callback`           | Supabase OAuth callback   |
| `GET /api/auth/session`             | Get current session       |
| `POST /api/auth/logout`             | Sign out                  |
| `POST /api/auth/refresh`            | Refresh session           |
| `POST /api/auth/authorize`          | Authorize (desktop)       |
| `GET /v1/artifacts`                 | List user artifacts (RLS) |
| `GET /v1/artifacts/[id]`            | Get single artifact       |
| `PUT /v1/artifacts/[id]`            | Update artifact           |
| `DELETE /v1/artifacts/[id]`         | Delete artifact           |
| `POST /api/diagnostics/token`       | Get upload token (step 1) |
| `POST /api/diagnostics/upload`      | Upload NDJSON bundle (step 2) |
| `POST /diagnostics/delete/[ticketId]` | Delete uploaded bundle (step 3) |
| `GET /v1/desktop/auth/session`      | Desktop session check     |
| `POST /v1/desktop/auth/authorize`   | Desktop auth              |
| `POST /v1/desktop/auth/refresh`     | Desktop token refresh     |
| `GET /v1/desktop/auth/logout`       | Desktop logout            |
| `GET /v1/desktop/auth/capabilities` | Desktop capabilities      |
| `GET /v1/desktop/auth/profile`      | Desktop profile           |
| `GET /v1/desktop/auth/org`          | Desktop org               |
| `GET /v1/desktop/auth/relay-token`  | Relay token minting       |


## Components (what's in the codebase)


| Component              | Path                                       | Purpose                      |
| ---------------------- | ------------------------------------------ | ---------------------------- |
| Navbar                 | `components/navbar.tsx`                    | Fixed nav with mobile drawer |
| Hero                   | `components/Blocks/Hero.tsx`               | Landing hero section         |
| Crew                   | `components/Blocks/CrewSection.tsx`        | Landing crew section         |
| Feature                | `components/Blocks/FeatureSection.tsx`     | Feature highlight            |
| Control                | `components/Blocks/ControlSection.tsx`     | Control section              |
| Comparison             | `components/Blocks/ComparisonSection.tsx`  | Comparison section           |
| Pricing                | `components/Blocks/PricingSection.tsx`     | Pricing section              |
| FAQ                    | `components/Blocks/FaqSection.tsx`         | FAQ section                  |
| FinalCta               | `components/Blocks/FinalCta.tsx`           | Final CTA                    |
| Footer                 | `components/Blocks/Footer.tsx`             | Footer                       |
| Changelog              | `components/Blocks/DaemonTicker.tsx`       | Changelog ticker             |
| Toast Provider         | `components/login/toast-provider.tsx`      | Login toasts                 |
| OsPlatformGrid         | `components/download/OsPlatformGrid.tsx`   | Download platform grid       |
| Docs Sidebar           | `components/docs/DocsSidebar.tsx`          | Docs navigation              |
| Docs Prose             | `components/docs/Prose.tsx`                | Docs content renderer        |
| Shimmer Button         | `components/ui/shimmer-button.tsx`         | CTA button                   |
| Badge                  | `components/ui/badge.tsx`                  | Status badge                 |
| Avatar                 | `components/ui/avatar.tsx`                 | User avatar                  |
| Accordion              | `components/ui/accordion.tsx`              | FAQ accordion                |
| Toggle                 | `components/ui/toggle.tsx`                 | Theme toggle                 |
| Toggle Group           | `components/ui/toggle-group.tsx`           | Toggle group                 |
| Marquee                | `components/ui/marquee.tsx`                | Integrations marquee         |
| Animated Theme Toggler | `components/ui/animated-theme-toggler.tsx` | Theme switcher               |


## i18n

Three locales: `en`, `fr`, `ar` — must stay in sync.

## Static Files


| File                                 | Purpose            |
| ------------------------------------ | ------------------ |
| `public/whats-new/changelog.json`    | Changelog entries  |
| `public/whats-new/nudge.json`        | Notification nudge |
| `public/plugins/kill-list.json`      | Plugin blocklist   |
| `public/fabrica-logo_icon.png`       | Logo               |
| `public/fabrica-logo_icon_light.png` | Light logo         |


---

## Checkpoint

| Field | Value |
|---|---|
| **Status** | 51 done, 4 pending (blocked on marketing M4-M6). Ready to update landing page once brand files are refreshed. |
| **Next Action** | Wait for MKT-M4/M5/M6 completion, then dispatch W55-W58 |
| **Last Checkpoint** | 2026-09-01 |

---

## Session Ledger

| Handle | Task | Status |
|---|---|---|
| — | — | No active sessions |

---

*Archive of old W1-W55 task history: `ARCHIVE-W1-W54-2026-08-31.md`*