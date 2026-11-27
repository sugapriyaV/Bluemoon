import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useAdmin } from './auth'
import { useTitle } from '../lib/useTitle'

const MAX_TRIES = 5, LOCK_MS = 60000
export default function Login() {
  useTitle('Admin login')
  const { status, login } = useAdmin()
  const loc = useLocation()
  const [u, setU] = useState(''), [p, setP] = useState(''), [show, setShow] = useState(false)
  const [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  const [fails, setFails] = useState(0), [lockUntil, setLockUntil] = useState(0)
  if (status === 'admin') return <Navigate to={loc.state?.from || '/admin'} replace />

  const submit = async (e) => {
    e.preventDefault()
    if (Date.now() < lockUntil) return setErr(`Too many attempts. Try again in ${Math.ceil((lockUntil - Date.now()) / 1000)}s.`)
    if (!u.trim() || !p) return setErr('Enter your username and password.')
    setBusy(true); setErr('')
    const r = await login(u, p)
    setBusy(false)
    if (!r.ok) { const n = fails + 1; setFails(n); setErr(r.msg); if (n >= MAX_TRIES) { setLockUntil(Date.now() + LOCK_MS); setFails(0) } }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-5">
      <form onSubmit={submit} className="w-full max-w-md rounded-[28px] bg-cream p-8 shadow-float" aria-label="Admin login" noValidate>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-champagne-dark"><Lock className="h-4 w-4" aria-hidden="true" />Admin</p>
        <h1 className="mt-2 text-4xl">Bluemoon <span className="italic">Beach House</span></h1>
        <div className="mt-7 space-y-5">
          <div><label htmlFor="a-u" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-navy">Username</label>
            <input id="a-u" className="field" value={u} onChange={(e) => setU(e.target.value)} autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={120} /></div>
          <div><label htmlFor="a-p" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-navy">Password</label>
            <div className="relative"><input id="a-p" className="field pr-12" type={show ? 'text' : 'password'} value={p} onChange={(e) => setP(e.target.value)} autoComplete="current-password" maxLength={200} />
              <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy">{show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></div>
        </div>
        {err && <p role="alert" className="mt-4 rounded-xl bg-[#B3261E]/10 px-4 py-2.5 text-sm font-medium text-[#B3261E]">{err}</p>}
        <button type="submit" disabled={busy} className="btn-primary mt-6 w-full !py-4 disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </main>
  )
}
