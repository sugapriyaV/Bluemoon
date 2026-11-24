import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, BedDouble, Bath, Users, MapPin, MessageCircle } from 'lucide-react'
import SmartImage from './SmartImage'
import { inr, waLink } from '../lib/config'

export default function VillaCard({ villa }) {
  const [i, setI] = useState(0)
  const photos = villa.photos?.length ? villa.photos : []
  const go = (d) => (e) => { e.preventDefault(); setI((i + d + photos.length) % photos.length) }

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-soft transition hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        {photos[i] && <SmartImage src={photos[i]} alt={`${villa.name} – photo ${i + 1}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
        {photos.length > 1 && (<>
          <button onClick={go(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"><ChevronLeft className="h-5 w-5" /></button>
          <button onClick={go(1)} aria-label="Next photo" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"><ChevronRight className="h-5 w-5" /></button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
            {photos.slice(0, 7).map((_, n) => <span key={n} className={`h-1.5 rounded-full transition-all ${n === i ? 'w-5 bg-white' : 'w-1.5 bg-white/60'}`} />)}
          </div>
        </>)}
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${villa.available ? 'bg-teal-dark' : 'bg-coral-dark'}`}>{villa.available ? 'Available' : 'Fully booked'}</span>
      </div>
      <div className="p-6">
        <p className="flex items-center gap-1.5 text-sm font-medium text-teal-dark"><MapPin className="h-4 w-4" aria-hidden="true" />{villa.location}</p>
        <h3 className="mt-1 text-2xl font-bold">{villa.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">{villa.short_description}</p>
        <ul className="mt-4 flex flex-wrap gap-4 text-sm text-ink/80">
          <li className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-ocean" aria-hidden="true" />{villa.bedrooms} BHK</li>
          <li className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-ocean" aria-hidden="true" />{villa.bathrooms} Baths</li>
          <li className="flex items-center gap-1.5"><Users className="h-4 w-4 text-ocean" aria-hidden="true" />Up to {villa.max_guests}</li>
        </ul>
        <div className="mt-5 flex items-end justify-between border-t border-sand pt-4">
          <div><p className="text-xs uppercase tracking-wide text-ink/60">Weekday / Weekend</p>
            <p className="text-lg font-semibold text-ocean">{inr(villa.weekday_price)} <span className="text-ink/40">/</span> {inr(villa.weekend_price)}</p>
            <p className="text-xs text-ink/60">per night</p></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link to={`/villas/${villa.slug}`} className="btn-ocean">View Details</Link>
          <a href={waLink(`Hi, I'm interested in booking ${villa.name}. Could you please share the details?`)} target="_blank" rel="noopener noreferrer" className="btn-wa"><MessageCircle className="h-4 w-4" aria-hidden="true" />Enquire</a>
        </div>
      </div>
    </article>
  )
}
