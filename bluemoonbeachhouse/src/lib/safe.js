// Input/URL hygiene. React already escapes text output (no dangerouslySetInnerHTML is used anywhere);
// these helpers add defence in depth for values that end up in href/src or are stored/sent onward.

/** Only http(s) URLs (or same-site paths) are allowed in links/images — blocks javascript:/data: URLs. */
export function safeUrl(u) {
  if (typeof u !== 'string') return ''
  const s = u.trim()
  if (s.startsWith('/') && !s.startsWith('//')) return s
  try { const x = new URL(s); return x.protocol === 'https:' ? x.href : '' } catch { return '' }
}

/** Trim, drop control characters and angle brackets, cap length. */
export function clean(v, max = 200) {
  return String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max)
}
/** Multi-line variant (keeps newlines) for messages. */
export function cleanMultiline(v, max = 1000) {
  return String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F<>]/g, '').replace(/\r/g, '').trim().slice(0, max)
}
/** Spreadsheet formula-injection guard for CSV export. */
export function csvCell(v) {
  let s = String(v ?? ''); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s
  return `"${s.replace(/"/g, '""')}"`
}
export const digits = (v) => String(v ?? '').replace(/\D/g, '')
