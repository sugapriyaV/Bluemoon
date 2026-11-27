export const STATUSES = ['New', 'Contacted', 'Booked']
export const BUCKET = 'villa-photos'
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024
export const slugify = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)
export const pathFromUrl = (url) => { const m = String(url).match(new RegExp(`/storage/v1/object/public/${BUCKET}/(.+)$`)); return m ? decodeURIComponent(m[1].split('?')[0]) : null }
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—')

// Real file-type check (magic bytes), not just the extension/MIME the browser reports.
export async function sniffImage(file) {
  const b = new Uint8Array(await file.slice(0, 8).arrayBuffer())
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: 'jpg', type: 'image/jpeg' }
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { ext: 'png', type: 'image/png' }
  return null
}
