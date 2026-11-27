import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { setSettings } from '../lib/config'
import { digits, clean } from '../lib/safe'
import { Card, PageHead, Label, Toast } from './ui'

const strong = (p) => p.length >= 12 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p)
export default function SettingsAdmin() {
  const [s, setS] = useState({ phone: '', email: '' }), [busy, setBusy] = useState(false), [toast, setToast] = useState(null), [e, setE] = useState({})
  const [pw, setPw] = useState({ a: '', b: '' }), [pe, setPe] = useState('')
  useEffect(() => { supabase.from('site_settings').select('phone,email').eq('id', 1).maybeSingle().then(({ data }) => data && setS(data)) }, [])

  const save = async (ev) => {
    ev.preventDefault(); const phone = digits(s.phone).slice(-10), email = clean(s.email, 120).toLowerCase(), er = {}
    if (!/^[6-9]\d{9}$/.test(phone)) er.phone = 'Enter a valid 10-digit Indian mobile number.'
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(email)) er.email = 'Enter a valid email address.'
    setE(er); if (Object.keys(er).length) return
    setBusy(true); const { error } = await supabase.from('site_settings').upsert({ id: 1, phone, email, updated_at: new Date().toISOString() }); setBusy(false)
    if (error) return setToast({ type: 'error', msg: 'Could not save settings.' })
    setSettings({ phone, email }); setS({ phone, email }); setToast({ msg: 'Saved. The website now uses this number for calls and WhatsApp.' })
  }
  const changePw = async (ev) => {
    ev.preventDefault(); setPe('')
    if (!strong(pw.a)) return setPe('Use at least 12 characters with upper & lower case, a number and a symbol.')
    if (pw.a !== pw.b) return setPe('The two passwords do not match.')
    const { error } = await supabase.auth.updateUser({ password: pw.a })
    if (error) return setPe('Could not change the password. Log out, log in again and retry.')
    setPw({ a: '', b: '' }); setToast({ msg: 'Password changed.' })
  }
  return (
    <>
      <PageHead title="Settings" />
      <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
        <Card><h2 className="mb-1 text-2xl">Contact details</h2><p className="mb-5 text-sm text-charcoal/70">Used for the WhatsApp button, enquiry messages, calls, footer and contact page.</p>
          <form onSubmit={save} noValidate className="space-y-5">
            <div><Label id="s-phone">Phone / WhatsApp number (10 digits)</Label><div className="flex items-center gap-2"><span className="text-sm">+91</span><input id="s-phone" className={`field ${e.phone ? 'field-err' : ''}`} inputMode="numeric" maxLength={14} value={s.phone} onChange={(x) => setS({ ...s, phone: x.target.value })} /></div>{e.phone && <p role="alert" className="mt-1 text-xs font-medium text-[#B3261E]">{e.phone}</p>}</div>
            <div><Label id="s-email">Email</Label><input id="s-email" type="email" className={`field ${e.email ? 'field-err' : ''}`} maxLength={120} value={s.email} onChange={(x) => setS({ ...s, email: x.target.value })} />{e.email && <p role="alert" className="mt-1 text-xs font-medium text-[#B3261E]">{e.email}</p>}</div>
            <button disabled={busy} className="btn-primary disabled:opacity-60">{busy ? 'Saving…' : 'Save changes'}</button></form></Card>
        <Card><h2 className="mb-1 text-2xl">Change password</h2><p className="mb-5 text-sm text-charcoal/70">Passwords are stored hashed by Supabase Auth — never in this website's code.</p>
          <form onSubmit={changePw} noValidate className="space-y-5">
            <div><Label id="p-a">New password</Label><input id="p-a" type="password" autoComplete="new-password" className="field" maxLength={200} value={pw.a} onChange={(x) => setPw({ ...pw, a: x.target.value })} /></div>
            <div><Label id="p-b">Repeat new password</Label><input id="p-b" type="password" autoComplete="new-password" className="field" maxLength={200} value={pw.b} onChange={(x) => setPw({ ...pw, b: x.target.value })} /></div>
            {pe && <p role="alert" className="text-sm font-medium text-[#B3261E]">{pe}</p>}<button className="btn-primary">Update password</button></form></Card>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  )
}
