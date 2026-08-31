# Fabrica-web — Task File

*Last updated: 2026-08-31*

---

## What's Built


| ID        | What                                                                                                                             | Status | Notes |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| W1-W25    | Landing page (Hero, Crew, Feature, Control, Comparison, Pricing, FAQ, FinalCta, Footer), i18n, dark theme, deploy                | ✅ DONE |       |
| W26-W39   | Auth: login page (email/password + Google + GitHub OAuth), Supabase session handling, desktop auth routes (`/v1/desktop/auth/*`) | ✅ DONE |       |
| W40a-W40e | Landing page polish: animation, responsive, SEO, accessibility, performance                                                      | ✅ DONE |       |
| W44-W49   | API routes: `/v1/artifacts` CRUD, `/v1/feedback`, early-access, docs (MDX), download page, whats-new page                        | ✅ DONE |       |
| W51       | Login page: removed `/login?intent=pair` PairPanel (relay pairing moved to dashboard)                                            | ✅ DONE |       |
| W54       | Dashboard: profile (email, name, userId) + artifacts list (Open, Copy link, Delete) — all from Supabase via RLS                  | ✅ DONE |       |


## Supabase Tables


| Table               | Purpose                                 | RLS       |
| ------------------- | --------------------------------------- | --------- |
| `fabrica_artifacts` | User artifacts (created by desktop app) | ✅ Enabled |


---

## Rollup


| Metric      | Value                                     |
| ----------- | ----------------------------------------- |
| ✅ DONE      | 51                                        |
| ❌ CANCELLED | 3 (W50b, W52, W53 — relay/device pairing) |
| ⬜ TODO      | 0                                         |
| Completion  | 100%                                      |


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
| `POST /v1/feedback`                 | Submit crash report       |
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

*Archive of old W1-W55 task history: `ARCHIVE-W1-W54-2026-08-31.md`*