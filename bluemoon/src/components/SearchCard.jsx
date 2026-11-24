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
    if (f.checkin && f.checkout && f.checkout <= f.checkin) return setErr('Check-out must be after check-in.')
    setErr('')
    const qs = new URLSearchParams({ ...(f.checkin && { checkin: f.checkin }), ...(f.checkout && { checkout: f.checkout }), guests: f.guests }).toString()
    nav(f.villa ? `/villas/${f.villa}?${qs}` : `/villas?${qs}`)
  }

  const field = 'flex flex-col gap-1.5'
  const input = 'w-full rounded-2xl border border-white/40 bg-white/25 px-4 py-3 text-sm text-white placeholder-white/70 [color-scheme:dark] focus:bg-white/35'
  return (
    <form onSubmit={submit} className="glass rounded-3xl p-5 md:p-7 text-white" aria-label="Check availability">
      <div className="mb-5"><h2 className="text-2xl md:text-3xl">Find your perfect escape</h2><p className="text-sm text-white/90">Pick your dates and villa</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={field}><label htmlFor="s-in" className="label flex items-center gap-1.5"><CalendarDays className="h-4 w-4" aria-hidden="true" />Check-in</label>
          <input id="s-in" type="date" min={today()} value={f.checkin} onChange={set('checkin')} className={input} /></div>
        <div className={field}><label htmlFor="s-out" className="label flex items-center gap-1.5"><CalendarDays className="h-4 w-4" aria-hidden="true" />Check-out</label>
          <input id="s-out" type="date" min={f.checkin || today()} value={f.checkout} onChange={set('checkout')} className={input} /></div>
        <div className={field}><label htmlFor="s-guests" className="label flex items-center gap-1.5"><Users className="h-4 w-4" aria-hidden="true" />Guests</label>
          <input id="s-guests" type="number" min="1" max="30" value={f.guests} onChange={set('guests')} className={input} /></div>
        <div className={field}><label htmlFor="s-villa" className="label flex items-center gap-1.5"><Home className="h-4 w-4" aria-hidden="true" />Villa</label>
          <select id="s-villa" value={f.villa} onChange={set('villa')} className={`${input} [&>option]:text-ink`}>
            <option value="">All villas</option>
            {villas.map((v) => <option key={v.slug} value={v.slug}>{v.name}</option>)}
          </select></div>
      </div>
      {err && <p role="alert" className="mt-3 rounded-xl bg-white px-4 py-2 text-sm font-medium text-coral-dark">{err}</p>}
      <button type="submit" className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-cream py-4 font-semibold text-ink transition hover:bg-white">
        <Search className="h-5 w-5" aria-hidden="true" /> Check Availability
      </button>
    </form>
  )
}
