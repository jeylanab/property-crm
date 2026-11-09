-- Step 4: realistic fake UAE demo data
-- Run in Supabase: SQL Editor > New query > paste > Run
--
-- BEFORE YOU RUN: change v_email below to the email of the demo user you created.
-- Safe to run again: it wipes and recreates the data for that user only.

do $$
declare
  v_email text := 'demo@propy.app';   -- <<< change this to your demo user's email
  v_user  uuid;
  o1 uuid; o2 uuid; o3 uuid;
  p1 uuid; p2 uuid; p3 uuid; p4 uuid; p5 uuid;
  rec record;
begin
  select id into v_user from auth.users where email = v_email;
  if v_user is null then
    raise exception 'No user found with email %. Edit v_email at the top of this file.', v_email;
  end if;

  -- clean previous demo data for this user
  delete from public.leases     where user_id = v_user;  -- also removes payments
  delete from public.tenants    where user_id = v_user;
  delete from public.units      where user_id = v_user;
  delete from public.properties where user_id = v_user;
  delete from public.owners     where user_id = v_user;

  -- ---------- OWNERS ----------
  insert into public.owners (user_id, full_name, email, phone)
    values (v_user, 'Mohammed Al Falasi', 'm.alfalasi@example.com', '+971 50 234 5678') returning id into o1;
  insert into public.owners (user_id, full_name, email, phone)
    values (v_user, 'Vikram Malhotra', 'vikram.malhotra@example.com', '+971 55 876 5432') returning id into o2;
  insert into public.owners (user_id, full_name, email, phone)
    values (v_user, 'Sarah Thompson', 'sarah.thompson@example.com', '+971 52 345 6789') returning id into o3;

  -- ---------- PROPERTIES ----------
  insert into public.properties (user_id, owner_id, name, emirate, area, address, property_type)
    values (v_user, o1, 'Marina Heights Tower', 'Dubai', 'Dubai Marina', 'Marina Walk, Dubai Marina', 'apartment') returning id into p1;
  insert into public.properties (user_id, owner_id, name, emirate, area, address, property_type)
    values (v_user, o2, 'JVC Garden Residences', 'Dubai', 'JVC', 'District 12, Jumeirah Village Circle', 'apartment') returning id into p2;
  insert into public.properties (user_id, owner_id, name, emirate, area, address, property_type)
    values (v_user, o1, 'Downtown Boulevard Suites', 'Dubai', 'Downtown Dubai', 'Mohammed Bin Rashid Blvd, Downtown Dubai', 'apartment') returning id into p3;
  insert into public.properties (user_id, owner_id, name, emirate, area, address, property_type)
    values (v_user, o3, 'Business Bay Executive Offices', 'Dubai', 'Business Bay', 'Bay Avenue, Business Bay', 'office') returning id into p4;
  insert into public.properties (user_id, owner_id, name, emirate, area, address, property_type)
    values (v_user, o3, 'Reem Bay Apartments', 'Abu Dhabi', 'Al Reem Island', 'Najmat Abu Dhabi, Al Reem Island', 'apartment') returning id into p5;

  -- ---------- UNITS (32 total) ----------
  for rec in
    select * from (values (p1, 70000, 8), (p2, 45000, 8), (p3, 110000, 6), (p4, 90000, 4), (p5, 55000, 6))
      as t(pid, base_rent, n)
  loop
    insert into public.units (user_id, property_id, unit_number, bedrooms, size_sqft, annual_rent, status)
    select v_user, rec.pid,
           (((g - 1) / 4 + 1) * 100 + ((g - 1) % 4 + 1))::text,
           g % 3,
           450 + (g % 3) * 350 + g * 7,
           rec.base_rent + (g % 3) * 25000 + g * 2500,
           'vacant'
    from generate_series(1, rec.n) g;
  end loop;

  -- ---------- TENANTS (24) ----------
  insert into public.tenants (user_id, full_name, email, phone, nationality)
  select v_user, t.full_name,
         lower(replace(t.full_name, ' ', '.')) || '@example.com',
         format('+971 5%s %s %s', (t.n % 6)::int, lpad((100 + t.n * 37)::text, 3, '0'), lpad((1000 + t.n * 113)::text, 4, '0')),
         t.nationality
  from unnest(
    array['Ahmed Al Mansoori','Sara Khan','Rajesh Nair','Elena Petrova','James Whitfield','Fatima Al Hashemi',
          'Omar Haddad','Priya Menon','Mohamed Salah Eldin','Anna Kowalski','Khalid Al Suwaidi','Maria Santos',
          'David Chen','Layla Mahmoud','Tariq Aziz','Olivia Brown','Yousef Al Ketbi','Natalia Ivanova',
          'Hassan Raza','Chloe Martin','Sophie Laurent','Ivan Horvat','Noor Al Zaabi','Arjun Kapoor'],
    array['UAE','Pakistan','India','Russia','United Kingdom','UAE',
          'Jordan','India','Egypt','Poland','UAE','Philippines',
          'China','Lebanon','Pakistan','United Kingdom','UAE','Ukraine',
          'Pakistan','France','France','Croatia','UAE','India']
  ) with ordinality as t(full_name, nationality, n);

  -- ---------- LEASES (24 active) ----------
  with ranked_units as (
    select u.id as unit_id, u.annual_rent,
           row_number() over (order by u.pos, p.name) as rn
    from (select *, row_number() over (partition by property_id order by unit_number) as pos
          from public.units where user_id = v_user) u
    join public.properties p on p.id = u.property_id
  ), ranked_tenants as (
    select id, row_number() over (order by full_name) as rn
    from public.tenants where user_id = v_user
  )
  insert into public.leases (user_id, unit_id, tenant_id, ejari_number, start_date, end_date,
                             annual_rent, security_deposit, cheques_count, status)
  select v_user, ru.unit_id, rt.id,
         format('EJ-%s-%s', extract(year from e.end_d - 365)::int, lpad((100000 + ru.rn * 7919)::text, 6, '0')),
         e.end_d - 365,
         e.end_d,
         ru.annual_rent,
         round(ru.annual_rent * 0.05, 0),
         (array[1,2,4,4,6,12])[(ru.rn % 6)::int + 1],
         'active'
  from ranked_units ru
  join ranked_tenants rt on rt.rn = ru.rn
  cross join lateral (select (current_date + (10 + (ru.rn * 14) % 340)::int) as end_d) e
  where ru.rn <= 24;

  -- unit status: leased = rented, two units under maintenance, rest stay vacant
  update public.units set status = 'rented'
  where id in (select unit_id from public.leases where user_id = v_user);

  update public.units set status = 'maintenance'
  where id in (
    select id from public.units
    where user_id = v_user and status = 'vacant'
    order by unit_number, id
    limit 2
  );

  -- ---------- PAYMENTS (cheque schedule for every lease) ----------
  with leases_n as (
    select l.*, row_number() over (order by l.start_date, l.id) as lrn
    from public.leases l where l.user_id = v_user
  ), sched as (
    select l.id as lease_id, l.annual_rent, l.cheques_count, l.lrn, i,
           (l.start_date + make_interval(months => ((i - 1) * 12 / l.cheques_count)))::date as due
    from leases_n l, lateral generate_series(1, l.cheques_count) i
  ), ranked as (
    select s.*,
           row_number() over (partition by lease_id, (due < current_date) order by due desc) as grp_rank
    from sched s
  ), final as (
    select r.*,
           case
             when due >= current_date then 'pending'
             when grp_rank = 1 and cheques_count > 1 and lrn % 7 = 3 then 'bounced'
             when grp_rank = 1 and cheques_count > 1 and lrn % 5 = 0 then 'overdue'
             else 'paid'
           end as pay_status
    from ranked r
  )
  insert into public.payments (user_id, lease_id, amount, due_date, paid_date, method,
                               cheque_number, bank_name, status)
  select v_user, f.lease_id,
         round(f.annual_rent / f.cheques_count, 2),
         f.due,
         case when f.pay_status = 'paid' then f.due + (f.lrn % 3)::int end,
         case when f.lrn % 8 = 0 then 'bank_transfer' else 'cheque' end,
         case when f.lrn % 8 = 0 then null else lpad((500000 + f.lrn * 100 + f.i)::text, 6, '0') end,
         case when f.lrn % 8 = 0 then null
              else (array['Emirates NBD','Mashreq Bank','ADCB','Dubai Islamic Bank','First Abu Dhabi Bank','RAKBANK'])[(f.lrn % 6)::int + 1] end,
         f.pay_status
  from final f;
end $$;