// Quick secret / exposure scan of the project tree (+ the built dist/ folder). Run: npm run security
// For the FULL git history, also run:  npx gitleaks detect  (or: git log -p | grep -iE "service_role|secret|password")
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const skipDir = new Set(['node_modules', '.git', 'public/images'])
const rules = [
  ['service_role / secret key', /service_role|sb_secret_[A-Za-z0-9_-]{10,}/i],
  ['private key block', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['AWS key', /AKIA[0-9A-Z]{16}/],
  ['hard-coded password', /(password|passwd|pwd)\s*[:=]\s*['"][^'"\s]{4,}['"]/i],
  ['Stripe/GitHub/Slack token', /(sk_live_|ghp_[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,})/],
  ['dangerouslySetInnerHTML / eval', /dangerouslySetInnerHTML|\beval\(|new Function\(/],
]
const jwt = /eyJ[A-Za-z0-9_-]{15,}\.eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{10,}/g
// Known-benign matches: React's bundle mentions dangerouslySetInnerHTML; supabase.js/safe.js only *mention* the words in guards/comments.
const allow = [['dangerouslySetInnerHTML / eval', /dist\/assets\/vendor|src\/lib\/safe\.js/], ['service_role / secret key', /src\/lib\/supabase\.js/]]
let hits = 0
const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n), rel = relative(root, p)
  if (skipDir.has(n) || skipDir.has(rel)) continue
  const st = statSync(p); if (st.isDirectory()) { walk(p); continue }
  if (st.size > 2_000_000 || /\.(jpe?g|png|webp|ico|woff2?|lock|zip)$/i.test(n) || n === 'package-lock.json' || n === 'security-scan.mjs') continue
  const txt = readFileSync(p, 'utf8')
  for (const [name, re] of rules) if (re.test(txt) && !allow.some(([n, r]) => n === name && r.test(rel))) { if (name.startsWith('private') || !/schema\.sql|README|\.example/.test(n) || !/service_role/.test(txt)) { console.log(`✗ ${name}: ${rel}`); hits++ } }
  for (const m of txt.match(jwt) || []) { let role = '?'; try { role = JSON.parse(Buffer.from(m.split('.')[1], 'base64url')).role } catch {} console.log(`✗ embedded JWT (role=${role}): ${rel}`); hits++ }
} }
walk(root)
for (const f of ['.env', '.env.local', '.env.production']) if (existsSync(join(root, f))) console.log(`! ${f} exists locally — make sure it is in .gitignore (it is) and never committed`)
console.log(hits ? `\n${hits} finding(s) — review above.` : '\n✓ No secrets or dangerous patterns found.')
process.exit(hits ? 1 : 0)
