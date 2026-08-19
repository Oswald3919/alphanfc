-- ============================================================
-- AlphaNFC — Information Table SaaS
-- Complete Database Schema with RLS Policies
-- Run this entire script in the Supabase SQL Editor
-- ============================================================

-- Enable UUID generation extension
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- TABLE: businesses
-- One business per authenticated user (MVP)
-- ─────────────────────────────────────────────
create table public.businesses (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  name              text not null,
  slug              text not null unique,
  google_review_url text,
  menu_url          text,
  whatsapp_url      text,
  created_at        timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- TABLE: tables
-- Physical NFC/QR plates placed at locations
-- ─────────────────────────────────────────────
create table public.tables (
  id            uuid primary key default gen_random_uuid(),
  business_id   uuid not null references public.businesses(id) on delete cascade,
  code          text not null unique,          -- e.g. CAF001, CAF002
  location_name text not null,                -- e.g. "Mesa 1", "Caja", "Recepción"
  created_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- TABLE: scans
-- Inserted every time a visitor loads /t/[code]
-- No authentication required for inserts
-- ─────────────────────────────────────────────
create table public.scans (
  id         uuid primary key default gen_random_uuid(),
  table_id   uuid not null references public.tables(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- TABLE: events
-- Inserted when a visitor clicks a CTA button
-- action_type is constrained to known values
-- ─────────────────────────────────────────────
create table public.events (
  id          uuid primary key default gen_random_uuid(),
  table_id    uuid not null references public.tables(id) on delete cascade,
  action_type text not null check (action_type in ('google_review', 'menu', 'whatsapp')),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- INDEXES for common query patterns
-- ============================================================
create index idx_tables_business_id  on public.tables(business_id);
create index idx_scans_table_id      on public.scans(table_id);
create index idx_scans_created_at    on public.scans(created_at);
create index idx_events_table_id     on public.events(table_id);
create index idx_events_created_at   on public.events(created_at);
create index idx_events_action_type  on public.events(action_type);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.businesses enable row level security;
alter table public.tables      enable row level security;
alter table public.scans       enable row level security;
alter table public.events      enable row level security;

-- ─── businesses ───────────────────────────────────────────
-- Owners can fully manage their own business row
create policy "businesses: owner full access"
  on public.businesses
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── tables ───────────────────────────────────────────────
-- Owners can manage tables that belong to their business
create policy "tables: owner full access"
  on public.tables
  for all
  using  (
    exists (
      select 1 from public.businesses
      where id = public.tables.business_id
        and user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.businesses
      where id = public.tables.business_id
        and user_id = auth.uid()
    )
  );

-- Anonymous visitors must be able to read tables (to resolve /t/[code])
create policy "tables: public read by code"
  on public.tables
  for select
  using (true);

-- Anonymous visitors must be able to read businesses (for the landing page)
create policy "businesses: public read"
  on public.businesses
  for select
  using (true);

-- ─── scans ────────────────────────────────────────────────
-- Anyone (anonymous visitor) can insert a scan
create policy "scans: public insert"
  on public.scans
  for insert
  with check (true);

-- Owners can read scans for their own tables
create policy "scans: owner read"
  on public.scans
  for select
  using (
    exists (
      select 1
      from public.tables t
      join public.businesses b on b.id = t.business_id
      where t.id = public.scans.table_id
        and b.user_id = auth.uid()
    )
  );

-- ─── events ───────────────────────────────────────────────
-- Anyone (anonymous visitor) can insert an event
create policy "events: public insert"
  on public.events
  for insert
  with check (true);

-- Owners can read events for their own tables
create policy "events: owner read"
  on public.events
  for select
  using (
    exists (
      select 1
      from public.tables t
      join public.businesses b on b.id = t.business_id
      where t.id = public.events.table_id
        and b.user_id = auth.uid()
    )
  );
