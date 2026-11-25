import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Users, Home, Search } from 'lucide-react'

const today = () => new Date().toISOString().slice(0, 10)

export default function SearchCard({ villas }) {
  const nav = useNavigate()
  const [f, setF] = useState({ checkin: '', checkout: '', guests: 2, villa: '' })
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    if (f.checkin && f.checkin < today()) return setErr('Check-in cannot be in the past.')
    if (f.checkin && f.checkout && f.checkout <= f.checkin) return setErr('Check-out must be after check-in.')
    setErr('')
    const qs = new URLSearchParams({ ...(f.checkin && { checkin: f.checkin }), ...(f.checkout && { checkout: f.checkout }), guests: f.guests }).toString()
    nav(f.villa ? `/villas/${f.villa}?${qs}` : `/villas?${qs}`)
  }
  const input = 'w-full rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-sm text-white placeholder-white/70 [color-scheme:dark] transition focus:bg-white/25'
  const L = ({ id, icon: I, children }) => <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white"><I className="h-4 w-4" aria-hidden="true" />{children}</label>
  return (
    <form onSubmit={submit} className="glass rounded-[28px] p-5 text-white shadow-float md:p-6" aria-label="Check availability">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.7fr_1.3fr_auto] lg:items-end">
        <div><L id="s-in" icon={CalendarDays}>Check-in</L><input id="s-in" type="date" min={today()} value={f.checkin} onChange={set('checkin')} className={input} /></div>
        <div><L id="s-out" icon={CalendarDays}>Check-out</L><input id="s-out" type="date" min={f.checkin || today()} value={f.checkout} onChange={set('checkout')} className={input} /></div>
        <div><L id="s-g" icon={Users}>Guests</L><input id="s-g" type="number" min="1" max="30" value={f.guests} onChange={set('guests')} className={input} /></div>
        <div><L id="s-v" icon={Home}>Villa</L>
          <select id="s-v" value={f.villa} onChange={set('villa')} className={`${input} [&>option]:text-navy`}><option value="">All villas</option>{villas.map((v) => <option key={v.slug} value={v.slug}>{v.name}</option>)}</select></div>
        <button type="submit" className="btn-gold sm:col-span-2 lg:col-span-1 lg:h-[46px]"><Search className="h-4 w-4" aria-hidden="true" />Check Availability</button>
      </div>
      {err && <p role="alert" className="mt-3 rounded-xl bg-cream px-4 py-2 text-sm font-medium text-[#B3261E]">{err}</p>}
    </form>
  )
}
