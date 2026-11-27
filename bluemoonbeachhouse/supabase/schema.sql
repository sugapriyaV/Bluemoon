-- =====================================================================
-- Bluemoon Beach House — database, security (RLS), storage, rate limits.
-- Run the WHOLE file once in Supabase -> SQL Editor. Safe to re-run.
-- =====================================================================

-- ---------- tables ----------
create table if not exists public.villas (
  id uuid primary key default gen_random_uuid(),
  sort_order int default 0,
  slug text unique not null,
  name text not null,
  location text,
  short_description text,
  long_description text,
  bedrooms int default 3,
  bathrooms int,
  max_guests int,
  weekday_price numeric not null default 0,
  weekend_price numeric not null default 0,
  photos text[] default '{}',
  amenities jsonb default '[]',
  map_link text,
  available boolean default true,
  created_at timestamptz default now()
);
alter table public.villas alter column bathrooms drop not null;
alter table public.villas alter column max_guests drop not null;

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null, phone text not null, email text not null,
  villa_id uuid references public.villas(id) on delete set null,
  villa_name text, check_in date, check_out date, guests int, message text,
  total_estimate numeric,
  status text default 'New',
  ip_hash text,
  created_at timestamptz default now()
);
alter table public.enquiries add column if not exists ip_hash text;

create table if not exists public.visits (
  id bigint generated always as identity primary key,
  path text, ip_hash text, created_at timestamptz default now()
);
alter table public.visits add column if not exists ip_hash text;

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  phone text not null default '9710259352',
  email text not null default 'info@bluemoonbeachhouse.com',
  updated_at timestamptz default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- Admin allow-list: only users listed here are admins (an ordinary logged-in user is NOT an admin).
create table if not exists public.admins (user_id uuid primary key references auth.users(id) on delete cascade);

-- ---------- data-integrity constraints (server-side validation; the browser is never trusted) ----------
do $$ begin
  alter table public.villas drop constraint if exists villas_checks;
  alter table public.villas add constraint villas_checks check (
    slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80 and char_length(name) between 2 and 120
    and weekday_price between 0 and 10000000 and weekend_price between 0 and 10000000
    and coalesce(array_length(photos,1),0) <= 20 and coalesce(char_length(long_description),0) <= 3000
    and coalesce(char_length(short_description),0) <= 300 and (map_link is null or map_link ~ '^https://'));
  alter table public.enquiries drop constraint if exists enquiries_checks;
  alter table public.enquiries add constraint enquiries_checks check (
    status in ('New','Contacted','Booked') and phone ~ '^[6-9][0-9]{9}$'
    and char_length(name) between 2 and 80 and char_length(email) between 5 and 120 and email ~ '^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$'
    and (guests is null or guests between 1 and 100) and coalesce(char_length(message),0) <= 1000 and (check_in is null or check_out is null or check_out > check_in));
  alter table public.visits drop constraint if exists visits_checks;
  alter table public.visits add constraint visits_checks check (path is null or char_length(path) <= 200);
end $$;

-- ---------- admin check ----------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ---------- rate limiting + input normalisation for anonymous inserts ----------
create or replace function public.client_ip_hash() returns text
language plpgsql stable security definer set search_path = public as $$
declare h json; ip text;
begin
  begin h := current_setting('request.headers', true)::json; exception when others then h := '{}'::json; end;
  -- prefer the CDN-set header; otherwise the LAST x-forwarded-for hop (added by the platform, not spoofable by the client)
  ip := coalesce(nullif(h->>'cf-connecting-ip',''), btrim(reverse(split_part(reverse(coalesce(h->>'x-forwarded-for','')), ',', 1))), 'unknown');
  return md5(ip || ':bluemoon');
end $$;
revoke all on function public.client_ip_hash() from public, anon, authenticated;

create or replace function public.enquiries_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare h text := public.client_ip_hash();
begin
  if public.is_admin() then return new; end if;
  new.status := 'New'; new.ip_hash := h; new.created_at := now();
  new.name := btrim(regexp_replace(new.name, '[<>]', '', 'g')); new.message := left(regexp_replace(coalesce(new.message,''), '[<>]', '', 'g'), 1000);
  if new.check_in is not null and new.check_in < current_date - 1 then raise exception 'invalid_dates'; end if;
  if (select count(*) from public.enquiries where ip_hash = h and created_at > now() - interval '1 hour') >= 5 then raise exception 'rate_limited'; end if;
  if (select count(*) from public.enquiries where phone = new.phone and created_at > now() - interval '1 hour') >= 3 then raise exception 'rate_limited'; end if;
  if (select count(*) from public.enquiries where created_at > now() - interval '1 hour') >= 150 then raise exception 'rate_limited'; end if;
  return new;
end $$;
drop trigger if exists enquiries_guard on public.enquiries;
create trigger enquiries_guard before insert on public.enquiries for each row execute function public.enquiries_guard();

create or replace function public.visits_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare h text := public.client_ip_hash();
begin
  new.ip_hash := h; new.created_at := now();
  if (select count(*) from public.visits where ip_hash = h and created_at > now() - interval '1 hour') >= 60 then raise exception 'rate_limited'; end if;
  if (select count(*) from public.visits where created_at > now() - interval '1 hour') >= 5000 then raise exception 'rate_limited'; end if;
  return new;
