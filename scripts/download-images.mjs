// Downloads every Unsplash photo referenced in src/data/seedVillas.js into public/images/villas/<photo-id>.jpg
// and reports any that fail. Run once on your machine:  npm run images
// The site automatically prefers the local copy (see src/components/SmartImage.jsx) and falls back to Unsplash.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'

const src = readFileSync(new URL('../src/data/seedVillas.js', import.meta.url), 'utf8')
const ids = [...new Set([...src.matchAll(/photo-[\w-]+/g)].map((m) => m[0]))]
const dir = new URL('../public/images/villas/', import.meta.url)
mkdirSync(dir, { recursive: true })

let ok = 0; const failed = []
for (const id of ids) {
  const file = new URL(`${id}.jpg`, dir)
  if (existsSync(file)) { ok++; console.log('✓ cached ', id); continue }
  try {
    const res = await fetch(`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`)
    if (!res.ok || !(res.headers.get('content-type') || '').startsWith('image/')) throw new Error(`HTTP ${res.status}`)
    writeFileSync(file, Buffer.from(await res.arrayBuffer())); ok++; console.log('✓ saved  ', id)
  } catch (e) { failed.push(id); console.log('✗ FAILED ', id, e.message) }
}
console.log(`\n${ok}/${ids.length} images saved to public/images/villas/`)
if (failed.length) console.log('Replace these IDs in src/data/seedVillas.js with working Unsplash photos:\n' + failed.join('\n'))
