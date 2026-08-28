-- Fabrica Cloud: artifact storage for the desktop share/publish API.
-- Applies to the same Supabase project used by Fabrica-web (NEXT_PUBLIC_SUPABASE_URL).
-- Run with the Supabase CLI (supabase db push) or paste into the SQL editor.

create table if not exists public.fabrica_artifacts (
  slug                  text primary key,
  user_id               uuid not null references auth.users (id) on delete cascade,
  title                 text,
  original_file_name    text,
  source_content_type   text not null default 'text/html',
  rendered_content_type text not null default 'text/html',
  content               text not null,
  edit_token            text not null,
  share_url             text not null,
  byte_size             integer not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  expires_at            timestamptz
);

create index if not exists fabrica_artifacts_user_id_idx
  on public.fabrica_artifacts (user_id, updated_at desc);

-- RLS: artifacts are readable/updatable only by their owner. Public GET-by-id
-- retrieval is served by the API route which intentionally returns published
-- artifacts; if you want to gate public reads at the DB layer instead, drop
-- this policy and expose rows via a separate secure view.
alter table public.fabrica_artifacts enable row level security;

create policy "owner read" on public.fabrica_artifacts
  for select using (auth.uid() = user_id);

create policy "owner insert" on public.fabrica_artifacts
  for insert with check (auth.uid() = user_id);

create policy "owner update" on public.fabrica_artifacts
  for update using (auth.uid() = user_id);

create policy "owner delete" on public.fabrica_artifacts
  for delete using (auth.uid() = user_id);
