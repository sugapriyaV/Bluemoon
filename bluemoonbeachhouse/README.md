# Bluemoon Beach House

React (Vite) + Tailwind + GSAP + Supabase. Public site + secured admin panel at `/admin`.

## 1. Run locally
```
npm install
cp .env.example .env      # fill in your Supabase URL + anon (public) key
npm run dev
```
Without Supabase configured the site shows built-in demo villas and `/admin` explains what is missing.

## 2. Supabase setup (one time)
1. Create a project at supabase.com.
2. **SQL Editor** → paste all of `supabase/schema.sql` → Run. (Tables, Row Level Security, rate limits, photo bucket, starter villas.)
3. **Authentication → Providers → Email**: keep Email enabled, **turn OFF "Allow new users to sign up"** (so nobody can register), and turn on "Secure password change"/leaked-password protection if your plan offers it.
4. **Authentication → Users → Add user**: email `bluemoonbeachhouse.admin@bluemoonbeachhouse.com`, a **strong new password**, tick *Auto Confirm User*.
5. SQL Editor → run the `insert into public.admins …` statement from the bottom of `schema.sql` (this is what makes that user an admin).
6. **Project Settings → API**: copy *Project URL* and the *anon / publishable* key into `.env` (and into Netlify env vars). Never use the `service_role` key anywhere in this project.
7. Log in at `/admin` with username `Bluemoonbeachhouse.admin` (the site turns it into the e-mail above) and your password. Change the password under **Settings** if you ever shared it.

## 3. What the admin can do
Dashboard (visits, enquiries, 14-day chart, recent enquiries) · Villas (add / edit / delete with a confirmation popup, availability switch, weekday & weekend prices, amenities, description, map link, JPG/PNG multi-upload, reorder, set cover, delete) · Enquiries (search, filter by villa / date / status, change status, WhatsApp reply, delete, CSV export) · Reports (visits trend, enquiries per day / month / villa / status) · Settings (**phone/WhatsApp number and email used across the whole site**, change password). Everything on the public site — villa details and pictures — is read from the database.

## 4. Images
Villa photos shown on the site come from the admin (Supabase Storage). The two starter villas are pre-filled with Unsplash photos so the site isn't empty — replace them from `/admin`. `npm run images` downloads the demo Unsplash photos into `public/images/villas/` (used only in demo mode). Unsplash credits: see the table at the bottom.

## 5. Deploy (GitHub → Netlify)
Push to GitHub → Netlify "Import from Git" → build `npm run build`, publish `dist` (already in `netlify.toml`) → add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Site settings → Environment variables. `netlify.toml` also sends the security headers.

## 6. Security — what is in place
| Area | Implementation |
|---|---|
| Secrets | Only the public anon key is used in the browser. `.env` is git-ignored; `supabase.js` refuses to start if a `service_role` key is supplied. `npm run security` scans for leaked secrets. No passwords exist anywhere in the code. |
| Authentication | Supabase Auth (passwords hashed with bcrypt by Supabase). Login uses generic error messages and a 5-try / 60 s client lockout; Supabase adds its own server-side auth rate limits. |
| Authorization | **Postgres Row Level Security** is the real gate: visitors can only *read* villas/settings and *insert* enquiries/visits; everything else needs a user listed in `public.admins`. The `/admin` route guard is only UX. Signed-in non-admins get nothing. |
| Input validation / XSS | Validation in the UI **and** CHECK constraints + a trigger in the database; text is stripped of control characters and `<>`; React escapes output; no `dangerouslySetInnerHTML`; links/images only accept `https` URLs (`safeUrl`); CSV export neutralises spreadsheet formulas. |
| Rate limiting | Database triggers cap enquiries (5/h per IP, 3/h per phone, 150/h overall) and visits; plus a honeypot field and 30 s client cooldown. |
| Uploads | Bucket limited to JPG/PNG, 5 MB, admin-only writes; the admin UI also checks real file signatures; random file names. |
| Headers | HSTS, CSP (scripts only from this site), X-Frame-Options/frame-ancestors, nosniff, Referrer-Policy, Permissions-Policy, COOP; `/admin` is `noindex` + `no-store`; `robots.txt` hides it. |
| CORS / API | There are no custom API endpoints — the browser talks only to Supabase, whose API is protected by the RLS above. |
| Debug / files | Source maps off in production; no debug code; only `dist/` is published. |
| Dependencies | `npm audit` = 0 vulnerabilities (Vite 8, React Router 7). Re-run `npm run audit` regularly. |

Remaining risks you should know about: the Supabase session token lives in the browser's storage (the CSP and the lack of inline scripts reduce XSS risk, but use a strong unique password); rate limiting is per-IP at the database level, not a firewall; and Git history could not be checked here — run `npx gitleaks detect` in your repo (and rotate the Supabase keys if it ever finds one).

## Unsplash photo credits
Unsplash License; photographer names could not be fetched automatically — look each ID up on unsplash.com.

| Photo ID | Source | Photographer |
|---|---|---|
| `photo-1512917774080-9991f1c4c750` | https://images.unsplash.com/photo-1512917774080-9991f1c4c750 | Unsplash contributor |
| `photo-1520250497591-112f2f40a3f4` | https://images.unsplash.com/photo-1520250497591-112f2f40a3f4 | Unsplash contributor |
| `photo-1540541338287-41700207dee6` | https://images.unsplash.com/photo-1540541338287-41700207dee6 | Unsplash contributor |
| `photo-1556911220-bff31c812dba` | https://images.unsplash.com/photo-1556911220-bff31c812dba | Unsplash contributor |
| `photo-1564013799919-ab600027ffc6` | https://images.unsplash.com/photo-1564013799919-ab600027ffc6 | Unsplash contributor |
| `photo-1582268611958-ebfd161ef9cf` | https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf | Unsplash contributor |
| `photo-1600566753190-17f0baa2a6c3` | https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3 | Unsplash contributor |
| `photo-1600585154340-be6161a56a0c` | https://images.unsplash.com/photo-1600585154340-be6161a56a0c | Unsplash contributor |
| `photo-1600596542815-ffad4c1539a9` | https://images.unsplash.com/photo-1600596542815-ffad4c1539a9 | Unsplash contributor |
| `photo-1600607687939-ce8a6c25118c` | https://images.unsplash.com/photo-1600607687939-ce8a6c25118c | Unsplash contributor |
| `photo-1613490493576-7fde63acd811` | https://images.unsplash.com/photo-1613490493576-7fde63acd811 | Unsplash contributor |
| `photo-1616594039964-ae9021a400a0` | https://images.unsplash.com/photo-1616594039964-ae9021a400a0 | Unsplash contributor |
| `photo-1618221195710-dd6b41faaea6` | https://images.unsplash.com/photo-1618221195710-dd6b41faaea6 | Unsplash contributor |
