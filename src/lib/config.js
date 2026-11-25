export const PHONE = '9710259352'
export const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919710259352'
export const EMAIL = 'info@bluemoonbeachhouse.com'
export const WA_DEFAULT_MSG = "Hi, I'm interested in booking a villa. Could you please share the details?"
export const waLink = (msg = WA_DEFAULT_MSG) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
export const inr = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
export const hasRates = (v) => Number(v?.weekday_price) > 0 && Number(v?.weekend_price) > 0
// Flat photo list from villa records, used for gallery / hero / about compositions.
export const collectPhotos = (villas) =>
  villas.flatMap((v) => (v.photos || []).map((src, i) => ({ src, alt: `${v.name} – photo ${i + 1}`, villa: v.name, slug: v.slug })))
