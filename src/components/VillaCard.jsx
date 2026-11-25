import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, BedDouble, Bath, Users, MapPin, MessageCircle } from 'lucide-react'
import SmartImage from './SmartImage'
import Tilt from './Tilt'
import { inr, waLink, hasRates } from '../lib/config'

export default function VillaCard({ villa, className = '' }) {
  const [i, setI] = useState(0)
  const photos = villa.photos || []
  const step = (d) => (e) => { e.preventDefault(); e.stopPropagation(); setI((i + d + photos.length) % photos.length) }
  return (
    <Tilt className={`rounded-[28px] bg-cream shadow-soft ${className}`}>
      <article className="group flex h-full flex-col overflow-hidden rounded-[28px]">
        <div className="relative aspect-[4/3] overflow-hidden bg-sand">
          <Link to={`/villas/${villa.slug}`} data-cursor="View" aria-label={`View ${villa.name}`} className="block h-full w-full">
            <SmartImage src={photos[i]} alt={`${villa.name} – photo ${i + 1}`} className="h-full w-full object-cover transition duration-[1400ms] ease-out group-hover:scale-110" />
            <span className="absolute inset-0 bg-gradient-to-t from-navy/45 to-transparent opacity-70" aria-hidden="true" />
          </Link>
          {photos.length > 1 && (<>
            <button onClick={step(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-cream/90 p-2 opacity-0 transition hover:bg-cream focus:opacity-100 group-hover:opacity-100 max-md:opacity-100"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={step(1)} aria-label="Next photo" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-cream/90 p-2 opacity-0 transition hover:bg-cream focus:opacity-100 group-hover:opacity-100 max-md:opacity-100"><ChevronRight className="h-5 w-5" /></button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
              {photos.map((_, n) => <span key={n} className={`h-1.5 rounded-full transition-all duration-500 ${n === i ? 'w-6 bg-champagne' : 'w-1.5 bg-white/70'}`} />)}
            </div>
          </>)}
          <span data-depth="10" className={`absolute left-4 top-4 rounded-full px-3.5 py-1.5 text-xs font-semibold ${villa.available ? 'bg-cream text-teal-dark' : 'bg-navy text-cream'}`}>{villa.available ? 'Available' : 'Fully booked'}</span>
        </div>
        <div className="flex flex-1 flex-col p-7">
          <p className="flex items-center gap-1.5 text-sm text-teal-dark"><MapPin className="h-4 w-4" aria-hidden="true" />{villa.location}</p>
          <h3 data-depth="6" className="mt-2 text-3xl font-semibold leading-tight">{villa.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{villa.short_description}</p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <li className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-champagne-dark" aria-hidden="true" />{villa.bedrooms} BHK</li>
            {villa.bathrooms && <li className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-champagne-dark" aria-hidden="true" />{villa.bathrooms} Bathrooms</li>}
            {villa.max_guests && <li className="flex items-center gap-1.5"><Users className="h-4 w-4 text-champagne-dark" aria-hidden="true" />Up to {villa.max_guests} guests</li>}
          </ul>
          <div data-depth="8" className="mt-6">
            {hasRates(villa) ? (
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-sand text-center">
                <div className="bg-ivory py-3"><p className="text-xs text-charcoal/70">Weekday / night</p><p className="font-semibold text-navy">{inr(villa.weekday_price)}</p></div>
                <div className="bg-ivory py-3"><p className="text-xs text-charcoal/70">Weekend / night</p><p className="font-semibold text-navy">{inr(villa.weekend_price)}</p></div>
              </div>) : <p className="rounded-2xl bg-ivory py-3 text-center text-sm font-medium text-navy">Rates on request</p>}
          </div>
          <div className="mt-auto grid gap-3 pt-6">
            <Link to={`/villas/${villa.slug}`} className="btn-primary">View Details</Link>
            <div className="grid grid-cols-2 gap-3">
              <Link to={`/contact?villa=${villa.slug}`} className="btn-outline">Enquire</Link>
              <a href={waLink(`Hi, I'm interested in booking ${villa.name}. Could you please share the details?`)} target="_blank" rel="noopener noreferrer" className="btn-wa"><MessageCircle className="h-4 w-4" aria-hidden="true" />WhatsApp</a>
            </div>
          </div>
        </div>
      </article>
    </Tilt>
  )
}
