import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const Ctx = createContext(null)
export const useAdmin = () => useContext(Ctx)

// Admin login uses a username: "Bluemoonbeachhouse.admin" -> bluemoonbeachhouse.admin@bluemoonbeachhouse.com (the Supabase Auth user).
export const toEmail = (u) => { const s = String(u || '').trim().toLowerCase(); return s.includes('@') ? s : `${s}@bluemoonbeachhouse.com` }

// status: loading | anon | admin. "admin" requires BOTH a valid session AND a row in public.admins (checked server-side via is_admin()).
export function AdminProvider({ children }) {
  const [status, setStatus] = useState('loading')
  const [user, setUser] = useState(null)

  const verify = useCallback(async (session) => {
    if (!session) { setUser(null); setStatus('anon'); return }
    const { data, error } = await supabase.rpc('is_admin')
    if (error || data !== true) { await supabase.auth.signOut(); setUser(null); setStatus('anon'); return }
    setUser(session.user); setStatus('admin')
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => verify(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((evt, session) => { if (evt === 'SIGNED_OUT') { setUser(null); setStatus('anon') } else if (evt === 'TOKEN_REFRESHED' && !session) setStatus('anon') })
    return () => sub.subscription.unsubscribe()
  }, [verify])

  const login = async (username, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: toEmail(username), password })
    if (error) return { ok: false, msg: 'Invalid username or password.' }   // deliberately generic
    const { data: isAdmin, error: e2 } = await supabase.rpc('is_admin')
    if (e2 || isAdmin !== true) { await supabase.auth.signOut(); return { ok: false, msg: 'This account does not have admin access.' } }
    setUser(data.user); setStatus('admin'); return { ok: true }
  }
  const logout = async () => { await supabase.auth.signOut(); setUser(null); setStatus('anon') }
  return <Ctx.Provider value={{ status, user, login, logout }}>{children}</Ctx.Provider>
}
