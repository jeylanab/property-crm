-- Step 2: core tables for the UAE property CRM
-- Run in Supabase: SQL Editor > New query > paste > Run
-- Also save this file as supabase/migrations/0001_init.sql

-- ---------- OWNERS ----------
create table public.owners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

-- ---------- PROPERTIES (buildings) ----------
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  owner_id uuid references public.owners(id) on delete set null,
  name text not null,
  emirate text not null check (emirate in (
    'Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Fujairah','Umm Al Quwain'
  )),
  area text,                      -- e.g. Dubai Marina, JVC
  address text,
  property_type text not null default 'apartment'
    check (property_type in ('apartment','villa','townhouse','office','retail')),
  created_at timestamptz not null default now()
);

-- ---------- UNITS ----------
create table public.units (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  unit_number text not null,
  bedrooms int,
  size_sqft numeric(10,2),
  annual_rent numeric(12,2),      -- AED
  status text not null default 'vacant'
    check (status in ('vacant','rented','maintenance')),
  created_at timestamptz not null default now(),
  unique (property_id, unit_number)
);

-- ---------- TENANTS ----------
create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  nationality text,
  created_at timestamptz not null default now()
);

-- ---------- LEASES ----------
create table public.leases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  unit_id uuid not null references public.units(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  ejari_number text,
  start_date date not null,
  end_date date not null,
  annual_rent numeric(12,2) not null,   -- AED
  security_deposit numeric(12,2) default 0,
  cheques_count int default 1,          -- 1, 2, 4, 6, 12 cheques
  status text not null default 'active'
    check (status in ('pending','active','expired','terminated')),
  created_at timestamptz not null default now(),
  check (end_date > start_date)
);

-- ---------- PAYMENTS (rent + cheque tracking) ----------
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  lease_id uuid not null references public.leases(id) on delete cascade,
  amount numeric(12,2) not null,        -- AED
  due_date date not null,               -- for cheques: the cheque date
  paid_date date,
  method text not null default 'cheque'
    check (method in ('cheque','cash','bank_transfer','card')),
  cheque_number text,
  bank_name text,
  status text not null default 'pending'
    check (status in ('pending','paid','overdue','bounced')),
  created_at timestamptz not null default now()
);

-- ---------- INDEXES ----------
create index on public.properties (user_id);
create index on public.properties (owner_id);
create index on public.units (property_id);
create index on public.units (status);
create index on public.leases (unit_id);
create index on public.leases (tenant_id);
create index on public.leases (end_date);
create index on public.payments (lease_id);
create index on public.payments (due_date);
create index on public.payments (status);

-- ---------- ROW LEVEL SECURITY ----------
-- Each logged-in manager only sees their own rows.
-- Adding a new table later? Just add its name to this array.
do $$
declare t text;
begin
  foreach t in array array['owners','properties','units','tenants','leases','payments']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "own rows" on public.%I for all to authenticated
       using ((select auth.uid()) = user_id)
       with check ((select auth.uid()) = user_id)', t);
  end loop;
end $$;
