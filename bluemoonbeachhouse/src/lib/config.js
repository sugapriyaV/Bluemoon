// Site-wide contact settings. Defaults below are overridden by the `site_settings` row
// (editable by the admin) once SettingsProvider has loaded it.
const state = { phone: '9710259352', email: 'info@bluemoonbeachhouse.com' }
export const getSettings = () => state
export const setSettings = (s) => {
  if (/^[6-9]\d{9}$/.test(s?.phone || '')) state.phone = s.phone
  if (typeof s?.email === 'string' && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(s.email)) state.email = s.email
}
export const WA_DEFAULT_MSG = "Hi, I'm interested in booking a villa. Could you please share the details?"
export const waLink = (msg = WA_DEFAULT_MSG) => `https://wa.me/91${state.phone}?text=${encodeURIComponent(msg)}`
export const inr = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
export const hasRates = (v) => Number(v?.weekday_price) > 0 && Number(v?.weekend_price) > 0
export const collectPhotos = (villas) =>
  villas.flatMap((v) => (v.photos || []).map((src, i) => ({ src, alt: `${v.name} – photo ${i + 1}`, villa: v.name, slug: v.slug })))
