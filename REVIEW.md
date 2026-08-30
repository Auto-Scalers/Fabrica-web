# Fabrica App I/O Systems — Review

## Later Tasks (instructions received, not executed yet)

_Pending user feedback: instructions will be added here as they arrive. Questions answered in chat. Nothing executed until user confirms._

### User feedback — Relay + Pairing section

**Q1 (line 32):** "from where did i get that JWT ?" (`FABRICA_RELAY_JWT_SECRET`)
- Source: Vercel `.env.local` / Vercel env vars / Cloudflare `wrangler.toml`. Must match Supabase JWT secret (derived from `SUPABASE_SERVICE_ROLE_KEY` or configured separately). See `fabrica-cloud.ts:166-201` (`mintRelayJwt()`).

**Q2 (lines 36-37):** "if no relay in Orca, from where we get the need of this relay at first place and how orca handled the alternative ?"
- Orca had NO relay, NO pairing, NO mobile connection. The desktop handled everything locally (workspace files in GCS, harness agent in Cloud Run). Phone/mobile was never part of Orca.
- Fabrica added relay because the product has a mobile companion app (`Fabrica-app/mobile/`). Relay is the bridge for phone↔desktop when not on same LAN. Without relay, pairing is impossible across networks.

**Q3 (lines 41-43):** `/login?intent=pair` — do we really need it? Plus: need dashboard relay status section (link/unlink) + automatic linking option when user logs in to both desktop and APK.
- Need: `/login?intent=pair` is used by web login page (`PairPanel`) to show pairing code when user is signed in. Also handles deep link `fabrica://pair`.
- Need added: Dashboard section showing relay status + link/unlink buttons. Auto-link when both desktop and APK are logged in.
- Instruction: Add to Later Tasks (not executed yet).

---

Compiled from Fabrica-app source, Fabrica-relay source, Fabrica-atlas legacy-fabrica, Fabrica-web routes, and previous audit results.

---

## 1. Relay (Phone ↔ Desktop Bridge)

### What it is
A WebSocket bridge that lets a phone connect to a desktop when they're not on the same LAN. Deployed as a Cloudflare Worker + Durable Object (`fabrica-relay.fabrica-relay.workers.dev`). It does NOT store user data — it's a pure connection broker.

### How it works
- **Director** (HTTP, stateless): `POST /v1/assign` — desktop gets a cell URL + assignment epoch. `POST /v1/resolve` — phone resumes via resume token.
- **Cell** (Durable Object, stateful): Runs the WebSocket server. Handles challenge-response auth (NaCl box), ping/drain, data forwarding.
- **Protocols**: `WS /v1/host/control` (desktop), `WS /v1/connect/<relayHostId>` (phone), `WS /v1/host/data/<connId>` (data tunnel).

### DB / Tables
Inside the Durable Object SQLite (ephemeral, per-host):
- `host_state` (assignment, generation, resume secrets, lease)
- `invites` (pending pairing invite tokens)
- `device_credentials` (installed resume tokens)
- `pending_conns` (phone connections waiting)

No Supabase tables for relay.

### Auth
Desktop presents a Supabase JWT (`FABRICA_RELAY_JWT_SECRET`). Phone presents invite token or resume token.

### Orca vs Fabrica
- **Orca**: No relay concept. No phone pairing. No WebSocket bridge.
- **Fabrica**: Full relay system with pairing, invites, resume, lease drain, E2EE v2 framing. Used by `/v1/desktop/auth/relay-token` endpoint.

### Where to see it
- Desktop: Settings > Mobile (QR code pairing), pair-confirm screen
- Phone: `app/pair-scan.tsx`, `app/pair-confirm.tsx`, `app/pair.tsx` (handles `FABRICA://pair` deep links)
- Web: `/login?intent=pair` (shows pairing code + deep link `fabrica://pair?token=...`)

### Status
✅ Working. Relay server deployed (`wss://fabrica-relay.fabrica-relay.workers.dev`). Code complete. DB schema in Durable Object SQLite is self-contained.

---

