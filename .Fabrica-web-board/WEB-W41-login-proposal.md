# WEB-W41 — Unified Login / Auth Design Proposal

> **Status:** research proposal (read-only). No source files modified.
> **Scope:** cross-folder login/auth audit of `Fabrica-web`, `Fabrica-relay`,
> `Fabrica-app`, plus a comparison against the legacy
> `Fabrica-atlas/_sources/legacy-fabrica/frontend-next/app/` pages.
> **Goal:** recommend a single unified web `/login` UX that covers every
> auth flow the three repos need today, and a concrete spec for making
> the new `/login` look and flow like legacy-fabrica's `/oauth` page.

---

## 0. TL;DR

1. There are **three distinct identity flows** across the three repos,
   but only **two of them are human "logins"** — the third is
   machine-to-machine device authentication and is *not* a UI concern:
   - **Web dashboard sign-in** (human, browser, Supabase OAuth) — the
     only place a user types a credential.
   - **Desktop-app sign-in** (Electron, PKCE against the web's FABRICA
     Cloud auth endpoints, loopback callback) — same Supabase identity,
     different redirect target.
   - **Relay device pairing** (phone ↔ desktop, NaCl box + HMAC
     challenge-response via the relay WebSocket; invite tokens /
     device credentials) — **not a login**. No human credential, no
     UI, no signup. The relay trusts the Supabase access_token the
     desktop already obtained and the host keypair registered against
     that same Supabase user.
2. A **single web `/login` UI can serve (1) and (2) and *display*
   pairing material for (3)**, but (3) itself cannot be *completed* from
   the browser — the phone still must hold the relay WebSocket. The
   page should be a "single sign-in surface" plus a "pairing hub" panel,
   not a single monolithic form.
3. The new `/login` page should adopt legacy-fabrica's `/oauth` page
   pattern (light, centered SaaS-Gateway card, OAuth providers +
   email/recovery), but re-skinned onto the current Fabrica dark /
   copper palette. See §6 for the full spec and §6.0 for the DNA
   guardrails the implementation must protect.
4. **No relay-side login is needed and none should be built.** The
   relay's existing trust chain (Supabase JWT signature + host NaCl
   keypair + invite / device-credential tokens) already covers
   authorization. The only blockers are upstream: (a) the web
   `/login` must work end-to-end, (b) the web must expose
   `/v1/desktop/auth/*` so the desktop can complete PKCE, and (c)
   the Supabase GitHub / Google OAuth provider must be enabled in
   the Supabase project (G4-ENV). When those three land, the relay
   inherits the identity automatically with **zero relay code
   changes**.

---

## 1. Inventory: every distinct login/auth type per repo

### 1.1 Fabrica-web (Next.js landing app, `fabrica-ai.vercel.app`)

All routes live under `app/[locale]/login/` and `app/api/auth/`.

| Route | Method | Purpose | Wire shape |
|---|---|---|---|
| `app/[locale]/login/page.tsx` | client | Branded sign-in shell. Reads `access_token` / `refresh_token` from URL **fragment**, stores in `localStorage` under `fabrica_auth_tokens`, redirects to `/dashboard`. Supports error + verifying states. | `localStorage` key: `fabrica_auth_tokens` |
| `app/api/auth/authorize/route.ts` | `GET` | Browser-side OAuth start. `supabase.auth.signInWithOAuth({ provider: 'github' \| 'google' })`, then 302 to the provider. Accepts `?provider=`, `?locale=`, `?redirect_to=`. | Provider URL |
| `app/api/auth/authorize/route.ts` | `POST` | PKCE exchange — used by the **desktop app** (see §1.3). Body: `{ code, code_verifier }`. Calls `supabase.auth.exchangeCodeForSession()`. | `{ session, user }` |
| `app/api/auth/callback/route.ts` | `GET` | OAuth provider redirect. Exchanges `code` → session, then redirects to `${AUTH_REDIRECT_URL ?? /<locale>/login}` with tokens in **fragment** (`access_token`, `refresh_token`, `expires_at`, `user_id`, `email`). Preserves `state` query param (used by desktop for correlation). | URL fragment |
| `app/api/auth/session/route.ts` | `GET` | Server-side session check via `getUserFromRequest(req)` (reads `Authorization: Bearer <jwt>`). Returns `{ authenticated, userId, email }` or 401. | Bearer JWT |
| `app/api/auth/refresh/route.ts` | `POST` | Body `{ refresh_token }` → `supabase.auth.refreshSession()`. Returns `{ session, user }`. | JSON |
| `app/api/auth/logout/route.ts` | `POST` | Server-side `supabase.auth.admin.signOut(token)` + `getUserFromRequest` (no cookie clear; the client owns `localStorage`). | Bearer JWT |

**What it needs:** Supabase GitHub/Google OAuth for human users; PKCE
token exchange for the desktop; server-side session validation for any
future server components / API auth.

**How it should work (current contract):** The browser flow lands on
`/login`, OAuth starts via `/api/auth/authorize?locale=…`, the provider
hits `/api/auth/callback`, which returns a fragment-only redirect to
`/<locale>/login` carrying the access/refresh tokens. `/login` parses
the fragment, persists tokens to `localStorage`, and forwards to
`/dashboard`. The desktop's loopback callback path is supported via
`AUTH_REDIRECT_URL` + `state` (see §1.3 / §3.1).

**Gap:** there is no email/password, no signup, no password reset, no
recovery flow on the web today — only OAuth. Legacy-fabrica had all of
these (see §5). The web `/login` copy also only mentions GitHub
(`messages/en.json:891` `githubButton: "Sign in with GitHub"`), though
the authorize route already supports `google`.

### 1.2 Fabrica-relay (Cloudflare Workers, Hono + Durable Objects)

All routes in `src/director/index.ts` and `src/cell/index.ts`.

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `POST /v1/assign` (Director) | HTTP | `Authorization: Bearer <relayToken>` (HS256 JWT, secret `FABRICA_RELAY_JWT_SECRET`) + `CF-Connecting-IP` rate limit (10/min) | Host requests a Cell assignment → returns `{ v:1, cellUrl, assignmentEpoch, lease }`. The **relayToken is the Supabase access_token** (see §1.3 and `Fabrica-app/src/main/runtime/relay/supabase-session.ts:116`). |
| `POST /v1/resolve` (Director) | HTTP | `resumeToken` in JSON body `{ v:1, relayHostId, resumeToken }` | Phone resume recovery. Director proxies to the hub DO. |
| `WS /v1/host/control` (Cell DO) | WS | **Challenge-response**: `host-hello` → server sends `host-challenge` (NaCl box encrypted with host public key + 24-byte nonce, carrying a 32-byte HMAC secret + transcript binding `relayHostId`, `assignmentEpoch`, `previousGeneration`, `expiresAt`). Client replies `host-challenge-ack` with `proofB64 = HMAC-SHA256(secret, "FABRICA-relay-host-proof/v1\0ack\0" + transcript)`. Server validates with `timingSafeEqual`. | All subsequent control RPCs (`pong`, `auth-refresh`, `invite-create`, `device-credential-install`, `device-credential-install-status`, `device-revoke`, `device-resume-confirm`) require this authenticated socket. |
| `WS /v1/host/data/<connId>` (Cell DO) | WS | `host-data-auth` JSON message: `{ v:1, connTicket, generation }`. The `connTicket` was issued to the host on `conn-open`; `generation` must equal the host's current `runtime.stored.generation`. | Per-connection data channel; forwards frames verbatim between host and phone. |
| `WS /v1/connect/<relayHostId>` (Cell DO) | WS (phone leg) | First message: `relay-auth` with `credential` = invite token (base64url 32 bytes). Server replies `relay-hello` (ok:false 4429 on limit) and notifies host with `conn-open { connId, connTicket, kind:'invite', relayDeviceId, attachDeadlineMs:30000 }`. | Phone invites itself to a host. |
| `WS /v1/connect/<relayHostId>` (Cell DO, Director leg) | WS | First message is *not* `relay-auth` → server replies `relay-moved { v:1, cellUrl, assignmentEpoch }` (5s client timeout) so the phone re-dials the current Cell. | Invite recovery probe. |

