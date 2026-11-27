import { useEffect, useMemo, useState } from 'react'
import { Download, Trash2, MessageCircle, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { csvCell, digits } from '../lib/safe'
import { Card, PageHead, Toast, ConfirmModal, Label } from './ui'
import { STATUSES, fmtDate } from './data'

export default function EnquiriesAdmin() {
  const [rows, setRows] = useState(null), [toast, setToast] = useState(null), [del, setDel] = useState(null)
  const [q, setQ] = useState(''), [villa, setVilla] = useState(''), [status, setStatus] = useState(''), [from, setFrom] = useState(''), [to, setTo] = useState('')
  useEffect(() => { supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(2000).then(({ data, error }) => { if (error) setToast({ type: 'error', msg: 'Could not load enquiries.' }); setRows(data || []) }) }, [])

  const villas = useMemo(() => [...new Set((rows || []).map((r) => r.villa_name).filter(Boolean))], [rows])
  const list = useMemo(() => (rows || []).filter((r) => {
    const s = q.trim().toLowerCase()
    if (s && !`${r.name} ${r.phone} ${r.email}`.toLowerCase().includes(s)) return false
    if (villa && r.villa_name !== villa) return false
    if (status && r.status !== status) return false
    const d = r.created_at.slice(0, 10); if (from && d < from) return false; if (to && d > to) return false
    return true
  }), [rows, q, villa, status, from, to])

  const setStat = async (r, s) => {
    const prev = r.status; setRows((x) => x.map((y) => (y.id === r.id ? { ...y, status: s } : y)))
    const { error } = await supabase.from('enquiries').update({ status: s }).eq('id', r.id)
    if (error) { setRows((x) => x.map((y) => (y.id === r.id ? { ...y, status: prev } : y))); setToast({ type: 'error', msg: 'Could not update status.' }) }
  }
  const remove = async () => {
    const { error } = await supabase.from('enquiries').delete().eq('id', del.id)
    if (error) setToast({ type: 'error', msg: 'Delete failed.' }); else { setRows((x) => x.filter((y) => y.id !== del.id)); setToast({ msg: 'Enquiry deleted.' }) }
    setDel(null)
  }
  const exportCsv = () => {
    const head = ['Received', 'Name', 'Phone', 'Email', 'Villa', 'Check-in', 'Check-out', 'Guests', 'Estimate (INR)', 'Status', 'Message']
    const body = list.map((r) => [r.created_at, r.name, r.phone, r.email, r.villa_name, r.check_in, r.check_out, r.guests, r.total_estimate, r.status, r.message].map(csvCell).join(','))
    const url = URL.createObjectURL(new Blob(['\ufeff' + [head.map(csvCell).join(','), ...body].join('\r\n')], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a'); a.href = url; a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(url)
  }
  const sel = 'field !py-2.5'
  return (
    <>
      <PageHead title="Enquiries"><button onClick={exportCsv} disabled={!list.length} className="btn-primary disabled:opacity-50"><Download className="h-4 w-4" aria-hidden="true" />Export CSV ({list.length})</button></PageHead>
      <Card className="mb-5"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2"><Label id="f-q">Search</Label><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/50" aria-hidden="true" /><input id="f-q" className={`${sel} pl-9`} placeholder="Name, phone or email" value={q} onChange={(e) => setQ(e.target.value)} maxLength={80} /></div></div>
        <div><Label id="f-v">Villa</Label><select id="f-v" className={sel} value={villa} onChange={(e) => setVilla(e.target.value)}><option value="">All</option>{villas.map((v) => <option key={v}>{v}</option>)}</select></div>
        <div><Label id="f-s">Status</Label><select id="f-s" className={sel} value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div className="grid grid-cols-2 gap-2"><div><Label id="f-f">From</Label><input id="f-f" type="date" className={sel} value={from} onChange={(e) => setFrom(e.target.value)} /></div><div><Label id="f-t">To</Label><input id="f-t" type="date" className={sel} value={to} onChange={(e) => setTo(e.target.value)} /></div></div>
      </div></Card>
      {!rows ? <div className="skeleton h-64" role="status" aria-label="Loading" /> : list.length === 0 ? <Card><p className="text-center text-charcoal/70">No enquiries match.</p></Card> : (
        <ul className="space-y-4">{list.map((r) => (
          <li key={r.id}><Card className="grid gap-4 lg:grid-cols-[1.4fr_1.2fr_1fr_auto] lg:items-center">
            <div className="min-w-0"><p className="font-semibold">{r.name}</p><p className="truncate text-sm text-charcoal/70">{r.phone} · {r.email}</p><p className="mt-1 text-xs text-charcoal/60">Received {fmtDate(r.created_at)}</p></div>
            <div className="text-sm"><p className="font-medium">{r.villa_name}</p><p>{fmtDate(r.check_in)} → {fmtDate(r.check_out)} · {r.guests} guests</p>{r.total_estimate ? <p className="text-charcoal/70">Est. ₹{Number(r.total_estimate).toLocaleString('en-IN')}</p> : null}{r.message && <p className="mt-1 line-clamp-2 text-charcoal/70">“{r.message}”</p>}</div>
            <div><Label id={`st-${r.id}`}>Status</Label><select id={`st-${r.id}`} className={sel} value={r.status} onChange={(e) => setStat(r, e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div className="flex gap-2"><a href={`https://wa.me/91${digits(r.phone)}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${r.name}`} className="rounded-full bg-[#1B8F4B] p-3 text-white hover:bg-[#157239]"><MessageCircle className="h-4 w-4" /></a>
              <button onClick={() => setDel(r)} aria-label={`Delete enquiry from ${r.name}`} className="rounded-full border border-[#B3261E]/40 p-3 text-[#B3261E] hover:bg-[#B3261E] hover:text-white"><Trash2 className="h-4 w-4" /></button></div>
          </Card></li>))}</ul>)}
      {del && <ConfirmModal title="Delete this enquiry?" body={`The enquiry from ${del.name} will be permanently removed.`} onConfirm={remove} onCancel={() => setDel(null)} />}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  )
}
