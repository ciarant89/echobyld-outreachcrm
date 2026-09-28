-- EMERGENCY LOCKDOWN: replaces the wide-open "public_all" policies
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> paste -> Run

drop policy if exists "public_all" on public.companies;
drop policy if exists "public_all" on public.contacts;
drop policy if exists "public_all" on public.activities;
drop policy if exists "public_all" on public.deals;
drop policy if exists "public_all" on public.investors;
drop policy if exists "public_all" on public.investor_activities;

create policy "authenticated_only" on public.companies
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated_only" on public.contacts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated_only" on public.activities
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated_only" on public.deals
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated_only" on public.investors
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated_only" on public.investor_activities
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
