# Fabrica-web — Worker Instructions (AGENTS.md)

## What This Folder Is

This is the **Fabrica landing page** — a Next.js web app hosted at `fabrica-ai.vercel.app`. You are a worker dispatched by the top-level orchestrator to complete a task in this repo.

## Tech Stack

- Next.js 16 (App Router, SSR)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui + Base UI
- Motion (scroll reveals, micro-interactions)
- Supabase (early-access signup)
- Vercel Analytics

## What You Should Know

- This is a rebrand from Orca to Fabrica
- Domain: `fabrica-ai.vercel.app` (was `onorca.dev`)
- Package name: `fabrica-web` (was `saas-landing-page`)
- Brand: dark theme, copper/amber palette, forge metaphor

## Conventions

- **Server Components by default** — only add 'use client' when truly needed
- **TypeScript strict** — no `any` types
- **Tailwind only** — no inline styles or CSS modules
- **Named exports** for components, default exports for pages/layouts

## What You Do NOT Do

- **Do NOT edit** `.backup/` or `_sources/` — frozen reference copies
- **Do NOT commit or push** — make changes only, orchestrator handles git
- **Do NOT add new dependencies** without explicit instruction

## Key Directories

```
app/                — Next.js App Router pages and layouts
app/api/            — API routes (auth, share, diagnostics, telemetry)
components/         — React components (navbar, footer, sections)
lib/                — Utility functions, auth, docs content
messages/           — i18n translation files (en, ar, fr, etc.)
public/             — Static assets (kill-list.json, changelog.json, nudge.json)
```

## Task File

Your task file is `.Fabrica-web-board/Fabrica-web-tasks.md` — the single source of truth for all web work.

## How to Send Results

When your task is complete, send `worker_done`:

```bash
orca orchestration send --type worker_done --subject "Task complete" --body "Summary of what was done" --task-id <task_id> --dispatch-id <dispatch_id> --outcome succeeded --files-modified "path/a,path/b" --json
```

If blocked:
```bash
orca orchestration send --type escalation --subject "Blocked" --body "What happened and what's needed" --task-id <task_id> --dispatch-id <dispatch_id> --json
```
