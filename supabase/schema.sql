-- EchoByld CRM — Supabase schema
-- Run this in the Supabase SQL editor once you create your project

create extension if not exists "uuid-ossp";

create table public.companies (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  country      text,
  sector       text,
  category     text,
  tier         text,
  size         text,
  website      text,
  linkedin_url text,
  notes        text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table public.contacts (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid references public.companies(id) on delete set null,
  full_name      text not null,
  role           text,
  email          text,
  phone          text,
  linkedin_url   text,
  company        text,
  country        text default 'Ireland',
  source         text,
  status         text default 'New lead',
  interest_level text default 'Unknown',
  segment        text default 'Other',
  score          integer default 0,
  owner          text default 'Ciaran',
  next_followup  date,
  last_contacted date,
  notes          text,
  tags           text[] default '{}',
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table public.activities (
  id               uuid primary key default gen_random_uuid(),
  contact_id       uuid references public.contacts(id) on delete cascade,
  company_id       uuid references public.companies(id) on delete set null,
  type             text not null,
  title            text,
  body             text,
  voice_url        text,
  duration_seconds integer,
  occurred_at      timestamptz default now(),
  owner            text default 'Ciaran',
  created_at       timestamptz default now()
);

create table public.deals (
  id              uuid primary key default gen_random_uuid(),
  contact_id      uuid references public.contacts(id) on delete set null,
  company_id      uuid references public.companies(id) on delete set null,
  title           text not null,
  stage           text default 'New lead',
  value_eur       numeric default 0,
  currency        text default 'EUR',
  close_date      date,
  win_loss_reason text,
  owner           text default 'Ciaran',
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table public.investors (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  type                 text default 'Angel',
  contact_name         text,
  contact_email        text,
  linkedin_url         text,
  stage                text default 'New lead',
  target_amount_eur    numeric default 0,
  committed_amount_eur numeric default 0,
  last_contacted       date,
  next_followup        date,
  next_step            text,
  notes                text,
  owner                text default 'Ciaran',
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

create table public.investor_activities (
  id          uuid primary key default gen_random_uuid(),
  investor_id uuid references public.investors(id) on delete cascade,
  type        text not null,
  title       text,
  body        text,
  occurred_at timestamptz default now(),
  owner       text default 'Ciaran',
  created_at  timestamptz default now()
);

-- Enable Row Level Security
alter table public.companies           enable row level security;
alter table public.contacts            enable row level security;
alter table public.activities          enable row level security;
alter table public.deals               enable row level security;
alter table public.investors           enable row level security;
alter table public.investor_activities enable row level security;

-- Allow full public access (no auth required for testing)
create policy "public_all" on public.companies           for all using (true) with check (true);
create policy "public_all" on public.contacts            for all using (true) with check (true);
create policy "public_all" on public.activities          for all using (true) with check (true);
create policy "public_all" on public.deals               for all using (true) with check (true);
create policy "public_all" on public.investors           for all using (true) with check (true);
create policy "public_all" on public.investor_activities for all using (true) with check (true);

-- Auto-update timestamps
create or replace function update_updated_at()
returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;

create trigger trg_contacts_updated  before update on public.contacts  for each row execute function update_updated_at();
create trigger trg_deals_updated     before update on public.deals     for each row execute function update_updated_at();
create trigger trg_investors_updated before update on public.investors for each row execute function update_updated_at();
