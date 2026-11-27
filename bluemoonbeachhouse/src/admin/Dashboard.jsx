import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Inbox, Sparkles, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Card, PageHead } from './ui'
import { LineChart } from './charts'
import { fmtDate } from './data'

const count = (q) => q.then(({ count }) => count ?? 0)
export default function Dashboard() {
  const [d, setD] = useState(null), [err, setErr] = useState('')
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [visits, leads, fresh, booked, daily, recent] = await Promise.all([
          count(supabase.from('visits').select('*', { count: 'exact', head: true })),
          count(supabase.from('enquiries').select('*', { count: 'exact', head: true })),
          count(supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'New')),
          count(supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'Booked')),
          supabase.rpc('admin_daily_stats', { days: 14 }),
          supabase.from('enquiries').select('id,name,villa_name,check_in,check_out,status,created_at').order('created_at', { ascending: false }).limit(6)
        ])
        if (alive) setD({ visits, leads, fresh, booked, daily: daily.data || [], recent: recent.data || [] })
      } catch { if (alive) setErr('Could not load dashboard data.') }
    })()
    return () => { alive = false }
  }, [])
  if (err) return <p role="alert" className="text-[#B3261E]">{err}</p>
  if (!d) return <div className="skeleton h-96" role="status" aria-label="Loading" />
  const stats = [['Total visits', d.visits, Eye], ['Total enquiries', d.leads, Inbox], ['New (unread)', d.fresh, Sparkles], ['Booked', d.booked, CheckCircle2]]
  return (
    <>
      <PageHead title="Dashboard" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{stats.map(([l, v, I]) => <Card key={l}><I className="h-6 w-6 text-champagne-dark" aria-hidden="true" /><p className="mt-3 font-serif text-5xl text-navy">{v.toLocaleString('en-IN')}</p><p className="text-sm text-charcoal/70">{l}</p></Card>)}</div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card><h2 className="mb-3 text-2xl">Last 14 days</h2>
          <LineChart label="Visits and enquiries over the last 14 days" labels={d.daily.map((r) => r.day.slice(5))} series={[{ name: 'Visits', color: '#0F5C7A', values: d.daily.map((r) => Number(r.visits)) }, { name: 'Enquiries', color: '#C8A96A', values: d.daily.map((r) => Number(r.enquiries)) }]} /></Card>
        <Card><div className="mb-3 flex items-center justify-between"><h2 className="text-2xl">Recent enquiries</h2><Link to="/admin/enquiries" className="text-sm underline">View all</Link></div>
          {d.recent.length === 0 ? <p className="text-sm text-charcoal/60">No enquiries yet.</p> : <ul className="divide-y divide-sand">{d.recent.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 py-3 text-sm"><div className="min-w-0"><p className="truncate font-semibold">{e.name}</p><p className="truncate text-charcoal/70">{e.villa_name} · {fmtDate(e.check_in)}</p></div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${e.status === 'New' ? 'bg-champagne/30' : e.status === 'Booked' ? 'bg-teal/25' : 'bg-sand'}`}>{e.status}</span></li>))}</ul>}</Card>
      </div>
    </>
  )
}