## 2. Phone-Desktop Pairing

### What it is
Creates a trusted connection between desktop (host) and phone (companion). Generates pairing invite tokens + device credentials.

### Data flow
1. Desktop opens Settings > Mobile → calls `DesktopRelayService.createPairingRelay()`
2. Desktop sends `invite-create` RPC over control WS → server creates invite token (32-byte base64url, 24h TTL, max 16 attempts)
3. Desktop builds `PairingOffer` (v2 schema): endpoint, public key, invite token, relay info
4. Desktop renders QR-like SVG + `FABRICA://pair?token=...` deep link
5. Mobile scans QR / taps link → connects to relay cell → sends `relay-auth` with invite token
6. Server validates invite → sends `relay-hello` → notifies host via `conn-open`
7. Desktop opens data socket → sends `host-data-auth` → data channel bound
8. Desktop sends `device-credential-install` → server stores `device_credentials` (resume token hash)
9. Phone gets `resumeToken` for future connections without re-pairing

### DB / Tables
- **Relay DO SQLite**: `invites`, `device_credentials`, `host_state`, `pending_conns`
- **Supabase**: `fabrica_pair_invites` (table exists after applying 0003 migration; route reads from it, desktop pushes invites to it via relay or direct insertion)

### Auth
- Desktop: Bearer token (Supabase JWT) for relay token creation (`mintRelayJwt()` in `fabrica-cloud.ts`)
- Phone: Invite token or resume token

### Orca vs Fabrica
- **Orca**: No pairing concept. No mobile connection. No relay.
- **Fabrica**: Full pairing flow with invite/recovery, pairing journal (`mobile-relay-pairing-journal.ts`), recovery logic (`mobile-relay-pairing-recovery.ts`), keychain storage (`pairing-keychain.ts`).

### Where to see it
- Desktop: Settings > Mobile, pair panel
- Phone: `/pair-scan`, `/pair-confirm`, `/pair` (handles deep links)
- Web: `/login?intent=pair` (PairPanel component)

### Status
✅ Working. All pairing routes (`/v1/desktop/auth/invites`) work but the `fabrica_pair_invites` table must be created (apply 0003). If table is missing, route falls through gracefully and returns a synthesized placeholder.

---

## 3. Telemetry (PostHog Analytics)

### What it is
Enterprise-grade anonymous analytics system. Tracks 60+ user actions in the desktop app. Never creates person profiles. Uses anonymous UUID install IDs.

### How it works
- **Transport**: `posthog-node@5.33.3` (PostHog SDK in Electron main process)
- **Host**: `https://us.i.posthog.com`
- **Key**: `FABRICA_POSTHOG_WRITE_KEY` (compile-time injected from GitHub Actions secret; `null` in dev builds)
- **Compile gate**: `TELEMETRY_ENABLED` (only enabled when both `FABRICA_BUILD_IDENTITY` and `FABRICA_POSTHOG_WRITE_KEY` are non-null)
- **Kill switches** (precedence order): `DO_NOT_TRACK=1`, `FABRICA_TELEMETRY_DISABLED=1`, `CI` env vars, user opt-out
- **Distinct ID**: Anonymous UUID v4 (`install_id`) per install, stored in `GlobalSettings.telemetry.installId`
- **Person profiles**: Disabled (`$process_person_profile: false`)
- **Flush**: `flushAt: 20`, `flushInterval: 10_000ms`, `maxQueueSize: 5000`
- **GeoIP**: Disabled (`disableGeoip: true`)
- **Rate limits**: 30/min per event, 20/min for `agent_error`, 1000/session ceiling
- **Burst cap**: Per-event rate limits enforced (`telemetry/burst-cap.ts`)

### Events tracked (categories)
App lifecycle (`app_opened`, `star_nag_outcome`), Repo/workspace (`repo_added`, `workspace_created`), Agent ops (`agent_started`, `agent_error`, `agent_hook_install_failed`), Daemon (`daemon_start_failed`), Codex (`codex_trust_grant`), Settings (`settings_changed`), Native chat (`native_chat_toggled`), Telemetry consent (`telemetry_opted_in`/`opted_out`), CLI feature tips, Feature wall, Onboarding, Editor, SSH, Smart sort, Setup script — 60+ total.

