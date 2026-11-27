import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { inr, hasRates } from '../lib/config'
import { Card, PageHead, Toast, } from './ui'
import { ConfirmModal } from './ui'
import SmartImage from '../components/SmartImage'
import { BUCKET, pathFromUrl } from './data'

export default function VillasAdmin() {
  const [rows, setRows] = useState(null), [del, setDel] = useState(null), [busy, setBusy] = useState(false), [toast, setToast] = useState(null)
  const load = useCallback(async () => { const { data, error } = await supabase.from('villas').select('*').order('sort_order'); if (error) setToast({ type: 'error', msg: 'Could not load villas.' }); setRows(data || []) }, [])
  useEffect(() => { load() }, [load])

  const toggle = async (v) => {
    const { error } = await supabase.from('villas').update({ available: !v.available }).eq('id', v.id)
    if (error) return setToast({ type: 'error', msg: 'Update failed.' })
    setRows((r) => r.map((x) => (x.id === v.id ? { ...x, available: !v.available } : x)))
  }
  const remove = async () => {
    setBusy(true)
    const paths = (del.photos || []).map(pathFromUrl).filter(Boolean)
    const { error } = await supabase.from('villas').delete().eq('id', del.id)
    if (error) setToast({ type: 'error', msg: 'Delete failed.' })
    else { if (paths.length) await supabase.storage.from(BUCKET).remove(paths); setRows((r) => r.filter((x) => x.id !== del.id)); setToast({ msg: 'Villa deleted. The public site is updated.' }) }
    setBusy(false); setDel(null)
  }
  return (
    <>
      <PageHead title="Villas"><Link to="/admin/villas/new" className="btn-primary"><Plus className="h-4 w-4" aria-hidden="true" />Add villa</Link></PageHead>
      {!rows ? <div className="skeleton h-64" role="status" aria-label="Loading" /> : rows.length === 0 ? <Card><p className="text-center text-charcoal/70">No villas yet. Add your first villa.</p></Card> : (
        <div className="grid gap-5 lg:grid-cols-2">{rows.map((v) => (
          <Card key={v.id} className="flex flex-col gap-4 sm:flex-row">
            <div className="aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl sm:w-44"><SmartImage src={v.photos?.[0]} alt={`${v.name} cover`} className="h-full w-full object-cover" /></div>
            <div className="min-w-0 flex-1"><h2 className="truncate text-2xl">{v.name}</h2><p className="truncate text-sm text-charcoal/70">{v.location}</p>
              <p className="mt-1 text-sm">{v.bedrooms} BHK · {(v.photos || []).length} photos · {hasRates(v) ? `${inr(v.weekday_price)} / ${inr(v.weekend_price)}` : 'No rates'}</p>
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" role="switch" checked={!!v.available} onChange={() => toggle(v)} className="h-5 w-5 accent-[#397C7A]" />{v.available ? 'Available' : 'Fully booked'}</label>
              <div className="mt-4 flex gap-3"><Link to={`/admin/villas/${v.id}`} className="btn-outline !px-5 !py-2.5"><Pencil className="h-4 w-4" aria-hidden="true" />Edit</Link>
                <button onClick={() => setDel(v)} className="btn !px-5 !py-2.5 border border-[#B3261E]/40 text-[#B3261E] hover:bg-[#B3261E] hover:text-white"><Trash2 className="h-4 w-4" aria-hidden="true" />Delete</button></div></div>
          </Card>))}</div>)}
      {del && <ConfirmModal title="Delete this villa?" body={`“${del.name}” and its uploaded photos will be permanently removed from the website. This cannot be undone.`} onConfirm={remove} onCancel={() => setDel(null)} busy={busy} />}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  )
}
