import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { UploadCloud, ArrowLeft, ArrowRight, Trash2, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { AMENITY_GROUPS } from '../data/amenities'
import { clean, cleanMultiline, safeUrl } from '../lib/safe'
import { Card, PageHead, Label, Toast, ConfirmModal } from './ui'
import SmartImage from '../components/SmartImage'
import { BUCKET, MAX_PHOTO_BYTES, slugify, pathFromUrl, sniffImage } from './data'

const ALL_AMENITIES = AMENITY_GROUPS.flatMap((g) => g.items.map((i) => i.name))
const BLANK = { name: '', slug: '', location: '', short_description: '', long_description: '', bedrooms: 3, bathrooms: 3, max_guests: 12, weekday_price: '', weekend_price: '', map_link: '', available: true, sort_order: 0, amenities: ALL_AMENITIES, photos: [] }
const MAX_PHOTOS = 20

export default function VillaForm() {
  const { id } = useParams(); const nav = useNavigate(); const isNew = !id
  const [f, setF] = useState(BLANK), [loading, setLoading] = useState(!isNew)
  const [errs, setErrs] = useState({}), [saving, setSaving] = useState(false), [uploading, setUploading] = useState(0)
  const [slugTouched, setSlugTouched] = useState(!isNew), [removed, setRemoved] = useState([]), [delPhoto, setDelPhoto] = useState(null), [toast, setToast] = useState(null)

  useEffect(() => {
    if (isNew) return
    supabase.from('villas').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (!data) { setToast({ type: 'error', msg: 'Villa not found.' }); setLoading(false); return }
      setF({ ...BLANK, ...data, amenities: Array.isArray(data.amenities) && data.amenities.length ? data.amenities : ALL_AMENITIES, photos: data.photos || [], weekday_price: data.weekday_price ?? '', weekend_price: data.weekend_price ?? '' }); setLoading(false)
    })
  }, [id, isNew])

  const set = (k) => (e) => { const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value; setF((p) => ({ ...p, [k]: v, ...(k === 'name' && !slugTouched ? { slug: slugify(v) } : {}) })) }

  const upload = async (files) => {
    const list = [...files]; if (!list.length) return
    if (f.photos.length + list.length > MAX_PHOTOS) return setToast({ type: 'error', msg: `A villa can have at most ${MAX_PHOTOS} photos.` })
    setUploading(list.length); const urls = []
    for (const file of list) {
      try {
        if (file.size > MAX_PHOTO_BYTES) throw new Error(`${file.name}: larger than 5 MB.`)
        const kind = await sniffImage(file); if (!kind) throw new Error(`${file.name}: only real JPG or PNG files are allowed.`)
        const path = `villas/${crypto.randomUUID()}.${kind.ext}`
        const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: kind.type, upsert: false, cacheControl: '31536000' })
        if (error) throw new Error(`${file.name}: upload failed.`)
        urls.push(supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl)
      } catch (e) { setToast({ type: 'error', msg: e.message }) }
    }
    setF((p) => ({ ...p, photos: [...p.photos, ...urls] })); setUploading(0)
    if (urls.length) setToast({ msg: `${urls.length} photo${urls.length > 1 ? 's' : ''} uploaded. Save the villa to publish.` })
  }
  const move = (i, d) => setF((p) => { const a = [...p.photos], j = i + d; if (j < 0 || j >= a.length) return p; [a[i], a[j]] = [a[j], a[i]]; return { ...p, photos: a } })
  const cover = (i) => setF((p) => { const a = [...p.photos]; const [x] = a.splice(i, 1); return { ...p, photos: [x, ...a] } })
  const dropPhoto = () => { const url = delPhoto; setF((p) => ({ ...p, photos: p.photos.filter((x) => x !== url) })); const path = pathFromUrl(url); if (path) setRemoved((r) => [...r, path]); setDelPhoto(null) }
  const toggleAmenity = (n) => setF((p) => ({ ...p, amenities: p.amenities.includes(n) ? p.amenities.filter((x) => x !== n) : [...p.amenities, n] }))

  const validate = () => {
    const e = {}, num = (v) => Number(v)
    if (clean(f.name, 120).length < 2) e.name = 'Enter the villa name.'
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(f.slug)) e.slug = 'Use lowercase letters, numbers and hyphens only.'
    if (!clean(f.location, 120)) e.location = 'Enter the location.'
    if (!Number.isInteger(num(f.bedrooms)) || num(f.bedrooms) < 1 || num(f.bedrooms) > 20) e.bedrooms = '1–20.'
    if (f.bathrooms !== '' && (!Number.isInteger(num(f.bathrooms)) || num(f.bathrooms) < 0 || num(f.bathrooms) > 20)) e.bathrooms = '0–20.'
    if (!Number.isInteger(num(f.max_guests)) || num(f.max_guests) < 1 || num(f.max_guests) > 100) e.max_guests = '1–100.'
    for (const k of ['weekday_price', 'weekend_price']) if (!(num(f[k]) >= 0) || f[k] === '' || num(f[k]) > 10000000) e[k] = 'Enter a price (₹).'
    if (f.map_link && !/^https:\/\/(www\.google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(f.map_link.trim())) e.map_link = 'Use a Google Maps https link.'
    return e
  }
  const save = async (ev) => {
    ev.preventDefault(); const e = validate(); setErrs(e)
    if (Object.keys(e).length) { document.getElementById(`v-${Object.keys(e)[0]}`)?.focus(); return setToast({ type: 'error', msg: 'Please fix the highlighted fields.' }) }
    setSaving(true)
    const row = { name: clean(f.name, 120), slug: f.slug, location: clean(f.location, 120), short_description: cleanMultiline(f.short_description, 300), long_description: cleanMultiline(f.long_description, 3000),
      bedrooms: Number(f.bedrooms), bathrooms: f.bathrooms === '' ? null : Number(f.bathrooms), max_guests: Number(f.max_guests), weekday_price: Number(f.weekday_price), weekend_price: Number(f.weekend_price),
      map_link: f.map_link ? safeUrl(f.map_link) : null, available: !!f.available, sort_order: Number(f.sort_order) || 0, amenities: f.amenities, photos: f.photos.map(safeUrl).filter(Boolean) }
    const { error } = isNew ? await supabase.from('villas').insert(row) : await supabase.from('villas').update(row).eq('id', id)
    setSaving(false)
    if (error) return setToast({ type: 'error', msg: error.code === '23505' ? 'That slug is already used by another villa.' : 'Could not save. Check your inputs and try again.' })
    if (removed.length) await supabase.storage.from(BUCKET).remove(removed)
    nav('/admin/villas', { replace: true })
  }

  if (loading) return <div className="skeleton h-96" role="status" aria-label="Loading" />
  const input = (k, label, props = {}) => (<div className={props.wide ? 'sm:col-span-2' : ''}><Label id={`v-${k}`}>{label}</Label>
    <input id={`v-${k}`} className={`field ${errs[k] ? 'field-err' : ''}`} value={f[k] ?? ''} onChange={set(k)} aria-invalid={!!errs[k]} {...props} wide={undefined} />{errs[k] && <p role="alert" className="mt-1 text-xs font-medium text-[#B3261E]">{errs[k]}</p>}</div>)
  return (
    <form onSubmit={save} noValidate>
      <PageHead title={isNew ? 'Add villa' : 'Edit villa'}><Link to="/admin/villas" className="btn-outline">Cancel</Link><button type="submit" disabled={saving || uploading > 0} className="btn-primary disabled:opacity-60">{saving ? 'Saving…' : 'Save villa'}</button></PageHead>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card><h2 className="mb-4 text-2xl">Details</h2><div className="grid gap-5 sm:grid-cols-2">
            {input('name', 'Villa name', { wide: true, maxLength: 120 })}
            <div className="sm:col-span-2"><Label id="v-slug">Page address (slug)</Label><div className="flex items-center gap-2"><span className="shrink-0 text-sm text-charcoal/60">/villas/</span><input id="v-slug" className={`field ${errs.slug ? 'field-err' : ''}`} value={f.slug} maxLength={80} onChange={(e) => { setSlugTouched(true); setF((p) => ({ ...p, slug: slugify(e.target.value) })) }} /></div>{errs.slug && <p role="alert" className="mt-1 text-xs font-medium text-[#B3261E]">{errs.slug}</p>}</div>
            {input('location', 'Location', { wide: true, maxLength: 120 })}
            <div className="sm:col-span-2"><Label id="v-short_description">Short description</Label><textarea id="v-short_description" rows={2} maxLength={300} className="field" value={f.short_description || ''} onChange={set('short_description')} /></div>
            <div className="sm:col-span-2"><Label id="v-long_description">Long description</Label><textarea id="v-long_description" rows={6} maxLength={3000} className="field" value={f.long_description || ''} onChange={set('long_description')} /></div>
            {input('bedrooms', 'Bedrooms', { type: 'number', min: 1, max: 20 })}{input('bathrooms', 'Bathrooms', { type: 'number', min: 0, max: 20 })}
            {input('max_guests', 'Max guests', { type: 'number', min: 1, max: 100 })}{input('sort_order', 'Display order', { type: 'number' })}
            {input('weekday_price', 'Weekday price / night (₹)', { type: 'number', min: 0 })}{input('weekend_price', 'Weekend price / night (₹)', { type: 'number', min: 0 })}
            {input('map_link', 'Google Maps link', { wide: true, type: 'url', placeholder: 'https://www.google.com/maps/…' })}
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium sm:col-span-2"><input type="checkbox" role="switch" checked={!!f.available} onChange={set('available')} className="h-5 w-5 accent-[#397C7A]" />Available for booking</label>
          </div></Card>
          <Card><h2 className="mb-4 text-2xl">Amenities</h2><div className="grid gap-5 sm:grid-cols-2">{AMENITY_GROUPS.map((g) => (
            <fieldset key={g.title}><legend className="mb-2 text-sm font-semibold text-navy">{g.title}</legend>{g.items.map((it) => (
              <label key={it.name} className="flex cursor-pointer items-center gap-2.5 py-1 text-sm"><input type="checkbox" checked={f.amenities.includes(it.name)} onChange={() => toggleAmenity(it.name)} className="h-4 w-4 accent-[#397C7A]" />{it.name}</label>))}</fieldset>))}</div></Card>
        </div>
        <Card className="h-fit"><h2 className="mb-1 text-2xl">Photos</h2><p className="mb-4 text-sm text-charcoal/70">JPG or PNG, up to 5 MB each. The first photo is the cover.</p>
          <label className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-teal/50 bg-seafoam/40 px-4 py-8 text-center text-sm transition hover:bg-seafoam ${f.photos.length >= MAX_PHOTOS ? 'pointer-events-none opacity-50' : ''}`}>
            <UploadCloud className="h-8 w-8 text-teal-dark" aria-hidden="true" /><span className="font-semibold">{uploading ? `Uploading ${uploading}…` : 'Click to choose photos (multiple)'}</span>
            <input type="file" multiple accept="image/jpeg,image/png" className="sr-only" disabled={uploading > 0} onChange={(e) => { upload(e.target.files); e.target.value = '' }} /></label>
          <ul className="mt-5 grid grid-cols-2 gap-3">{f.photos.map((u, i) => (
            <li key={u} className="overflow-hidden rounded-2xl border border-sand bg-white"><div className="relative aspect-[4/3]"><SmartImage src={u} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />{i === 0 && <span className="absolute left-2 top-2 rounded-full bg-champagne px-2.5 py-1 text-xs font-bold text-navy">Cover</span>}</div>
              <div className="flex items-center justify-between p-1.5">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move photo ${i + 1} earlier`} className="rounded-full p-2 hover:bg-sand disabled:opacity-30"><ArrowLeft className="h-4 w-4" /></button>
                <button type="button" onClick={() => cover(i)} disabled={i === 0} aria-label={`Make photo ${i + 1} the cover`} className="rounded-full p-2 hover:bg-sand disabled:opacity-30"><Star className="h-4 w-4" /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === f.photos.length - 1} aria-label={`Move photo ${i + 1} later`} className="rounded-full p-2 hover:bg-sand disabled:opacity-30"><ArrowRight className="h-4 w-4" /></button>
                <button type="button" onClick={() => setDelPhoto(u)} aria-label={`Delete photo ${i + 1}`} className="rounded-full p-2 text-[#B3261E] hover:bg-[#B3261E]/10"><Trash2 className="h-4 w-4" /></button></div></li>))}</ul>
          {f.photos.length === 0 && <p className="mt-4 text-sm text-charcoal/60">No photos yet.</p>}
        </Card>
      </div>
      {delPhoto && <ConfirmModal title="Delete this photo?" body="It will be removed from this villa when you save." onConfirm={dropPhoto} onCancel={() => setDelPhoto(null)} />}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </form>
  )
}
