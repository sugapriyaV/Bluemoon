import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Safety net: the browser may only ever hold the public "anon" key. If a privileged key
// (service_role) is pasted into the env by mistake, refuse to start instead of shipping it.
function roleOf(jwt) {
  try { return JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).role } catch { return null }
}
const looksValid = Boolean(url && key && /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url) && !url.includes('YOUR-PROJECT'))
const privileged = looksValid && roleOf(key) !== 'anon' && !String(key).startsWith('sb_publishable_')
if (privileged) throw new Error('VITE_SUPABASE_ANON_KEY must be the public anon/publishable key, never a service_role/secret key.')

export const supabaseReady = looksValid
export const supabase = supabaseReady ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } }) : null