**What it needs (relay-internal):**
- Host identity = NaCl **long-term host public key**, registered
  out-of-band (in the same Supabase user record; see §1.3).
- Phone identity = a per-pair **invite token** (single-use, 32-byte,
  24h lifetime, 16 attempts) or a **persistent device credential**
  installed via `device-credential-install` (stores
  `newResumeTokenHash`).
- Entitlement to the relay at all = a valid Supabase access_token
  (Bearer on `/v1/assign`). The app re-uses the same Supabase project
  as the web (see `Fabrica-app/.../supabase-session.ts:11-19`).
- Resume: a `resumeToken` (opaque, 32-byte) is presented to
  `/v1/resolve`; the host can also rebind the control socket using
  `controlResumeSecret` + `generation`.

**How it should work (semantic):** There is no "login form" at the
relay. The relay treats the *desktop* as the host (it already proved
possession of the host private key via the challenge-response) and the
*phone* as an unauthenticated peer carrying a credential issued by the
host. A user authenticates by completing the **web OAuth** so the
desktop has a Supabase access_token to present to `/v1/assign`.

> **No login is performed at the relay — and none should be built.**
> The relay's three "auth" surfaces are all *device authentication*,
> not human login: (a) the host's NaCl challenge-response proves it
> holds the private key bound to its Supabase user record (no
> password, no token from a human); (b) the phone's invite token or
> device credential is machine-issued by the host, never typed by
> anyone; (c) `/v1/assign`'s `Bearer <supabase_access_token>` is just
> the *same* Supabase token the desktop already got from the web
> OAuth flow. There is no relay-side signup, no relay-side
> password reset, no relay-side user record, and no relay UI.
> The only way to "unlock" the relay for a user is to complete the
> upstream web sign-in (and, for the desktop, to land the
> `/v1/desktop/auth/*` routes — see §3.1). When those land, the
> relay inherits identity automatically; no relay code change is
> required or desired.

### 1.3 Fabrica-app (Electron desktop)

The desktop's auth stack is split across several files in
`src/main/fabrica-profiles/` and `src/main/runtime/relay/`.