end $$;
drop trigger if exists visits_guard on public.visits;
create trigger visits_guard before insert on public.visits for each row execute function public.visits_guard();

-- ---------- dashboard / report numbers (returns nothing unless the caller is an admin) ----------
create or replace function public.admin_daily_stats(days int default 30)
returns table (day date, visits bigint, enquiries bigint)
language sql stable security definer set search_path = public as $$
  select d::date,
         (select count(*) from public.visits v where v.created_at::date = d::date),
         (select count(*) from public.enquiries e where e.created_at::date = d::date)
  from generate_series(current_date - (least(greatest(days,1),365) - 1), current_date, interval '1 day') d
  where public.is_admin()
$$;
revoke all on function public.admin_daily_stats(int) from public, anon;
grant execute on function public.admin_daily_stats(int) to authenticated;

-- ---------- Row Level Security ----------
alter table public.villas        enable row level security;
alter table public.enquiries     enable row level security;
alter table public.visits        enable row level security;
alter table public.site_settings enable row level security;
alter table public.admins        enable row level security;   -- no policies => nobody can read/write it through the API

-- remove policies from earlier versions of this schema
drop policy if exists "villas public read" on public.villas;           drop policy if exists "villas admin write" on public.villas;
drop policy if exists "enquiries public insert" on public.enquiries;   drop policy if exists "enquiries admin all" on public.enquiries;
drop policy if exists "visits public insert" on public.visits;         drop policy if exists "visits admin read" on public.visits;
drop policy if exists "photos public read" on storage.objects;         drop policy if exists "photos admin write" on storage.objects;

drop policy if exists villas_read on public.villas;         create policy villas_read on public.villas for select to anon, authenticated using (true);
drop policy if exists villas_admin on public.villas;        create policy villas_admin on public.villas for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists enq_insert on public.enquiries;       create policy enq_insert on public.enquiries for insert to anon, authenticated with check (true);
drop policy if exists enq_admin on public.enquiries;        create policy enq_admin on public.enquiries for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists visits_insert on public.visits;       create policy visits_insert on public.visits for insert to anon, authenticated with check (true);
drop policy if exists visits_admin on public.visits;        create policy visits_admin on public.visits for select to authenticated using (public.is_admin());

drop policy if exists settings_read on public.site_settings;  create policy settings_read on public.site_settings for select to anon, authenticated using (true);
drop policy if exists settings_admin on public.site_settings; create policy settings_admin on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin() and id = 1);

-- ---------- Storage: public photo bucket, JPG/PNG only, 5 MB max, only admins may write ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('villa-photos', 'villa-photos', true, 5242880, array['image/jpeg','image/png'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg','image/png'];

drop policy if exists photos_read on storage.objects;   create policy photos_read on storage.objects for select to anon, authenticated using (bucket_id = 'villa-photos');
drop policy if exists photos_admin on storage.objects;  create policy photos_admin on storage.objects for all to authenticated using (bucket_id = 'villa-photos' and public.is_admin()) with check (bucket_id = 'villa-photos' and public.is_admin());

-- ---------- starter villas (only inserted if missing; photos are managed from /admin) ----------
insert into public.villas (sort_order, slug, name, location, short_description, long_description, bedrooms, bathrooms, max_guests, weekday_price, weekend_price, map_link, photos, amenities) values
(1,'blue-moon-beach-villa-mahabalipuram','Blue Moon Beach Villa','Mahabalipuram, near the beach',
 'A private 3BHK beach villa a short walk from the sand, with a pool, BBQ lawn and a kids'' play corner.',
 'Wake up to sea breeze at this private 3BHK villa near Mahabalipuram beach. Three air-conditioned bedrooms, an open living room, a fully equipped kitchen, a sparkling swimming pool and a BBQ area make it perfect for family getaways and friends'' weekends.',
 3,3,12,14000,19000,'https://www.google.com/maps/search/?api=1&query=Mahabalipuram+Beach+Villa',array['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1600&q=80'],'[]'),
(2,'the-ocean-drive-villas-ecr','The Ocean Drive Villas @ ECR','Vadanemmeli, Chengalpattu (ECR)',
 'A spacious private 3BHK villa on East Coast Road with a pool, outdoor games and a BBQ deck.',
 'Set on the scenic East Coast Road at Vadanemmeli, The Ocean Drive Villas offers a private 3BHK stay with a swimming pool, outdoor play area, indoor games and BBQ facilities — an easy drive from Chennai.',
 3,3,12,13000,18000,'https://www.google.com/maps/search/?api=1&query=Vadanemmeli+ECR+Chengalpattu',array['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80'],'[]')
on conflict (slug) do nothing;

-- give the starter villas their Unsplash photos if they have none yet (replace them from /admin)
update public.villas set photos = array['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1600&q=80'] where slug='blue-moon-beach-villa-mahabalipuram' and coalesce(array_length(photos,1),0)=0;
update public.villas set photos = array['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80'] where slug='the-ocean-drive-villas-ecr' and coalesce(array_length(photos,1),0)=0;

-- =====================================================================
-- LAST STEP (after creating the admin user in Authentication -> Users):
-- make that user an admin. Replace the e-mail if you used a different one.
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'bluemoonbeachhouse.admin@bluemoonbeachhouse.com'
--   on conflict do nothing;
-- =====================================================================
