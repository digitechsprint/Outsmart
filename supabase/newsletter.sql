-- Run this once in Supabase Dashboard -> SQL Editor
create table if not exists public."Newsletter" (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public."Newsletter" enable row level security;

-- Website (anon key) can subscribe
create policy "Anyone can subscribe"
  on public."Newsletter" for insert
  to anon, authenticated
  with check (true);

-- Admin panel (anon key) can read subscribers, same as inquiries
create policy "Anyone can read subscribers"
  on public."Newsletter" for select
  to anon, authenticated
  using (true);
