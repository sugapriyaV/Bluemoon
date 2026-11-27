import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Card, PageHead } from './ui'
import { BarChart, LineChart, HBars } from './charts'

export default function Reports() {
  const [days, setDays] = useState(30), [daily, setDaily] = useState(null), [enq, setEnq] = useState(null), [err, setErr] = useState('')
  useEffect(() => { supabase.rpc('admin_daily_stats', { days }).then(({ data, error }) => { if (error) setErr('Could not load report data.'); setDaily(data || []) }) }, [days])
  useEffect(() => { supabase.from('enquiries').select('villa_name,status,created_at').order('created_at', { ascending: false }).limit(5000).then(({ data }) => setEnq(data || [])) }, [])

  const perMonth = useMemo(() => {
    if (!enq) return []; const now = new Date(), out = []
    for (let i = 11; i >= 0; i--) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); out.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleDateString('en-IN', { month: 'short' }), value: 0 }) }
    enq.forEach((e) => { const m = out.find((x) => x.key === e.created_at.slice(0, 7)); if (m) m.value++ }); return out
  }, [enq])
  const perVilla = useMemo(() => Object.entries((enq || []).reduce((a, e) => ({ ...a, [e.villa_name || 'Unknown']: (a[e.villa_name || 'Unknown'] || 0) + 1 }), {})).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value), [enq])
  const perStatus = useMemo(() => ['New', 'Contacted', 'Booked'].map((s) => ({ label: s, value: (enq || []).filter((e) => e.status === s).length })), [enq])

  if (err) return <p role="alert" className="text-[#B3261E]">{err}</p>
  if (!daily || !enq) return <div className="skeleton h-96" role="status" aria-label="Loading" />
  const lbl = daily.map((r) => r.day.slice(5))
  return (
    <>
      <PageHead title="Reports"><div role="group" aria-label="Date range" className="flex rounded-full bg-sand p-1">{[7, 30, 90].map((d) => <button key={d} onClick={() => setDays(d)} aria-pressed={days === d} className={`rounded-full px-4 py-2 text-sm font-semibold ${days === d ? 'bg-navy text-cream' : ''}`}>{d} days</button>)}</div></PageHead>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card><h2 className="mb-3 text-2xl">Visits trend</h2><LineChart label={`Visits over the last ${days} days`} labels={lbl} series={[{ name: 'Visits', color: '#0F5C7A', values: daily.map((r) => Number(r.visits)) }]} /></Card>
        <Card><h2 className="mb-3 text-2xl">Enquiries per day</h2><BarChart label={`Enquiries per day, last ${days} days`} color="#C8A96A" data={daily.map((r) => ({ label: r.day.slice(5), value: Number(r.enquiries) }))} /></Card>
        <Card><h2 className="mb-3 text-2xl">Enquiries per month</h2><BarChart label="Enquiries per month, last 12 months" data={perMonth} /></Card>
        <Card><h2 className="mb-3 text-2xl">Enquiries per villa</h2><HBars rows={perVilla} /><h2 className="mb-3 mt-8 text-2xl">By status</h2><HBars rows={perStatus} color="#C8A96A" /></Card>
      </div>
    </>
  )
}
