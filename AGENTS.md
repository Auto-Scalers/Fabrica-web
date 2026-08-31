# Fabrica-web — Worker Instructions (AGENTS.md)

## What This Folder Is

This is the **Fabrica landing page & dashboard** — a Next.js web app hosted at `fabrica-ai.vercel.app`. You are a worker dispatched by the top-level orchestrator to complete a task in this repo.

## Tech Stack

- Next.js 16 (App Router, SSR)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui + Base UI
- Motion (scroll reveals, micro-interactions)
- Supabase (auth + artifacts storage)

## Commands

Run these before claiming DONE (from `Fabrica-web/`):

```bash
npm run lint       # ESLint
npm run build      # production build (must compile clean)
```

## What You Should Know

- This is a rebrand from Orca to Fabrica
- Domain: `fabrica-ai.vercel.app`
- Brand: dark theme, copper/amber palette, forge metaphor

## Conventions

- **Server Components by default** — only add 'use client' when truly needed
- **TypeScript strict** — no `any` types
- **Tailwind only** — no inline styles or CSS modules
- **Named exports** for components, default exports for pages/layouts

## Definition of Done

A task is DONE only when ALL of these hold:

1. **Commands pass:** `npm run lint` and `npm run build` compile clean — paste real output as evidence.
2. **i18n parity:** any key changed in `en.json` is mirrored in `fr.json` and `ar.json` with identical structure.
3. **No Orca/Stably branding** in page copy or meta tags.
4. **Tracking files updated in the same edit:** task status in `.Fabrica-web-board/Fabrica-web-tasks.md`.

## What You Do NOT Do

- **Do NOT edit** `.backup/` or `_sources/` — frozen reference copies
- **Do NOT commit or push** — make changes only, orchestrator handles git
- **Do NOT add new dependencies** without explicit instruction

## Key Directories

```
app/                — Next.js App Router pages and layouts
app/api/auth/       — Supabase OAuth routes (callback, session, logout, refresh, authorize)
app/v1/artifacts/   — Artifact CRUD (list, get, update, delete — RLS enforced)
app/v1/feedback/    — Crash report submission
app/v1/desktop/     — Desktop app auth routes (session, authorize, refresh, logout, capabilities, profile, org, relay-token)
components/         — React components (navbar, Blocks/, download/, docs/, ui/)
lib/                — Utilities, Supabase clients, docs content
messages/           — i18n translation files (en, fr, ar)
public/             — Static assets (logos, changelog, plugin kill-list)
supabase/           — Database migrations
```

## Task File

Your task file is `.Fabrica-web-board/Fabrica-web-tasks.md` — the single source of truth for all web work.
