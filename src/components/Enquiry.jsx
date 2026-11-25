import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase, supabaseReady } from '../lib/supabase'
import { estimate } from '../lib/pricing'
import { inr, waLink } from '../lib/config'

const today = () => new Date().toISOString().slice(0, 10)
const EMPTY = { name: '', phone: '', email: '', villa: '', checkin: '', checkout: '', guests: '', message: '' }

function Field({ k, label, err, children }) {
  return (
    <div className="min-w-0"><label htmlFor={`e-${k}`} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-navy">{label}</label>{children}
      {err && <p id={`err-${k}`} role="alert" className="mt-1.5 text-xs font-medium text-[#B3261E]">{err}</p>}</div>)
}

export default function Enquiry({ villas, preset }) {
  const [q] = useSearchParams()
  const [f, setF] = useState({ ...EMPTY, villa: q.get('villa') || '', checkin: q.get('checkin') || '', checkout: q.get('checkout') || '', guests: q.get('guests') || '' })
  const [errs, setErrs] = useState({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const villa = villas.find((v) => v.slug === f.villa)
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }))

  useEffect(() => { if (preset) setF((p) => ({ ...p, villa: preset })) }, [preset])

  const validate = () => {
    const e = {}
    if (f.name.trim().length < 2) e.name = 'Please enter your name.'
    if (!/^[6-9]\d{9}$/.test(f.phone.trim())) e.phone = 'Enter a valid 10-digit Indian mobile number.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email address.'
    if (!villa) e.villa = 'Please choose a villa.'
    if (!f.checkin) e.checkin = 'Select a check-in date.'
    else if (f.checkin < today()) e.checkin = 'Check-in cannot be in the past.'
    if (!f.checkout) e.checkout = 'Select a check-out date.'
    else if (f.checkin && f.checkout <= f.checkin) e.checkout = 'Check-out must be after check-in.'
    const g = Number(f.guests)
    if (!g || g < 1) e.guests = 'Enter the number of guests.'
    else if (villa?.max_guests && g > villa.max_guests) e.guests = `This villa allows up to ${villa.max_guests} guests.`
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const e = validate(); setErrs(e)
    if (Object.keys(e).length) return document.getElementById(`e-${Object.keys(e)[0]}`)?.focus()
    setBusy(true)
    const est = estimate(villa, f.checkin, f.checkout)
    if (supabaseReady) {
      try {
        await supabase.from('enquiries').insert({ name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim(),
          villa_id: String(villa.id).startsWith('seed') ? null : villa.id, villa_name: villa.name, check_in: f.checkin, check_out: f.checkout,
          guests: Number(f.guests), message: f.message.trim() || null, total_estimate: est?.total ?? null })
      } catch { /* WhatsApp still opens */ }
    }
    const msg = ['*New enquiry – Bluemoon Beach House*', `Villa: ${villa.name}`, `Name: ${f.name.trim()}`, `Phone: ${f.phone.trim()}`, `Email: ${f.email.trim()}`,
      `Check-in: ${f.checkin}`, `Check-out: ${f.checkout}`, `Guests: ${f.guests}`, est ? `Estimated total: ${inr(est.total)}` : null, f.message.trim() ? `Message: ${f.message.trim()}` : null].filter(Boolean).join('\n')
    window.open(waLink(msg), '_blank', 'noopener')
    setBusy(false); setDone(true); setF({ ...EMPTY, villa: preset || '' })
  }

  const est = estimate(villa, f.checkin, f.checkout)
  const cls = (k) => `field ${errs[k] ? 'field-err' : ''}`
  const aria = (k) => ({ id: `e-${k}`, 'aria-invalid': !!errs[k], 'aria-describedby': errs[k] ? `err-${k}` : undefined })

  return (
    <form onSubmit={submit} noValidate className="rounded-[28px] bg-cream p-6 shadow-float md:p-9" aria-label="Booking enquiry">
      {done && <p role="status" className="mb-5 rounded-2xl bg-seafoam p-4 text-sm font-medium text-navy">Thank you! Your enquiry was saved and WhatsApp has opened with your details. Send the message to complete it.</p>}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field err={errs.name} k="name" label="Name"><input {...aria('name')} className={cls('name')} value={f.name} onChange={set('name')} autoComplete="name" /></Field>
        <Field err={errs.phone} k="phone" label="Phone"><input {...aria('phone')} className={cls('phone')} value={f.phone} onChange={set('phone')} inputMode="numeric" maxLength={10} autoComplete="tel-national" placeholder="10-digit mobile" /></Field>
        <Field err={errs.email} k="email" label="Email"><input {...aria('email')} type="email" className={cls('email')} value={f.email} onChange={set('email')} autoComplete="email" /></Field>
        <Field err={errs.villa} k="villa" label="Villa"><select {...aria('villa')} className={cls('villa')} value={f.villa} onChange={set('villa')}>
          <option value="">Select a villa</option>{villas.map((v) => <option key={v.slug} value={v.slug}>{v.name}</option>)}</select></Field>
        <Field err={errs.checkin} k="checkin" label="Check-in"><input {...aria('checkin')} type="date" min={today()} className={cls('checkin')} value={f.checkin} onChange={set('checkin')} /></Field>
        <Field err={errs.checkout} k="checkout" label="Check-out"><input {...aria('checkout')} type="date" min={f.checkin || today()} className={cls('checkout')} value={f.checkout} onChange={set('checkout')} /></Field>
        <Field err={errs.guests} k="guests" label="Guests"><input {...aria('guests')} type="number" min="1" className={cls('guests')} value={f.guests} onChange={set('guests')} /></Field>
      </div>
      <div className="mt-5"><Field err={errs.message} k="message" label="Message (optional)"><textarea {...aria('message')} rows={3} className="field" value={f.message} onChange={set('message')} /></Field></div>
      {est && (
        <dl className="mt-5 rounded-2xl bg-seafoam/60 p-4 text-sm">
          {est.wd > 0 && <div className="flex justify-between"><dt>{est.wd} weekday night{est.wd > 1 ? 's' : ''} × {inr(est.wdRate)}</dt><dd>{inr(est.wd * est.wdRate)}</dd></div>}
          {est.we > 0 && <div className="flex justify-between"><dt>{est.we} weekend night{est.we > 1 ? 's' : ''} × {inr(est.weRate)}</dt><dd>{inr(est.we * est.weRate)}</dd></div>}
          <div className="mt-2 flex justify-between border-t border-navy/15 pt-2 font-semibold text-navy"><dt>Estimated total</dt><dd>{inr(est.total)}</dd></div>
          <p className="mt-1 text-xs text-charcoal/60">Weekend = Friday and Saturday nights. Final price is confirmed on WhatsApp.</p>
        </dl>)}
      <button type="submit" disabled={busy} className="btn-primary mt-6 w-full !py-4 disabled:opacity-60">{busy ? 'Sending…' : 'Send Enquiry on WhatsApp'}</button>
    </form>
  )
}
