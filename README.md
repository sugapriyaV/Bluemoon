# Bluemoon Beach House

React (Vite) + Tailwind + GSAP/ScrollTrigger + Supabase. Cinematic luxury redesign of the Stage 1 project.

## Run
1. `npm install`
2. `cp .env.example .env` (optional — runs on built-in seed villas without Supabase)
3. **`npm run images`** — downloads the Unsplash villa photos into `public/images/villas/` (once; commit the files). Until then the site loads the same photos straight from Unsplash.
4. `npm run dev` / `npm run build`

## Supabase & deploy
Run `supabase/schema.sql` in the Supabase SQL editor, put URL + anon key in `.env`, push to GitHub, import in Netlify (`npm run build`, publish `dist`, env vars as in `.env.example`).

## Pages
`/` home · `/villas` (filters by `?guests=`) · `/villas/:slug` details + enquiry · `/about` · `/contact` · 404

## Animation system (src/lib/useReveal.js + src/components)
Hero reveal/zoom/parallax, word-by-word text reveals, clip-path image masks, parallax, scroll-filled statement, staggered cards,
pinned horizontal scroll (`HScroll`, desktop only; native swipe row on touch), 3D tilt + depth layers (`Tilt`), magnetic CTAs (`Magnetic`),
cursor ring (`Cursor`), animated menu and lightbox. Everything is reverted on unmount; disabled by `prefers-reduced-motion`;
tilt/magnetic/cursor only on fine-pointer devices; parallax only ≥768px; pinning only ≥1024px.

## Image credits (Unsplash)
Unsplash photos are free to use under the Unsplash License (attribution appreciated, not required). Photographer names could not be
fetched automatically — open each photo on unsplash.com (search the ID) to add the credit.

| Photo ID | Source | Photographer |
|---|---|---|
| `photo-1512917774080-9991f1c4c750` | https://images.unsplash.com/photo-1512917774080-9991f1c4c750 | Unsplash contributor (see photo page) |
| `photo-1520250497591-112f2f40a3f4` | https://images.unsplash.com/photo-1520250497591-112f2f40a3f4 | Unsplash contributor (see photo page) |
| `photo-1540541338287-41700207dee6` | https://images.unsplash.com/photo-1540541338287-41700207dee6 | Unsplash contributor (see photo page) |
| `photo-1556911220-bff31c812dba` | https://images.unsplash.com/photo-1556911220-bff31c812dba | Unsplash contributor (see photo page) |
| `photo-1564013799919-ab600027ffc6` | https://images.unsplash.com/photo-1564013799919-ab600027ffc6 | Unsplash contributor (see photo page) |
| `photo-1582268611958-ebfd161ef9cf` | https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf | Unsplash contributor (see photo page) |
| `photo-1600566753190-17f0baa2a6c3` | https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3 | Unsplash contributor (see photo page) |
| `photo-1600585154340-be6161a56a0c` | https://images.unsplash.com/photo-1600585154340-be6161a56a0c | Unsplash contributor (see photo page) |
| `photo-1600596542815-ffad4c1539a9` | https://images.unsplash.com/photo-1600596542815-ffad4c1539a9 | Unsplash contributor (see photo page) |
| `photo-1600607687939-ce8a6c25118c` | https://images.unsplash.com/photo-1600607687939-ce8a6c25118c | Unsplash contributor (see photo page) |
| `photo-1613490493576-7fde63acd811` | https://images.unsplash.com/photo-1613490493576-7fde63acd811 | Unsplash contributor (see photo page) |
| `photo-1616594039964-ae9021a400a0` | https://images.unsplash.com/photo-1616594039964-ae9021a400a0 | Unsplash contributor (see photo page) |
| `photo-1618221195710-dd6b41faaea6` | https://images.unsplash.com/photo-1618221195710-dd6b41faaea6 | Unsplash contributor (see photo page) |