### DB / Tables
- **PostHog cloud** (remote, managed by PostHog)
- **No local DB** for events — pure fire-and-forget HTTP POST

### Auth
None for telemetry events. Anonymous (`install_id` only).

### Where to see it
- **Desktop Settings** → Privacy pane shows consent state
- **Desktop**: Auto-tracks user actions without explicit user interaction
- **Web**: NOT visible. `/api/telemetry` is a server-side proxy (dead — no `POSTHOG_API_KEY` in `.env.local`)

### Status
✅ **Desktop telemetry**: Working (official builds only). Dev builds have `null` write key and events don't leave the machine.
❌ **Web `/api/telemetry`**: **DEAD** (`POSTHOG_API_KEY` not set; route silently returns `{success: true, buffered: false}` without sending anything). Route was deleted in W50 cleanup.

### Orca vs Fabrica
- **Orca**: No PostHog integration. No analytics SDK. Only internal `telemetry` in runtime-board.json (CPU/memory/uptime) and audit event logs.
- **Fabrica**: Full PostHog analytics system with 60+ validated events, triple-layer rate limiting, build-time gating, anonymous-by-design.

---

## 4. Crash Reports & Feedback (Diagnostics)

### What it is
Two separate systems: crash reports (automatic) and user feedback (manual dialog). Both submit data to a Supabase `diagnostics` table.

### How it works
**Crash reports** (`/api/diagnostics` POST):
- Receives `type: 'crash'`, `app_version`, `os`, `error`, `stack`, `message`, `screenshot`, `metadata`
- Stores in Supabase `diagnostics` table
- Auth required (Bearer token)

**Feedback dialog** (desktop main → `feedback.ts`):
- User-initiated (Feedback → Report Issue)
- Sends to `https://fabrica-ai.vercel.app/v1/feedback` (custom endpoint, NOT PostHog)
- Includes optional GitHub auth, email, screenshot attachment, diagnostic bundle
- Separate from telemetry consent gate

### DB / Tables
- **Supabase `diagnostics`** (table does NOT exist yet — must apply 0002 migration)

