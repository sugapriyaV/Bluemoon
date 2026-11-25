// Villa photos come ONLY from the property's own images:
//  1) photos uploaded in the admin panel (Supabase Storage) -> villa.photos
//  2) files placed in src/assets/villas/<villa-slug>/  (picked up automatically)
const local = import.meta.glob('/src/assets/villas/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, query: '?url', import: 'default' })

const bySlug = {}
Object.keys(local).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).forEach((path) => {
  const slug = path.split('/').slice(-2)[0]
  ;(bySlug[slug] ||= []).push(local[path])
})

export const withPhotos = (v) => ({ ...v, photos: v.photos?.length ? v.photos : bySlug[v.slug] || [] })

// Flat list for hero / about / gallery
export const collectPhotos = (villas) =>
  villas.flatMap((v) => (v.photos || []).map((src, i) => ({ src, alt: `${v.name} – photo ${i + 1}`, villa: v.name })))