| Component | File | Role |
|---|---|---|
| PKCE OAuth (desktop sign-in) | `src/main/fabrica-profiles/profile-cloud-pkce.ts` | Generates `code_verifier` (32B) + `code_challenge` (S256) + `state` + `nonce`; opens `shell.openExternal(config.authorizeEndpoint)` in the system browser; spins up a loopback `http.createServer` on `127.0.0.1:0` and waits for `GET /auth/callback?code=…&state=…`. Returns `{ code, codeVerifier, nonce, redirectUri, state }` to the session-exchange step. |
| Auth config | `src/main/fabrica-profiles/profile-cloud-auth-config.ts` | Defaults: `apiBaseUrl = https://fabrica-ai.vercel.app`, `clientId = "FABRICA-desktop"`, scope `openid profile email offline_access`, `relayDirectorUrl = https://fabrica-relay.fabrica-relay.workers.dev`. Endpoints default to `${apiBaseUrl}/v1/desktop/auth/{authorize,session,refresh,capabilities,profile,org,logout,relay-token}`. |
| Session exchange | `profile-cloud-session-exchange.ts` + `profile-cloud-session-store.ts` | Exchanges the PKCE `{code, codeVerifier}` for tokens; persists. |
| Supabase fallback | `src/main/runtime/relay/supabase-session.ts` | Creates a Supabase JS client against the **same project** as the web (env: `SUPABASE_URL` / `SUPABASE_ANON_KEY`, fallbacks `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`); persists sessions to `<userData>/supabase-auth-storage.json` via a file storage adapter. `getRelayAuthToken(fallback)` → `supabase.access_token ?? fallback` (the fallback path exists for legacy FABRICA Cloud relay tokens). |
| Relay auth coordinator | `src/main/runtime/relay/relay-auth-coordinator.ts` | Reconciles a `RelayAuthContext { identity, accessToken, relayEntitled }` to a live `RelayBroker`. On every refresh the coordinator calls `getSupabaseAccessToken()` first; if present, that token is used as the relay JWT (returned to the broker's `refreshAccessToken` hook). |
| Relay control client | `src/main/runtime/relay/relay-control-client.ts` + `relay-host-proof.ts` | Performs the `host-hello` → `host-challenge` → `host-challenge-ack` flow using the host's tweetnacl keypair + `node:crypto` HMAC; receives `host-hello-ack`; maintains 15s `ping`/`pong`; sends `auth-refresh { relayJwt }` on token refresh. |
| Device pairing (relay-side) | `relay-control-requests.ts` `installCredential` + `createInvite` | Sends `invite-create` → receives `invite-created { inviteToken, expiresAt, maxAttempts }`; displays as QR (see `src/main/runtime/mobile-pairing-qr.test.ts` and `src/shared/pairing.ts` `encodePairingOffer`). |
| Mobile companion | `mobile/`, `src/main/ipc/mobile.ts`, `src/main/runtime/relay/mobile-relay-e2ee*.ts` | Phone uses the invite token as the `credential` field of `relay-auth` over the relay WebSocket. The same code path supports persistent device credentials installed by the host. |

**What it needs (desktop sign-in):**
- The desktop **does not** render its own login form. It opens
  `config.authorizeEndpoint` (the web's `https://fabrica-ai.vercel.app/v1/desktop/auth/authorize`)
  in the system browser, and the web is expected to run the full
  login → OAuth → callback → loopback handshake there.
- The web's `/v1/desktop/auth/*` routes **do not exist in
  Fabrica-web today** (only `/api/auth/*` does). The desktop's
  `authorizeEndpoint` will currently 404. This is a hard prerequisite
  before the desktop can sign in at all.

**How it should work (intended):** Human user installs the desktop →
clicks "Sign in" → desktop opens the web's FABRICA Cloud authorize
URL in the system browser (a web page that *looks like* the web
`/login`) → web runs the OAuth flow + desktop-specific extras
(identity, profile, org selection) → redirects to
`http://127.0.0.1:<port>/auth/callback?code=…&state=…` → desktop
exchanges the code for tokens → stores them → uses the Supabase
access_token as the relay JWT → connects to the relay.

---

## 2. How the three auth types are wired together

```
                          ┌──────────────────────────┐
   Human in browser ───▶  │  Fabrica-web /login      │  (Supabase GitHub OAuth)
                          │  /api/auth/authorize     │
                          │  /api/auth/callback      │
                          └─────────────┬────────────┘
                                        │ Supabase access_token (fragment)
                                        ▼
                          ┌──────────────────────────┐
                          │  Fabrica-web /dashboard  │  (SSR w/ Bearer JWT)
                          └──────────────────────────┘

                          ┌──────────────────────────┐
   Human + Desktop app ─▶  │  Fabrica-web             │  (system browser opens
                          │  /v1/desktop/auth/...    │   the web sign-in page)
                          │  (authorize, session,    │
                          │   refresh, relay-token)  │
                          └─────────────┬────────────┘
                                        │ loopback http://127.0.0.1:PORT/auth/callback?code=…&state=…
                                        ▼
                          ┌──────────────────────────┐
                          │  Fabrica-app main        │  (PKCE + supabase-session.ts)
                          │  profile-cloud-pkce.ts   │
                          └─────────────┬────────────┘
                                        │ Supabase access_token (via getRelayAuthToken)
                                        ▼
                          ┌──────────────────────────┐
                          │  Fabrica-relay           │  POST /v1/assign  Bearer <supabase_access_token>
                          │  Director                │  (HS256 verify, FABRICA_RELAY_JWT_SECRET)
                          └─────────────┬────────────┘
                                        │ { cellUrl, assignmentEpoch, lease }
                                        ▼
                          ┌──────────────────────────┐
                          │  Fabrica-app             │  WS /v1/host/control  (NaCl host-hello →
                          │  desktop-relay-service   │   host-challenge → host-challenge-ack;
                          │  relay-control-client.ts │   HMAC proof of host private key)
                          └─────────────┬────────────┘
                                        │ { conn-open, connTicket }   ▲
                                        ▼                             │ relay-auth { credential: inviteToken }
                          ┌──────────────────────────┐                │
                          │  Fabrica-relay Cell DO   │  ◀─────────────┘
                          │  WS /v1/connect/         │
                          │  <relayHostId>           │
                          └─────────────┬────────────┘
                                        │ conn-open { connId, connTicket, kind:'invite', … }
                                        ▼
                          ┌──────────────────────────┐
                          │  Fabrica-app             │  WS /v1/host/data/<connId>  host-data-auth
                          │  WS data channel         │
                          └─────────────┬────────────┘
                                        │ raw frames (E2EE)
                                        ▼
                          ┌──────────────────────────┐
                          │  Fabrica-app mobile/     │  (or third-party phone app)
                          │  Companion app           │
                          └──────────────────────────┘
```

**Key invariant:** the Supabase access_token is the *one* identity
token that crosses all three boundaries (web dashboard auth, desktop
PKCE auth, relay Bearer auth). This is by design
(`Fabrica-app/.../supabase-session.ts:11-19`: "Reuses the same
Supabase project as the Fabrica-web landing page so relay JWTs are
mutually valid.").

---

## 3. Recommended unified login architecture

### 3.1 The web must expose both auth surfaces

Today Fabrica-web only implements `/api/auth/*`. The desktop hard-codes
endpoints under `/v1/desktop/auth/*` in
`Fabrica-app/.../profile-cloud-auth-config.ts:96-118`. Before any
"unified /login" UX can land, the web must implement the desktop
routes too. Concretely:

| New route on Fabrica-web | Purpose | Reuses |
|---|---|---|
| `app/v1/desktop/auth/authorize/route.ts` | Start PKCE flow: forward to `/api/auth/authorize?provider=github\|google&redirect_to=<loopback>&state=<desktop_state>`. | `lib/supabase-auth.ts` |
| `app/v1/desktop/auth/session/route.ts` | Return the desktop's session (profile, orgs, capabilities) keyed by `Authorization: Bearer <supabase_access_token>`. | `lib/supabase-auth.ts#getUserFromRequest` + a new `lib/desktop-session.ts`. |
| `app/v1/desktop/auth/refresh/route.ts` | Refresh by Supabase refresh_token. | `app/api/auth/refresh/route.ts` |
| `app/v1/desktop/auth/capabilities/route.ts` | Return `relayEntitled`, feature flags, plan. | New — derived from Supabase user metadata + entitlements table. |
| `app/v1/desktop/auth/profile/route.ts` | Return / upsert desktop `local_profile_id`. | New. |
| `app/v1/desktop/auth/org/route.ts` | List / select organization. | New. |
| `app/v1/desktop/auth/logout/route.ts` | Server-side sign-out. | `app/api/auth/logout/route.ts` |
| `app/v1/desktop/auth/relay-token/route.ts` | Mint a relay JWT (the `relayToken` Bearer) — currently the app passes the Supabase access_token through, but a dedicated endpoint enables rotation, audience scoping, and audit logging. The relay validates via `FABRICA_RELAY_JWT_SECRET` (HS256) on `/v1/assign`, so this endpoint mints that same secret. | New — must share the secret with `Fabrica-relay`'s wrangler config. |

The desktop's `config.authorizeEndpoint` then resolves to a real
route, and the desktop's loopback callback is the *same* web
`/api/auth/callback` flow with `redirect_to=http://127.0.0.1:<port>/auth/callback&state=<desktop_state>` (the callback route already preserves `state` — `app/api/auth/callback/route.ts:57-59` — and
already honors `AUTH_REDIRECT_URL` — line 45).

### 3.2 A single web `/login` page that serves all three audiences

The page should be route-driven, not a hard-coded form. Three top-level
modes, switched by query string:

| `?intent=…` | Audience | Rendered UI |
|---|---|---|
| `?intent=web` (default) | Human in a browser opening `/login` directly | OAuth buttons (GitHub, Google) + optional "new here" copy. This is the current behavior. |
| `?intent=desktop` | Desktop opened the URL in the system browser via PKCE | **Same OAuth UI**, but on success the page redirects to the loopback `redirect_to` instead of `/dashboard`. Implemented by reading `?redirect_to=` (already passed by the desktop) and short-circuiting the `storeTokens()` → `router.replace('/dashboard')` step in `app/[locale]/login/page.tsx:75-80`. |
| `?intent=pair` | Human who already has a Supabase session and wants to **show a pairing code to a phone** | After the OAuth flow, render the "Pair a phone" panel: poll the host's last `invite-create` (via a new `app/v1/desktop/auth/invites/route.ts` proxy) and display the invite token as both a QR (use `qrcode` or `<svg>` of `encodePairingOffer` from `Fabrica-app/src/shared/pairing.ts`) and a copy-able 32-character code. The phone still dials the relay directly — the web is just a display surface. |

**Unified entry point on the desktop side:** the desktop's PKCE flow
should set `?intent=desktop&state=<desktop_state>&redirect_to=http://127.0.0.1:<port>/auth/callback` on the authorize URL. The web
`/login` page reads `intent` and `redirect_to` and behaves
accordingly. This keeps the desktop's "I'm opening the web" path
visually identical to the human's "I'm using the web" path — same
UI, same OAuth, same callback plumbing — while the redirect target
differs.

**Why a single page and not three:** the OAuth providers, locale
handling, error states, "new here" copy, fragment-pickup logic, and
`localStorage` `fabrica_auth_tokens` contract are *identical* across
audiences. Duplicating them in `/v1/desktop/auth/authorize` and
`/pair` would be a maintenance trap and would break the AGENTS.md
rule "one file = one writer".

### 3.3 What can and cannot be unified

> **Read the last four rows of this table as "device authentication,"
> not "login."** Web dashboard sign-in and Desktop PKCE sign-in are
> the only two *human* login flows; the relay challenge-response, the
> invite / device-credential handshake, and the resume / rebind path
> are machine-to-machine device authentication that happen *after* a
> human has already authenticated. They are correctly **not** unified
> into the web UI, and we should not try to — the browser is the wrong
> runtime for NaCl proofs and WebSocket-to-Durable-Object sessions. The
> point of this table is to draw that line explicitly so the page
> design doesn't pretend otherwise.

| Flow | Initiated from `/login`? | Completed from `/login`? |
|---|---|---|
| Web dashboard sign-in | **Yes** (default) | **Yes** |
| Desktop PKCE sign-in | **Yes** (system browser) | **Yes** (loopback captures the code; web just needs to honor `redirect_to` + `state`) |
| Phone relay pairing — *display* the invite | **Yes** (`?intent=pair`) | **No** — the phone must still open a WebSocket to `https://fabrica-relay.fabrica-relay.workers.dev/v1/connect/<relayHostId>` with `relay-auth { credential: <inviteToken> }`. The browser cannot do this. |
| Phone relay pairing — *complete* the connection | **No** | **No** (browser is not a relay client) |
| Relay challenge-response host proof | **No** | **No** (this is a desktop-only, NaCl-key, post-sign-in step) |
| Resume / rebind | **No** | **No** (lives in the relay `Cell` DO, triggered by the host/client on connection loss) |

So the honest answer to "can all login/auth flows be initiated from a
single UI" is: **all *human-facing* auth entry points, yes; the
device-to-device pairing handshake, no.** The page should be explicit
about this — the pairing panel should show a copyable code + a
download-the-mobile-app link, not pretend the browser can complete
the relay handshake.

### 3.4 Cross-cutting requirements the page must enforce

- **i18n parity.** `messages/en.json:887-899` defines the existing
  `login.*` keys (badge, title, lede, githubButton, newHere, signupNote,
  downloadLink, signingIn, errorTitle, errorBody, backHome). New keys
  for `?intent=desktop` and `?intent=pair` modes must mirror
  identically in `fr.json` and `ar.json` per the AGENTS.md
  "i18n parity" rule.
- **Locale preservation.** `startOAuth()` in
  `app/[locale]/login/page.tsx:115-117` already encodes `locale` into
  the authorize URL. The desktop's `?locale=` (if passed) must
  survive the loopback redirect, which it does because the callback
  echoes the locale into `/<locale>/login` (line 15, 22).
- **State preservation.** The callback already preserves `state`
  (line 57-59) so the desktop can correlate the code to its in-flight
  PKCE session.
- **No re-prompt for already-signed-in users.** Current behavior in
  `app/[locale]/login/page.tsx:97-105` skips the sign-in screen if
  `fabrica_auth_tokens` exists. Pair this with a server-side
  `app/api/auth/session` check so a user who is signed into the web
  but not the desktop still gets a clean handoff.
- **Tokens stay in the fragment.** The callback already does this
  (`app/api/auth/callback/route.ts:49-54`). Do not change to cookies
  unless we also change the storage contract on every client.

---

## 4. Migration risks and non-goals

- **Adding `/v1/desktop/auth/*` is breaking for the desktop** if the
  web's `AUTH_REDIRECT_URL` env is not set: the callback defaults to
  `/${locale}/login`, and the desktop's loopback server only listens
  on `127.0.0.1`. Therefore the desktop build must always set
  `AUTH_REDIRECT_URL` (or `FABRICA_CLOUD_AUTH_URL`) and the web must
  honor it without scoping the token to the loopback origin. The
  fragment-redirect already does this correctly.
- **Single Supabase project** is a load-bearing assumption. Touching
  the env vars in `Fabrica-app/.../supabase-session.ts:17-19` would
  silently break the relay.
- **Legacy fallback `FABRICA Cloud relay token`** in
  `getRelayAuthToken()` exists; it must be kept until the FABRICA
  Cloud `relayToken` endpoint is live, otherwise the desktop loses
  the ability to register hosts.
- **Multi-tenant / org selection** is a desktop-side flow that the web
  must surface *somewhere*. The cleanest place is a post-OAuth web
  page (similar to legacy `/onboard`) that picks the org and stores
  the choice, after which the desktop picks it up via
  `profileEndpoint` / `orgEndpoint`. This proposal does not change
  `/onboard` semantics — it just argues the same onboarding card
  should be reachable after OAuth for both `?intent=web` and
  `?intent=desktop` paths.
- **Do NOT add new dependencies** (per AGENTS.md) — use the existing
  Supabase client, `lucide-react` icons, and shadcn/ui `Badge` and
  `Button`. QR rendering can be done inline as SVG (matching the
  existing inline-SVG OAuth icons in legacy `/oauth`).

---

## 5. Comparison with legacy-fabrica frontend-next

Files reviewed:
- `Fabrica-atlas/_sources/legacy-fabrica/frontend-next/app/page.tsx`
  (marketing landing — uses `FabricaLogo`, copper `#CC7A4A`, light
  background `#FAF9F6`, `Inter` font, the "Fab<span style="color:#CC7A4A">.</span>." wordmark).
- `Fabrica-atlas/_sources/legacy-fabrica/frontend-next/app/oauth/page.tsx` (the legacy equivalent of `/login`).
- `Fabrica-atlas/_sources/legacy-fabrica/frontend-next/app/onboard/page.tsx` (post-auth profile + plan).
- `Fabrica-atlas/_sources/legacy-fabrica/frontend-next/app/dashboard/page.tsx` (authenticated app).
- `Fabrica-atlas/_sources/legacy-fabrica/frontend-next/components/auth/supabase` (referenced from `oauth/page.tsx:6` and `onboard/page.tsx:6` — Supabase client, not currently shipped in the new web).

### 5.1 What legacy `/oauth` actually did

`oauth/page.tsx` is the closest analog to today's
`app/[locale]/login/page.tsx`. Key structural points:

- **Layout:** centered 420 px card on a 3-panel blurred dashboard
  mock background (`#FAF9F6` page, blurred mock behind). The
  background mock is `position:absolute, opacity:0.8, filter:blur(3px)`.
- **Header:** `fabrica-logo-2d.jpg` 52×52, then
  `Fabrica<span style="color:#CC7A4A">.</span> SaaS Gateway` H1
  (font-weight 900, letter-spacing -0.03em, color `#1C1C1E`), subtitle
  "Secure multi-tenant workspace registry".
- **OAuth providers** (in order):
  1. **Continue with Google** (white card, brand-colored inline SVG, `border:1px solid #cbd5e1`, `border-radius:8px`, padding `10px 16px`, font 12px / 700).
  2. **Continue with GitHub** (black `#1C1C1E` filled, white text, inline SVG).
  3. **Continue with Facebook** (blue `#1877F2` filled, white text, inline SVG).
- **Divider** "or use email auth" with 1px slate lines either side, 9px uppercase tracking.
- **Email form** with a `Sign In` / `Sign Up (New Tenant)` pill toggle (black filled when active, transparent outline otherwise). Fields: Email Address + Password (with "Forgot Password?" link in copper).
- **Recovery flow** toggles the whole body into "🔑 Reset Password" → form → success toast; or `?recovery=true` / `#type=recovery` toggles to "🔒 Password Recovery" new-password form.
- **Footer:** `← Return to Landing Page` (left) + `v1.0.0 (Production)` (right) on `#fafafa` strip, 1px top border.
- **Toast:** bottom-right, green/blue/red pill, slide-in 200 ms, dismiss `✕`.
- **Loading shell:** centered spinner (40 px, copper border-top), "Syncing Security Session..." uppercase 10px copper label.
- **Background treatment:** the blurred dashboard mock is intentional — it sells the "after you sign in this is what you get" story. The blurred mock is purely decorative (`pointer-events:none`).

### 5.2 What the new `/login` already does

`app/[locale]/login/page.tsx` (225 lines):

- **Layout:** centered column on a **dark** radial-gradient page (`from-orange-600/15 via-orange-950/10 to-transparent`). No background mock. Copper-amber palette (`#E8590C` → `#FF8A3D` gradient button, copper/amber `Badge`).
- **Header:** `Badge variant="copper-outline"` with `fabrica-logo_icon.svg` 5×5 + uppercase mono "FABRICA ACCESS" text.
- **Single CTA:** one full-width gradient button "Sign in with GitHub" with `Github` + `ArrowRight` icons.
- **Footer:** "New here?" copy with a "Download the app" link to `/download`.
- **States:** `idle` / `verifying` (loader + "Signing you in...") / `error` (red `AlertTriangle` icon + retry/back buttons). The error and verifying states share the dark shell.
- **Token contract:** URL fragment → `localStorage["fabrica_auth_tokens"]` → `router.replace('/dashboard')`.

### 5.3 Gaps between the two

| Dimension | Legacy `/oauth` | New `/login` | Verdict |
|---|---|---|---|
| Brand color | `#CC7A4A` (warm copper) on `#FAF9F6` (warm white) | `#E8590C`/`#FF8A3D` on `[var(--surface-page)]` (dark) | Different palette + light vs dark. Acceptable — new brand is forge/dark. Reuse copper accent for buttons, borders, focus rings. |
| Logo | `fabrica-logo-2d.jpg` 52px (full mark) | `fabrica-logo_icon.svg` 5×5 inside a Badge (icon-only) | New should add a full-mark variant for the top of the card, keeping the icon-only badge if used elsewhere. |
| Wordmark | "Fabrica." with copper dot | None (badge text "FABRICA ACCESS" only) | New should add a small "Fabrica<span class="text-orange-400">.</span>" wordmark above the title. |
| Providers | Google + GitHub + Facebook | GitHub only (`githubButton`), though `authorize` route also supports `google` | **Add Google button** to match legacy and the existing backend capability. Drop Facebook (it was a legacy-only provider not wired to the new Supabase project). |
| Email/password | Yes (Sign In / Sign Up toggle) | **No** | **Add an email/password form below the OAuth divider** to match legacy, gated behind Supabase `signInWithPassword` and `signUp`. |
| Password recovery | Yes (`isForgotPassword` + `isRecoveryMode`) | **No** | **Add a "Forgot password?" link** that calls `supabase.auth.resetPasswordForEmail` with `redirectTo = ${origin}/${locale}/login?recovery=true`. `/login` then renders the new-password form. |
| Background story | Blurred dashboard mock (sells "what's next") | None | Optional. Replicate if the new `/login` should pre-sell the dashboard, but keep `pointer-events:none` and `aria-hidden`. |
| Footer | "← Return to Landing Page" + "v1.0.0 (Production)" | "New here?" + "Download the app" link | **Combine**: keep the download CTA (it's a real differentiator for Fabrica, which is a desktop app) and add a "← Back to home" link on the left, matching legacy's two-sided footer. |
| Toast system | Bottom-right slide-in (green/blue/red), 200 ms `slideIn` keyframe | None — only a full-page error state | **Add a reusable toast** for OAuth flow errors and recovery-success. Today the page throws the user into a full red error screen for any failure, which is jarring for transient errors (e.g. user closed the popup). |
| Loading shell | 40 px spinner, "Syncing Security Session…" | `Loader2` from lucide, "Signing you in…" | Equivalent. Keep the new copy. |
| Locale | No locale switcher in `oauth/page.tsx`; the page relies on route prefix | `[locale]` segment + `useLocale()` | Keep the new locale model — it's strictly better. |
| Token storage | `localStorage["fabrica_sandbox_user"]` mock + Supabase `getSession()` | `localStorage["fabrica_auth_tokens"]` from URL fragment | The new contract is *cleaner* (no sandbox mode). Keep it. |
| Session resume on page load | `supabase.auth.getSession()` + `onAuthStateChange` | localStorage check + `router.replace('/dashboard')` | Both work; the new one is sufficient. |
| `?intent=pair` (proposed) | n/a | n/a | This is **new** — legacy didn't have relay pairing on the web. |

### 5.4 What to replicate (concrete, line-referenced)

- **Layout:** centered 420 px card on a full-viewport background
  (dark, copper radial). Replicate the card's three zones — header /
  body / footer — exactly as in `oauth/page.tsx:447-489` (header),
  `oauth/page.tsx:492-882` (body), `oauth/page.tsx:885-898` (footer).
- **Card chrome:** white (or, in dark mode, `var(--overlay-5)`) card,
  `border:1px solid var(--border-subtle)`, `border-radius:16px`,
  shadow `0 20px 40px rgba(0,0,0,0.05)` — keep the current Tailwind
  tokens; just adopt the three-zone structure.
- **Header:** logo + wordmark + subtitle. Use the existing
  `fabrica-logo_icon.svg` for the icon and a new inline SVG (or the
  existing `fabrica-logo-2d.jpg` if asset) for the full mark. Wordmark
  "Fabrica<span class=\"text-orange-400\">.</span>" with `font-weight:900` and
  `letter-spacing:-0.03em`. Subtitle: "Secure multi-tenant workspace
  registry" (or rebrand-localized equivalent — needs a marketing-grounded
  string; see `messages/en.json:887-899`).
- **Provider buttons:** copy `oauth/page.tsx:642-723` row for row:
  1. **Continue with Google** — white card, brand SVG, `border:1px solid var(--border-subtle)`, `border-radius:8px`, padding `10px 16px`, text `#1C1C1E` 12px / 700. Use the same Google SVG.
  2. **Continue with GitHub** — filled dark `#1C1C1E` (or `bg-zinc-900` in Tailwind), white text, GitHub SVG, `border-radius:8px`. Use the same GitHub SVG.
  3. **Drop Facebook.** It's not in the new Supabase project's provider list and the current `/api/auth/authorize` only handles `github | google`.
- **Divider:** "or use email auth" with 1px lines either side, 9px
  uppercase tracking, `color: var(--text-muted)`. (Legacy uses `#64748b`
  on `#e2e8f0` lines; map to `var(--text-muted)` / `var(--border-subtle)`.)
- **Email form:** Sign In / Sign Up pill toggle (filled when active,
  outline when not), 10.5px / 700, `border-radius:4px`. Replicate
  `oauth/page.tsx:732-769`. Fields use `border:1px solid var(--border-subtle)`,
  `border-radius:6px`, padding `8px 12px`, text 11px.
- **Forgot password link:** "Forgot Password?" in copper/orange,
  `text-decoration:underline`, sitting right-aligned above the password
  input. Replicate `oauth/page.tsx:794-815`.
- **Recovery flows:** two extra card states triggered by `?recovery=true`
  or fragment `type=recovery`:
  1. **Reset Password** (`oauth/page.tsx:567-638`): a copper-tinted
     info banner with "🔑 Reset Password" label, email input,
     "Send Recovery Link ➔" CTA.
  2. **New Password** (`oauth/page.tsx:494-565`): "🔒 Password Recovery"
     banner, single new-password input, "Save New Password & Log In ➔" CTA.
- **Submit buttons:** copper-filled (`#CC7A4A` in legacy; `from-[#E8590C] to-[#FF8A3D]` in the new palette), 11px / 800, uppercase, 0.04em letter-spacing, `border-radius:6px` (or 8px to match the OAuth buttons).
- **Card footer strip:** `#fafafa` (or `var(--overlay-5)` in dark), 1px top border, padding `16px 24px`, two-sided: "← Return to Landing Page" left, "v1.0.0 (Production)" right. Replicate `oauth/page.tsx:885-898`. In the new design, keep the "New here? Download the app" CTA on the right (it's a stronger differentiator than the version string) and put the "← Back to home" link on the left.
- **Toast system:** bottom-right slide-in, 11px / 700, green/blue/red. Replicate `oauth/page.tsx:902-929` and the `slideIn` keyframe `oauth/page.tsx:931-937`. **Add this to the new design** — it makes recovery and OAuth errors feel light instead of catastrophic.
- **Loading shell:** 40 px spinner, copper-tinted border, uppercase 10px copper label. Replicate `oauth/page.tsx:397-429`. Replace the label text with the new "Signing you in…" / "Connecting…" per state.

### 5.5 What to *not* replicate

- **The inline `<style dangerouslySetInnerHTML>` blocks** and per-element
  `style={{…}}` objects in legacy. The new design uses Tailwind v4 +
  CSS variables (`var(--surface-page)`, `var(--text-strong)`,
  `var(--border-subtle)`, `var(--overlay-5)`, `var(--text-muted)`); a
  per-element rewrite is necessary but the *visual targets* from §5.4
  are what to copy.
- **The "Sandbox User" mock** (`oauth/page.tsx:110-117, 270-289`). The
  new design has no sandbox mode; sign-in either succeeds against
  Supabase or shows an error.
- **The Stripe checkout overlay and onboarding steps** in
  `onboard/page.tsx` (lines 8, 85, 773-1019). Those are *post*-auth
  flows and out of scope for `/login`. Onboarding should remain a
  separate route (`/onboard` in the new design or a wizard inside
  `/dashboard`).
- **The legacy Spanish/German/etc. landing-page in-file translation
  blocks** (`page.tsx:91-202, 262-341, etc.`). The new design
  externalizes to `messages/{en,fr,ar}.json`; the new `/login` should
  add the new keys there, not inline.
- **The blurred dashboard mock** in `oauth/page.tsx:8-118`. It is a
  nice-to-have but it duplicates the marketing landing's value prop.
  Decision: skip it on `/login`; the marketing `/` page already
  carries the "what is Fabrica" load. Keep the option open to
  re-introduce a tasteful static background later.

---

## 6. Spec — making the new `/login` look and flow like legacy

> **Status:** proposal. Implement in a follow-up task; this task is
> read-only.

### 6.0 DNA preservation — guardrails the implementation must protect

The login page is a high-traffic, high-leverage surface and the first
thing a new user sees of the brand. It must not drift Fabrica's
identity. This section grounds the spec in
`.Fabrica-Board/Fabrica-DNA.md` (mission, vision, values, anti-goals)
and `Fabrica-web/AGENTS.md` (tech stack, conventions, DoD). The
implementer and the reviewer must clear **every** checkbox in §6.0.3
before merging the login change.

#### 6.0.1 The guardrails (what the page must do)

1. **Dark / copper forge palette — no light surface.** Use the
   existing Tailwind v4 tokens and CSS variables (`#E8590C` /
   `#FF8A3D` gradient, `var(--surface-page)`, `var(--border-subtle)`,
   `var(--text-strong)`, `var(--text-muted)`, `var(--overlay-5)`,
   `var(--border-faint)`). Legacy-fabrica's light `#FAF9F6` page and
   the blurred dashboard mock are **not** reproduced. The card may
   darken to `bg-zinc-900/80 backdrop-blur` for the three-zone
   structure, but the page stays dark. (See §6.2 card chrome.)
2. **Local-first framing.** The desktop is local-first (DNA Values:
   "Your data, your agents, your machine. No cloud dependency.").
   Copy on the web login must not imply cloud lock-in. The
   Supabase identity exists to give the *user* a portable account
   that unlocks the web dashboard, the desktop, and the relay — not
   to anchor them. No "your data in our cloud" framing.
3. **Business-first language.** The audience is non-technical
   founders and operators (DNA Mission: "non-technical founders to
   build and run AI-powered businesses"). No developer jargon in
   user-facing copy. "PKCE", "OAuth scope", "access token", "JWT",
   "id_token" never appear in user-facing strings. Recovery flow
   says "Forgot your password?", not "Reset your credential."
4. **Universal control surface.** Everything the user needs to sign
   in is in the page UI. No CLI steps ("run `fabrica auth login`"),
   no developer console, no "paste this token here", no test-mode
   toggles, no raw JSON viewers. (DNA Anti-Goals: "Never ship
   features that require CLI or code to use.")
5. **Server Components by default.** `app/[locale]/login/page.tsx`
   stays a `'use client'` component only where it must
   (OAuth start, URL-fragment parsing, `?intent` routing, token
   persistence). Anything that can be server-rendered (the card
   chrome, the providers list, the recovery form's static markup)
   moves to a server component. (AGENTS.md: "Server Components by
   default — only add 'use client' when truly needed.")
6. **next-intl i18n parity.** Every new key added in
   `messages/en.json` is mirrored in `messages/fr.json` and
   `messages/ar.json` with identical structure. No hardcoded
   English in JSX. Locale is preserved across the OAuth round-trip
   (the callback echoes the locale into `/{locale}/login`; the
   desktop's `?locale=` survives the loopback redirect). The
   Arabic layout must be tested — the card and the provider buttons
   must remain correct under `dir="rtl"`.
7. **No new dependencies.** Use the existing Supabase client,
   `lucide-react` icons, shadcn/ui `Badge` / `Button`,
   `AnimatedThemeToggler`, and Tailwind v4 tokens. QR rendering
   for the pair panel is done **inline as SVG** (mirror the
   existing inline-SVG OAuth icons in legacy `/oauth`); do **not**
   add `qrcode` or any new package. (AGENTS.md: "Do NOT add new
   dependencies without explicit instruction.")
8. **No Orca / Stably / `saas-landing-page` branding.** Page meta
   (`<title>`, `<meta name="description">`, OG tags, structured
   data), footers, and error toasts all say **Fabrica** with the
   copper-dot wordmark `Fab<span class="text-orange-400">.</span>`.
   No legacy string slips in. (AGENTS.md: "No Orca/Stably
   branding in page copy or meta tags.")
9. **App ID + deep link contract.** The desktop's loopback callback
   is constructed in the context of App ID `ai.autoscalers.fabrica`
   (DNA App ID table). The mobile deep link for the pair panel is
   `fabrica://pair?token=<inviteToken>` (DNA Deep link protocol).
   The desktop's `state` correlation, the `redirect_to`, and the
   invite QR all use these canonical identifiers — no ad-hoc
   strings.
10. **Transparency in loading and error.** The page must never throw
    the user into a dead end. Every async state has a visible
    spinner + copy. Every failure has a recoverable path
    (transient → bottom-right toast, catastrophic → full state with
    retry). No silent failures, no bare `console.error`, no infinite
    spinners. (DNA Value: "Transparency — You see what agents do,
    why they do it, and can intervene anytime.")
11. **Copy grounded in the three marketing files.** Every new
    user-facing string on the login page (the badge, the title, the
    lede, the provider button labels, the email-form labels, the
    recovery flow copy, the pair panel copy, the footer, the
    toasts) traces to one of the three internal marketing files in
    `_sources/`: `brand-guidelines`, `positioning-statement`,
    `competitor-landscape`. (AGENTS.md Definition of Done: "Copy
    grounding: every landing-page string traces to one of the 3
    internal marketing files.")
12. **No telemetry without consent.** PostHog (per DNA
    Infrastructure table, owned by Fabrica-app) only fires after
    explicit opt-in. The login page must **not** phone home before
    the user signs in. No pre-auth analytics, no A/B-test beacons,
    no third-party scripts loaded on the login page.

#### 6.0.2 The anti-goals the page must NOT violate

Mirroring `.Fabrica-Board/Fabrica-DNA.md` §"Anti-Goals":

- The login page must **not** require cloud connectivity to *use
  Fabrica itself*. The desktop is local-first; the web login is
  only for the web dashboard, and signing out of the web must not
  break the desktop. The two products are independent.
- The login page must **not** sell user data or metadata. The
  Supabase user record is owned by the user; the page makes no
  claim on it beyond authentication.
- The login page must **not** build a walled garden. The identity
  is a portable Supabase user record; the OAuth provider list is
  open (GitHub + Google today, any OIDC provider in principle); no
  proprietary lock-in.
- The login page must **not** optimize for developer ergonomics at
  the expense of business-user UX. No "test mode" toggles, no
  scope-explainer UI, no raw JSON. The user is a founder, not an
  engineer.
- The login page must **not** require CLI or code. Everything is
  in the page. The desktop's "Sign in" button opens the web page in
  the system browser; the user clicks through; that's it.

#### 6.0.3 Pre-merge checklist

The implementer and the reviewer run this before merging the login
change:

- [ ] Every new i18n key is present in `messages/en.json`,
  `messages/fr.json`, `messages/ar.json` with identical structure
  (no missing translations, no hardcoded English in JSX).
- [ ] `npm run lint` and `npm run build` both pass clean from
  `Fabrica-web/`.
- [ ] No `Orca`, `Stably`, `stablyai`, or `saas-landing-page`
  strings in the diff (grep the changed files).
- [ ] No new entries in `dependencies` or `devDependencies` in
  `package.json`.
- [ ] Page tested in dark mode (the only mode — the page must not
  ship a light surface or a theme toggle on the login screen).
- [ ] No raw `<style dangerouslySetInnerHTML>` blocks and no
  per-element `style={{…}}` objects in the login component (use
  Tailwind v4 + the existing CSS variables).
- [ ] App ID `ai.autoscalers.fabrica` referenced where the desktop
  loopback callback is constructed
  (`Fabrica-app/.../profile-cloud-auth-config.ts` and the new
  `app/v1/desktop/auth/authorize/route.ts`).
- [ ] Mobile deep link `fabrica://pair?token=…` used for the pair
  panel.
- [ ] Locale survives the OAuth round-trip (test by triggering
  `?locale=ar` and confirming the callback returns to `/ar/login`).
- [ ] Arabic RTL layout renders correctly (card centered, provider
  buttons right-aligned, divider mirrored).
- [ ] All user-facing copy traces to one of the three marketing
  files in `_sources/`
  (`brand-guidelines`, `positioning-statement`,
  `competitor-landscape`).
- [ ] No silent failures — every `await` has a visible loading or
  error state; every OAuth error renders a recoverable toast (not
  a full-page red screen for transient failures).
- [ ] No pre-auth analytics or third-party scripts on the login
  page (PostHog only fires after the user signs in, per DNA).
- [ ] No relay-side login surface was added
  (the relay has no login form, by design — see §1.2 and the
  TL;DR).

### 6.1 URL contract

| URL | Renders | Auth state |
|---|---|---|
| `/{locale}/login` | Default sign-in (web audience) | Not signed in |
| `/{locale}/login?intent=desktop&redirect_to=…&state=…&locale=…` | Same UI; on success, redirect to `redirect_to` instead of `/dashboard`; preserve `state` | Not signed in |
| `/{locale}/login?intent=pair` | After sign-in, show the "Pair a phone" panel (QR + copy code) | **Required** signed in (Supabase session) |
| `/{locale}/login?recovery=true` *or* fragment `type=recovery` | "New Password" form | Recovery flow |
| `/{locale}/login?error=…&error_description=…` | Sign-in card with a red toast (not a full-page error screen) | Not signed in |
| `/{locale}/login` (already signed in, no `intent=pair`) | `router.replace('/dashboard')` — keep current behavior | Signed in |

All keys used here must be added to `messages/{en,fr,ar}.json` under
`login.*` and mirrored.

### 6.2 Layout (top to bottom)

1. **Backdrop:** full-viewport dark surface, copper radial gradient (keep `app/[locale]/login/page.tsx:174-176`).
2. **Card** (centered, max-width 420 px, `border:1px solid var(--border-subtle)`, `border-radius:16px`, shadow `0 20px 40px rgba(0,0,0,0.5)` on dark; or `0 20px 40px rgba(0,0,0,0.05)` if the card flips to white in light mode). Three zones:
   - **Header** (`padding:28px 24px 20px`): centered logo (icon-only 52×52 inside a 1px border card with shadow), wordmark H1 `Fabrica<span class="text-orange-400">.</span>` (font-weight 900, letter-spacing -0.03em), subtitle "Secure multi-tenant workspace registry" (or marketing-grounded equivalent).
   - **Body** (`padding:28px 24px`, `gap:14px`): OAuth provider stack → "or use email auth" divider → email form (Sign In / Sign Up toggle, Email, Password, Forgot Password? link, copper submit button).
   - **Footer** (`background:var(--overlay-5)`, `border-top:1px solid var(--border-faint)`, `padding:16px 24px`): two-sided — left "← Return to Landing Page" (`Link href="/"`), right "New here? Download the app →" (`Link href="/download"`).
3. **Toast layer** (fixed, bottom-right, slide-in 200 ms): reuse for OAuth error, recovery success, network errors.

### 6.3 Behavior matrix

| Trigger | Action | Source file:line |
|---|---|---|
| Page load, `?intent` is `desktop`, and URL fragment has tokens | Store tokens in `localStorage["fabrica_auth_tokens"]`, then `window.location.replace(redirect_to)` (NOT `router.replace('/dashboard')`). Preserve `state` in a final `?state=…` query. | `app/[locale]/login/page.tsx:75-80` — branch on `intent`. |
| Page load, signed in (`fabrica_auth_tokens` present), and `intent` is not `pair` | `router.replace('/dashboard')` | unchanged |
| Page load, signed in, `intent === 'pair'` | Render the "Pair a phone" panel; do **not** redirect | new |
| Click "Continue with GitHub" / "Continue with Google" | `window.location.href = '/api/auth/authorize?provider=<p>&locale=<l>&redirect_to=<…>'` (already done at line 116; add `redirect_to` echo) | `app/[locale]/login/page.tsx:115-117` |
| Email Sign In submit | `supabase.auth.signInWithPassword({ email, password })` (new — requires `lib/supabase-auth.ts` to expose the browser client, not just the server anon client) | new — mirror `oauth/page.tsx:254-264` |
| Email Sign Up submit | `supabase.auth.signUp({ email, password })` | new — mirror `oauth/page.tsx:242-252` |
| Forgot password? click | Switch card to "Reset Password" form; submit calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: origin + '/<locale>/login?recovery=true' })`; success toast "Password recovery email sent!" | new — mirror `oauth/page.tsx:292-313, 567-638` |
| `?recovery=true` or fragment `type=recovery` on page load | Switch card to "New Password" form; submit calls `supabase.auth.updateUser({ password: newPassword })`; on success set `fabrica_auth_tokens` and `router.replace('/dashboard')` | new — mirror `oauth/page.tsx:315-340, 494-565` |
| OAuth error lands via fragment or query | Show a **toast** (red, "GitHub sign-in didn't complete. Please try again."), do **not** throw the user into a full red error screen. Keep the full-screen error state for catastrophic failures (Supabase not configured, network down) only. | refactor of `app/[locale]/login/page.tsx:83-95, 134-170` |
| Pair panel: render invite | Call `GET /v1/desktop/auth/invites?relayHostId=…` (new route) → render `inviteToken` as inline-SVG QR (use a tiny inline QR encoder; do not add a dep) + a copyable `<code>` block + a deep link `fabrica://pair?token=<inviteToken>` for the mobile companion. Do **not** attempt to complete the relay handshake from the browser. | new panel |

### 6.4 State machine

```
       (no tokens)           ?error / ?recovery / ?intent=pair
            │                          │
            ▼                          ▼
        ┌─────────┐  OAuth finish   ┌──────────────────────┐
        │  Idle   │ ──────────────▶ │ Verifying (spinner)  │
        │ (card)  │                 └──────────┬───────────┘
        └────┬────┘                            │ storeTokens
             │  ?intent=pair, signed in        ▼
             │  ┌──────────────────────┐   ┌──────────────┐
             ├─▶│  Pair panel          │   │ /dashboard   │
             │  │  (QR + copy code)    │   │ or redirect_to│
             │  └──────────────────────┘   └──────────────┘
             │  ?recovery=true
             ▼
        ┌──────────────┐   submit
        │ New Password │ ─────────▶ updateUser() → /dashboard
        └──────────────┘
             │  Forgot? click
             ▼
        ┌──────────────┐   submit
        │ Reset Password│ ─────────▶ resetPasswordForEmail() → toast
        └──────────────┘
             │  OAuth error
             ▼
        ┌──────────────┐
        │ Idle + toast │ (no full-page error for transient failures)
        └──────────────┘
```

### 6.5 Assets and i18n

- Reuse `/public/fabrica-logo_icon.svg` (already in use).
- If the wordmark/full-mark PNG is needed, prefer an inline SVG
  match to the copper-dot wordmark. **Do not** add a new dependency.
- New i18n keys (proposed; copy must be grounded in the three
  marketing files `brand-guidelines`, `positioning-statement`,
  `competitor-landscape` before landing):
  - `login.providers.google`: "Continue with Google"
  - `login.providers.github`: "Continue with GitHub"
  - `login.email.heading`: "or use email auth"
  - `login.email.tab.signIn`: "Sign In"
  - `login.email.tab.signUp`: "Sign Up (New Tenant)"
  - `login.email.emailLabel`: "Email Address"
  - `login.email.passwordLabel`: "Password"
  - `login.email.forgotLink`: "Forgot Password?"
  - `login.email.signInSubmit`: "Secure Authenticate Session →"
  - `login.email.signUpSubmit`: "Create Isolated Tenant →"
  - `login.recovery.heading`: "🔑 Reset Password"
  - `login.recovery.body`: "Enter your email to receive a secure recovery link."
  - `login.recovery.submit`: "Send Recovery Link →"
  - `login.recovery.newHeading`: "🔒 Password Recovery"
  - `login.recovery.newBody`: "Enter a secure, robust new password to finalize authentication with your account."
  - `login.recovery.newSubmit`: "Save New Password & Log In →"
  - `login.pair.title`: "Pair a phone"
  - `login.pair.subtitle`: "Scan this code in the Fabrica mobile app, or copy it manually."
  - `login.pair.copyCode`: "Copy code"
  - `login.pair.openApp`: "Open in mobile app"
  - `login.pair.waiting`: "Waiting for phone to connect…"
  - `login.footer.backHome`: "← Return to Landing Page"
  - `login.footer.newHere`: "New here?"
  - `login.footer.signupNote`: "Your Fabrica account is created automatically when you sign in with GitHub. Download the app to run your first crew."
  - `login.footer.downloadLink`: "Download the app"
  - `login.toast.signedIn`: "Securely authenticated! Redirecting…"
  - `login.toast.signedUp`: "Account created successfully! Redirecting to setup…"
  - `login.toast.recoverySent`: "Password recovery email sent! Check your inbox."
  - `login.toast.recoverySuccess`: "Password reset successful! You are now logged in."
  - `login.toast.oauthError`: "OAuth login failed: {message}"
  - `login.loading.signingIn`: "Signing you in…"
  - `login.loading.connecting`: "Connecting…"

  All keys must appear in `en.json`, `fr.json`, `ar.json` with
  identical structure (AGENTS.md i18n parity rule).

### 6.6 Out of scope for this proposal

- Implementing the actual `/v1/desktop/auth/*` routes (this is a
  prerequisite tracked under a separate task — see §3.1).
- Migrating the legacy-fabrica `oauth/page.tsx` *code* (it's a
  frozen reference copy under `_sources/`; we copy the *visual
  spec*, not the implementation).
- Changing the Supabase project, providers, or env var contract.
- Adding new dependencies (`qrcode`, etc.). Use inline SVG.
- Onboarding wizard / Stripe / plan selection — those live in
  `onboard/page.tsx` and remain a separate flow.
- Phone-side WebSocket client changes. The web is a display surface
  only for invite tokens.

---

## 7. Open questions / decisions for the orchestrator

1. **Should the new `/login` add email/password + recovery, or stay OAuth-only?**
   The new design has been OAuth-only so far; legacy-fabrica had both.
   Recommendation: add both, gated behind the same Supabase project
   (no new dependency). The cost is a single new client-side
   `signInWithPassword` / `signUp` / `resetPasswordForEmail` /
   `updateUser` call surface; the upside is feature parity with
   legacy and a lower support load (password recovery is the #1
   support ticket for any SaaS).
2. **Where does the FABRICA Cloud `/v1/desktop/auth/*` work live?**
   It's a prerequisite for the desktop to sign in at all. The cleanest
   split is to land it in its own task (a new `app/v1/desktop/auth/*`
   tree in `Fabrica-web`) and have *this* task consume the `redirect_to`
   + `state` plumbing that's already in `app/api/auth/callback/route.ts`.
3. **Pair panel: server-rendered or client-only?**
   The invite token is generated by the desktop and stored on the
   relay Cell DO; surfacing it to the web requires either (a) the
   desktop POSTs the latest invite to a new web endpoint, or (b) the
   web polls the relay directly. (a) is simpler and respects the
   relay's existing "desktop is the source of truth for invites"
   invariant. Recommendation: (a) with a new
   `app/v1/desktop/auth/invites/route.ts`.
4. **Should the page stay dark, or follow legacy's light surface?**
   Recommendation: stay dark (matches the new forge/copper brand and
   `app/[locale]/login/page.tsx:174`), but re-skin the card to a
   copper-tinted dark (`bg-zinc-900/80 backdrop-blur`) with
   `border:1px solid var(--border-subtle)` rather than the current
   transparent column-on-radial layout. This keeps the dark mode
   brand while adopting legacy's three-zone card structure.
5. **Background "what's next" mock?**
   Recommendation: skip. Marketing `/` already carries the product
   narrative; the login page should be calm and focused. Re-evaluate
   if conversion drops.

---

## 8. Evidence index — files actually read

- `Fabrica-web/web-W41-login/app/[locale]/login/page.tsx` (225 lines, full)
- `Fabrica-web/web-W41-login/app/api/auth/authorize/route.ts` (79 lines, full)
- `Fabrica-web/web-W41-login/app/api/auth/callback/route.ts` (69 lines, full)
- `Fabrica-web/web-W41-login/app/api/auth/session/route.ts` (24 lines, full)
- `Fabrica-web/web-W41-login/app/api/auth/refresh/route.ts` (41 lines, full)
- `Fabrica-web/web-W41-login/app/api/auth/logout/route.ts` (34 lines, full)
- `Fabrica-web/web-W41-login/messages/en.json` lines 885-1013 (login + footer namespaces)
- `Fabrica-relay/AGENTS.md` (174 lines, full)
- `Fabrica-relay/src/director/index.ts` (184 lines, full)
- `Fabrica-relay/src/cell/index.ts` (1281 lines, full)
- `Fabrica-app/AGENTS.md` (128 lines, full)
- `Fabrica-app/src/main/runtime/relay/supabase-session.ts` (162 lines, full)
- `Fabrica-app/src/main/runtime/relay/relay-auth-coordinator.ts` (326 lines, full)
- `Fabrica-app/src/main/runtime/relay/relay-host-proof.ts` lines 1-80 (host proof shape)
- `Fabrica-app/src/main/fabrica-profiles/profile-cloud-pkce.ts` (146 lines, full)
- `Fabrica-app/src/main/fabrica-profiles/profile-cloud-auth-config.ts` (141 lines, full)
- `Fabrica-atlas/_sources/legacy-fabrica/frontend-next/app/page.tsx` lines 1-678 (truncated; landing)
- `Fabrica-atlas/_sources/legacy-fabrica/frontend-next/app/oauth/page.tsx` (940 lines, full)
- `Fabrica-atlas/_sources/legacy-fabrica/frontend-next/app/onboard/page.tsx` (1051 lines, full)
- `Fabrica-atlas/_sources/legacy-fabrica/frontend-next/app/dashboard/page.tsx` (listed, not read in depth — same auth-gate pattern as `oauth`)

## 9. File paths in the proposal (quick reference)

- Web login: `app/[locale]/login/page.tsx`
- Web auth API: `app/api/auth/{authorize,callback,session,refresh,logout}/route.ts`
- Web login copy: `messages/en.json:887-899`
- Web (to-be-built) desktop auth: `app/v1/desktop/auth/{authorize,session,refresh,capabilities,profile,org,logout,relay-token,invites}/route.ts`
- Relay: `src/director/index.ts`, `src/cell/index.ts`
- Desktop sign-in: `src/main/fabrica-profiles/profile-cloud-pkce.ts`, `profile-cloud-auth-config.ts`
- Desktop relay auth: `src/main/runtime/relay/{supabase-session,relay-auth-coordinator,relay-host-proof,relay-control-client}.ts`
- Desktop device pairing: `src/main/runtime/relay/relay-control-requests.ts` (`installCredential`, `createInvite`), `src/shared/pairing.ts` (`encodePairingOffer`), `mobile/`
- Legacy reference: `Fabrica-atlas/_sources/legacy-fabrica/frontend-next/app/{page,oauth,onboard,dashboard}/page.tsx`, `components/auth/supabase`
