# Can Relay Migrate to Supabase?

**Short answer:** The SQLite DB part YES. The WebSocket server NO.

---

## What the relay actually is

Two separate things:

### 1. WebSocket server (Durable Object) — CANNOT migrate
- Runs as `Cell` (Durable Object) on Cloudflare Workers
- Maintains live WebSocket connections (`WS /v1/host/control`, `WS /v1/host/data/<connId>`, `WS /v1/connect/<relayHostId>`)
- Forwards raw binary/text frames between desktop and phone in real-time
- Has ping interval (15s), lease drain timer, challenge-response auth
- Handles connection state (`pending_conns`, `host_state`) in memory + SQLite

**Why it can't go to Supabase:**
- Supabase Realtime = designed for DB change notifications (`postgres_changes`), not arbitrary WebSocket tunneling
- Supabase Edge Functions = stateless HTTP functions (like Lambda), not persistent WebSocket servers
- Durable Objects have a specific property: one object instance stays alive as long as connections exist. Supabase has nothing equivalent.
- The relay needs sub-100ms latency for data forwarding. Going through Supabase Realtime (which broadcasts to ALL subscribers of a channel) would break the 1-to-1 tunneling model.

### 2. SQLite database (`host_state`, `invites`, `device_credentials`, `pending_conns`) — CAN migrate
These are simply tables. They could become Supabase tables with the same schema:

| SQLite Table | Columns | Supabase Equivalent |
|-------------|---------|-------------------|
| `host_state` | `host_id`, `assignmentEpoch`, `generation`, `controlResumeSecret`, `leaseExpiresAt`, `appVersion` | `relay_hosts` table |
| `invites` | `host_id`, `token`, `attempts`, `createdAt` | Could merge into `fabrica_pair_invites` (already exists) |
| `device_credentials` | `host_id`, `deviceId`, `pubKey`, `createdAt`, `version` | Could be `relay_devices` table |
| `pending_conns` | `host_id`, `connId`, `connTicket` | Ephemeral — maybe not needed in Supabase |

**But:** Even if we move these tables to Supabase, the WebSocket server (Durable Object) must still exist somewhere to handle connections. It would just read/write to Supabase instead of SQLite.

---

## What would migration look like?

### Option A: Full migration (not feasible)
Move everything (WebSocket server + DB) to Supabase. **Not possible** — Supabase has no WebSocket proxy server equivalent to Durable Objects.

### Option B: Partial migration (DB only, keep Cloudflare)
Keep the relay server on Cloudflare but change the SQLite storage to Supabase tables. The Durable Object would query Supabase instead of SQLite.

**Issues with Option B:**
- Every ping (15s) + every connection event would require a Supabase DB query → latency increases significantly
- Durable Object SQLite is embedded (zero network latency). Supabase requires HTTPS calls.
- The relay needs to work when the desktop is offline (leases, resume secrets must persist even if Supabase is unreachable). SQLite is more resilient.
- The `invites` and `device_credentials` tables are closely tied to the pairing flow. They could be maintained in both places (Supabase `fabrica_pair_invites` + relay SQLite `invites`), but this creates duplication and sync issues.

---

## What does Fabrica-web already have?

The `fabrica_pair_invites` table (migration 0003) stores pairing invite tokens. The relay's `invites` table serves the same purpose but is optimized for the relay's internal protocol (base64url tokens, attempt tracking, 24h TTL). The web's `fabrica_pair_invites` is for the login page (`/v1/desktop/auth/invites`) to display pairing codes.

These are complementary, not duplicates:
- `fabrica_pair_invites` (Supabase): Web-facing, used by login panel
- `invites` (SQLite in relay): Internal, used by relay WebSocket authentication

---

## Recommendation

**Keep the relay on Cloudflare.** Don't migrate it to Supabase.

The SQLite tables (`host_state`, `invites`, `device_credentials`, `pending_conns`) are an implementation detail of the Durable Object. They don't need to be in Supabase. The pairing data that the web needs (`fabrica_pair_invites`) is already in Supabase.

If you really want to consolidate, you could:
1. Keep relay DB as SQLite (fast, embedded, resilient)
2. Use Supabase `fabrica_pair_invites` for web-facing pairing data only
3. Have the desktop sync pairing invites to both (relay for WebSocket auth, Supabase for web display)

But there's no practical benefit to moving the relay DB. It would make the relay slower and more fragile.

**Bottom line:** Relay stays. Pairing stays. They stay separate from Supabase (except for the pairing table used by the web login page). The `fabrica_pair_invites` migration (0003) is correct as-is.