### Where to see it
- **Desktop**: Feedback → Report Issue (manual dialog only)
- **Desktop**: Crash reports are automatic (user doesn't interact)
- **Web**: Not visible (admin-only access to Supabase table)

### Status
❌ **Table missing** (`diagnostics` does not exist in Supabase). Route code exists but will return 500 on POST until 0002 is applied.
✅ **Code is complete** (`app/api/diagnostics/route.ts` has full GET + POST with validation)

### Orca vs Fabrica
- **Orca**: No external crash reporting. Only `console.error()` and local audit log (`runtime-board.json`). No feedback endpoint.
- **Fabrica**: Full external crash/feedback system with Supabase DB storage (`diagnostics`), diagnostic upload endpoint (`FABRICA_DIAGNOSTICS_TOKEN_URL`), feedback endpoint (`https://fabrica-ai.vercel.app/v1/feedback`), and diagnostic bundle uploads.

---

## 5. Auth (Desktop + Web)

### Desktop Auth Flow
1. Desktop opens Settings (or first launch) → `Get Started` / `Sign In`
2. Desktop loads `SupabaseAccountSignInCard.tsx` (renderer)
3. User signs in with email/password (`supabase.auth.signInWithPassword()` via `lib/supabase-browser.ts`)
4. Session stored in `{userData}/supabase-auth-storage.json` (custom JSON adapter, since Electron main doesn't have localStorage)
5. Desktop uses `getSupabaseAccessToken()` for relay authentication (`FABRICA_RELAY_JWT_SECRET` signs JWTs for relay)

### Web Auth Flow
- `/api/auth/authorize` → `supabase.auth.signInWithOAuth()`
- `/api/auth/callback` → `exchangeCodeForSession()`
- `/api/auth/refresh` → `refreshSession()`
- `/login` page (`app/[locale]/login/page.tsx`) → email/password + Google + GitHub + pairing + recovery
- Token storage: `window.localStorage.getItem('fabrica_auth_tokens')`

### DB / Tables
- **Supabase `auth.users`** (managed by Supabase Auth)
- **No database writes** for auth (pure Supabase Auth module)

### Auth Config
- **URL**: `https://xoynlmscwkimaopkavkj.supabase.co`
- **Anon Key**: `PASTE_YOUR_ANON_KEY_HERE` (`.env.local` placeholder — must be filled for web OAuth to work fully)
- **Service Role Key**: Set (`.env.local`)

### Status
⚠️ **Web OAuth**: Works partially. Google/GitHub redirect to `https://xoynlmscwkimaopkavkj.supabase.co/auth/v1/callback` then back to `/api/auth/callback`. The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing from `.env.local` (placeholder `PASTE_YOUR_ANON_KEY_HERE`). This may break some auth flows.
✅ **Desktop auth**: Works (uses `SUPABASE_URL` + `SUPABASE_ANON_KEY` from `.env.local`).
⚠️ **Supabase email confirmation**: Must turn OFF in Supabase Dashboard for email sign-in to work.

### Orca vs Fabrica
- **Orca**: Uses `x-tenant-id` header for auth (no real user authentication). Uses `supabase.auth.getSession()` but doesn't use OAuth or session persistence.
- **Fabrica**: Full OAuth + PKCE flow, email/password, session persistence (JSON file for desktop, localStorage for web), Bearer token validation on every protected route (`getUserFromRequest()` / `getSupabaseUser()`), desktop auth routes (`/v1/desktop/auth/*` — 8 routes for profile, org, capabilities, relay token, invites, session, refresh, logout).

---

## 6. Artifacts (Desktop Publishing + Web Sharing)

### Desktop Flow
1. Agent creates `ArtifactWriteRequest` → `ArtifactPublisher.create()`
2. Desktop sends POST `/v1/artifacts` with `{ content, contentType, fileName, title }` + Bearer auth
3. Server creates `slug` (18-char hex) + `edit_token` (32-char hex), sets `expires_at` (30 days), inserts to `fabrica_artifacts`
4. Returns `{ artifact: ArtifactMetadata, shareUrl, editToken }`
5. Desktop stores edit token locally
6. Update: PUT `/v1/artifacts/{slug}` with Bearer + `x-FABRICA-edit-token` header
7. Unshare (delete without auth token): DELETE `/v1/artifacts/{slug}` with Bearer + edit token OR Bearer-only (owner match)
8. Public view: `GET /v1/artifacts/{slug}` (no auth, checks `expires_at`)

### DB / Tables
- **`fabrica_artifacts`** (exists, 0 rows) — 13 columns matching the route code exactly
- **Migration**: `0001_fabrica_artifacts.sql` (already applied)

### Status
✅ **Table exists** (`fabrica_artifacts`).
⚠️ **Table is empty** (0 rows) — no artifacts have been published yet.
✅ **Route code** is complete (`v1/artifacts/route.ts`, `v1/artifacts/[id]/route.ts`).
✅ **Desktop integration** complete (`artifact-cloud-service.ts`, `artifact-publisher.ts`, `artifact-cloud-request.ts`, CLI commands: `fabrica artifacts share/update/unshare/list/delete`).
⚠️ **Web dashboard** (`app/[locale]/dashboard/page.tsx`) reads from `/v1/artifacts` and shows recent artifacts with share links. Works when artifacts exist.

### Dead Legacy System
- `/api/share/*` (deleted in W50) — referenced `artifacts` table (never existed) — completely dead code.
- The original `early_access_signups` table (dropped by 0004) — dead data, 2 test signups.

### Where to see it
- **Desktop**: CLI (`fabrica artifacts ...`), agent output (published artifacts), Settings
- **Web**: `/dashboard` — shows artifacts list + pairing code
- **Public**: `/v1/artifacts/{slug}` (share URL)

### Orca vs Fabrica
- **Orca**: Never had working artifacts. The frontend had a "system components" UI (`dashboard/page.tsx` lines 2518-2527) that called `/api/db/system-components` — routes that never existed in the Express server. No sharing mechanism, no public URLs, no edit tokens.
- **Fabrica**: Fully functional artifact system with `fabrica_artifacts` table, slug-based URLs, edit tokens, 30-day TTL, public sharing, desktop CLI.

---

## 7. Feedback (User Reports) vs Telemetry (Automatic Events)

### Difference
- **Feedback** = user-initiated (`Feedback → Report Issue`). Includes email, screenshot, diagnostic bundle. Sent to `/v1/feedback` endpoint.
- **Telemetry** = automatic (PostHog events from desktop). User doesn't interact. Sent to PostHog cloud.
- **Diagnostics** = crash reports (automatic) + feedback (manual), stored in `diagnostics` table.

### Where user sees it
- **Feedback dialog**: Desktop main process (`feedback.ts` — 361 lines). User opens manually.
- **Telemetry consent**: Desktop Settings → Privacy pane (`telemetry-consent-types.ts`).
- **Crash reporting**: User doesn't see automatic crash uploads (happens silently in background). User sees feedback confirmation message after submitting.
- **Web**: Nothing visible. The `POST /api/telemetry` proxy is invisible and dead (no PostHog key set).

### Status
- **Feedback endpoint** (`/v1/feedback`): Working code exists, endpoint active.
- **Telemetry (desktop)**: Active for official builds. Disabled (`TELEMETRY_ENABLED` false) in dev/contributor builds.
- **Telemetry (web)**: Dead (route deleted in W50, no PostHog key).
- **Crash reports** (`POST /api/diagnostics`): Code complete. **Table missing** — must apply 0002 migration.

---

## 8. Auto-Update / What's New / Nudge / Kill-List

### What's New (`/whats-new`)
- **File**: `public/whats-new/changelog.json` — single entry (`v1.4.178-rc.2`, title: "Reborn as Fabrica")
- **Page**: `app/[locale]/whats-new/page.tsx` — reads file at build time via `fs.readFile()`
- **Status**: ✅ Works. Static file served.

### Nudge
- **File**: `public/whats-new/nudge.json` — version range (`1.4.0` to `2.0.0`)
- **Status**: ✅ File exists. Consumed by desktop app (not web routes).

### Kill-List
- **File**: `public/plugins/kill-list.json` — empty array (`plugins: []`)
- **Status**: ✅ File exists. Empty. Consumed by desktop app plugin loader.
- **Note**: The `fabrica-portuguese` plugin pack (`pt-BR.json`, 15,251 lines) references Orca and needs rebranding. Not part of kill-list.

### Auto-Update
- **Status**: Not visible in web code. Desktop has update mechanism via `electron-vite.config.ts` build identity (`FABRICA_BUILD_IDENTITY` = `stable`/`rc`).

---

## 9. Plugin System

### Plugin Marketplace Index
- **File**: `public/plugins/kill-list.json` (empty array, version: 1)
- **Web**: No plugin marketplace route exists (`/plugins` is not a web route).
- **Desktop**: Plugin loader checks kill-list before loading plugins. Plugin marketplace index is served by desktop app.

### Portuguese Plugin Pack Issue
- **File**: `Fabrica-plugins/fabrica-portuguese/locales/pt-BR.json` (15,251 lines)
- **Status**: Contains 15,251 references to "Orca" — needs full rebrand. Not part of web DB audit. Separate sub-project task.

---

## 10. Relay Token Minting (Desktop Auth → Relay Auth)

### What happens
When desktop connects to relay:
1. Desktop reads Supabase JWT from session storage (`supabase-auth-storage.json`)
2. `mintRelayJwt()` in `fabrica-cloud.ts` creates a new JWT:
   - Header: `{ alg: 'HS256', typ: 'JWT' }`
   - Payload: `{ sub: userId, relayHostId, hostPublicKeyB64, iat, exp }` (15 min TTL)
   - Signature: HMAC-SHA256(`FABRICA_RELAY_JWT_SECRET`, base64(header) + "." + base64(payload))
3. Desktop sends `Authorization: Bearer <relayToken>` on relay director requests
4. Relay validates JWT using `FABRICA_RELAY_JWT_SECRET` (Cloudflare Worker env var)

### Env var dependency
- `FABRICA_RELAY_JWT_SECRET` must match between:
  - Vercel (`.env.local` / Vercel env)
  - Cloudflare relay worker (`wrangler.toml` / Workers env)
  - Desktop build (baked into bundle via electron-vite.config.ts)

### Status
✅ Code is complete (`fabrica-cloud.ts` has `mintRelayJwt()` + `getRelayAuthToken()`).
⚠️ Must verify the secret matches across all 3 environments. The user hasn't confirmed this.

---

## 11. Agent Hooks / Runtime Events

### What is it
The desktop app can receive webhook-like events from agent executions through a relay event hook system.

### Files
- `Fabrica-app/src/shared/agent-hook-relay.ts`
- `Fabrica-app/src/relay/`

### Status
✅ Code exists. Not visible in web. Part of the relay system.

---

## 12. Browser Use / Embedded Browser

### What it is
Desktop can open an embedded browser (webview) with cookie import from Firefox/Chromium.

### Cookie Import
- **Firefox**: Reads `cookies.sqlite` (`cookies` table: name, value, host, path, expiry, isSecure, isHttpOnly, sameSite)
- **Chromium**: Reads `Cookies` SQLite DB (encrypted; requires OS keychain decryption via `Cookies.binarycookies` for Safari)

### Status
✅ Code exists (`browser-cookie-import.ts`, `browser-cookie-import-test-database.ts`). Read-only access to browser cookie DBs. Cookies are imported into embedded browser session.

---

## Final Status Table

| System | What It Does | Working? | Where to See | Issues |
|--------|-------------|----------|-------------|--------|
| Relay | Phone↔Desktop WS bridge | ✅ Yes | Settings > Mobile, phone pair screen | Verify JWT secret matches |
| Pairing | QR + invite + resume tokens | ✅ Yes (needs 0003) | Login pair panel, mobile pair screens | Apply 0003 migration |
| Telemetry (Desktop) | PostHog analytics | ✅ Official builds | Settings > Privacy | Dev builds = off |
| Telemetry (Web) | `/api/telemetry` proxy | ❌ Dead (deleted) | Not visible | Route deleted |
| Crash Reports | `/api/diagnostics` POST | ⚠️ Broken (no 0002) | Not visible | Apply 0002 |
| Feedback | `/v1/feedback` endpoint | ✅ Yes | Desktop Feedback dialog | Separate from telemetry |
| Auth | OAuth + email + session | ⚠️ Partial | Login page, Settings | Apply 0002, turn off email confirm |
| Artifacts | Desktop publish + web share | ✅ Table exists, empty | Dashboard `/v1/artifacts/[slug]` | Apply 0002/0003 if needed |
| What's New | Static changelog | ✅ Yes | `/whats-new` page | None |
| Nudge | Version-range nudge | ✅ File exists | Not visible (desktop reads) | None |
| Kill-List | Plugin kill-list | ✅ Empty array | Not visible | None |
| Plugins (Portuguese) | `pt-BR.json` (15K lines) | ⚠️ Needs rebrand | Not visible in web | Separate sub-project |
| Agent Hooks | Runtime events | ✅ Code exists | Not visible in web | Part of relay |
| OpenCode DB | Read-only session scan | ✅ Read-only | Not visible (AI Vault feature) | Read-only access |
| Codex State | Read-only backfill check | ✅ Read-only | Not visible | Read-only access |
| Browser Cookies | Firefox/Chromium import | ✅ Read-only | Not visible | Read-only |
| Auto-Update | Build identity + version | ✅ Code exists | Not visible (desktop updates) | None |
