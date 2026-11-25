-- Blue Moon Beach House: run in Supabase SQL editor.
create table if not exists public.villas (
  id uuid primary key default gen_random_uuid(),
  sort_order int default 0,
  slug text unique not null,
  name text not null,
  location text,
  short_description text,
  long_description text,
  bedrooms int default 3,
  bathrooms int default 3,
  max_guests int default 12,
  weekday_price numeric not null default 0,
  weekend_price numeric not null default 0,
  photos text[] default '{}',
  amenities jsonb default '[]',
  map_link text,
  available boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null, phone text not null, email text not null,
  villa_id uuid references public.villas(id) on delete set null,
  villa_name text,
  check_in date, check_out date, guests int, message text,
  total_estimate numeric,
  status text default 'New' check (status in ('New','Contacted','Booked')),
  created_at timestamptz default now()
);

create table if not exists public.visits (
  id bigint generated always as identity primary key,
  path text, created_at timestamptz default now()
);

alter table public.villas enable row level security;
alter table public.enquiries enable row level security;
alter table public.visits enable row level security;

-- Public: read villas, create enquiries/visits. Admin (authenticated): everything.
create policy "villas public read" on public.villas for select using (true);
create policy "villas admin write" on public.villas for all to authenticated using (true) with check (true);
create policy "enquiries public insert" on public.enquiries for insert with check (true);
create policy "enquiries admin all" on public.enquiries for all to authenticated using (true) with check (true);
create policy "visits public insert" on public.visits for insert with check (true);
create policy "visits admin read" on public.visits for select to authenticated using (true);

-- Storage bucket for villa photos
insert into storage.buckets (id, name, public) values ('villa-photos', 'villa-photos', true) on conflict do nothing;
create policy "photos public read" on storage.objects for select using (bucket_id = 'villa-photos');
create policy "photos admin write" on storage.objects for all to authenticated using (bucket_id = 'villa-photos') with check (bucket_id = 'villa-photos');

-- Seed
insert into public.villas (sort_order, slug, name, location, short_description, long_description, weekday_price, weekend_price, map_link, photos) values
(1,'blue-moon-beach-villa-mahabalipuram','Blue Moon Beach Villa','Mahabalipuram, near the beach','A private 3BHK beach villa a short walk from the sand, with a pool, BBQ lawn and a kids'' play corner.','Wake up to sea breeze at this private 3BHK villa near Mahabalipuram beach.',14000,19000,'https://www.google.com/maps/search/?api=1&query=Mahabalipuram+Beach+Villa','{}'),
(2,'the-ocean-drive-villas-ecr','The Ocean Drive Villas @ ECR','Vadanemmeli, Chengalpattu (ECR)','A spacious private 3BHK villa on East Coast Road with a pool, outdoor games and a BBQ deck.','Set on the scenic East Coast Road at Vadanemmeli, a private 3BHK stay with pool and BBQ.',13000,18000,'https://www.google.com/maps/search/?api=1&query=Vadanemmeli+ECR+Chengalpattu','{}')
on conflict (slug) do nothing;
