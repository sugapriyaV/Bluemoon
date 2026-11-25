# Blue Moon Beach House (bluemoonbeachhouse)

React (Vite) + Tailwind + GSAP + Supabase. Redesign: single-page home (hero, about, villas, amenities, gallery + lightbox, location, enquiry). Photos: put files in src/assets/villas/<slug>/ or upload via admin (Stage 4).

## Run locally
1. `npm install`
2. `cp .env.example .env` (optional for Stage 1 – the site runs on built-in seed data without it)
3. `npm run dev`

## Supabase (optional now, required for Stage 2+)
1. Create a project at supabase.com.
2. SQL Editor -> paste and run `supabase/schema.sql` (tables, RLS, storage bucket, seed villas).
3. Project Settings -> API: copy URL + anon key into `.env`.
4. Authentication -> Users -> Add user (your admin email + password) – used in Stage 4.

## Deploy (GitHub -> Netlify)
1. `git init && git add . && git commit -m "Stage 1"`; push to a new GitHub repo.
2. Netlify -> Add new site -> Import from GitHub. Build: `npm run build`, publish: `dist` (already in netlify.toml).
3. Site settings -> Environment variables: add VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_WHATSAPP_NUMBER.

## Structure
src/components (Navbar, Footer, WhatsAppFloat, SearchCard, VillaCard, SmartImage, AmenitiesGrid, Skeletons)
src/pages (Home, Villas, NotFound, ComingSoon placeholders) | src/lib (config, supabase, hooks) | src/data (seed villas, amenities)
