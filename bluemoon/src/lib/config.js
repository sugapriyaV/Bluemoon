export const PHONE = '9710259352'
export const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919710259352'
export const EMAIL = 'info@bluemoonbeachhouse.com'
export const WA_DEFAULT_MSG = "Hi, I'm interested in booking a villa. Could you please share the details?"
export const waLink = (msg = WA_DEFAULT_MSG) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
export const FALLBACK_IMG = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80'
export const inr = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
