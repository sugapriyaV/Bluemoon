import { BedDouble, Bath, Users, MapPin, MessageCircle } from 'lucide-react'
import SmartImage from './SmartImage'
import { inr, waLink, hasRates } from '../lib/config'
import { useGoTo } from './Navbar'

export default function VillaCard({ villa }) {
  const go = useGoTo()
  const photo = villa.photos?.[0]
  return (
    <article className="group flex flex-col overflow-hidden rounded-[28px] bg-white shadow-soft transition duration-500 hover:-translate-y-1.5">
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage src={photo} alt={`${villa.name} exterior`} className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105" />
        <span className={`absolute left-4 top-4 rounded-full px-3.5 py-1.5 text-xs font-semibold ${villa.available ? 'bg-white text-teal-dark' : 'bg-navy text-white'}`}>{villa.available ? 'Available' : 'Fully booked'}</span>
      </div>
      <div className="flex flex-1 flex-col p-7">
        <p className="flex items-center gap-1.5 text-sm text-teal-dark"><MapPin className="h-4 w-4" aria-hidden="true" />{villa.location}</p>
        <h3 className="mt-2 text-3xl font-semibold leading-tight">{villa.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{villa.short_description}</p>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <li className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-teal" aria-hidden="true" />{villa.bedrooms} BHK</li>
          {villa.bathrooms && <li className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-teal" aria-hidden="true" />{villa.bathrooms} Bathrooms</li>}
          {villa.max_guests && <li className="flex items-center gap-1.5"><Users className="h-4 w-4 text-teal" aria-hidden="true" />Up to {villa.max_guests} guests</li>}
        </ul>
        {hasRates(villa) ? (<>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-sand text-center">
            <div className="bg-seafoam/60 py-3"><p className="text-xs text-charcoal/70">Weekday</p><p className="font-semibold text-navy">{inr(villa.weekday_price)}</p></div>
            <div className="bg-seafoam/60 py-3"><p className="text-xs text-charcoal/70">Weekend</p><p className="font-semibold text-navy">{inr(villa.weekend_price)}</p></div>
          </div>
          <p className="mt-1.5 text-center text-xs text-charcoal/60">per night</p></>
        ) : <p className="mt-6 rounded-2xl bg-seafoam/60 py-3 text-center text-sm font-medium text-navy">Rates on request</p>}
        <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
          <button onClick={() => go('contact', { villa: villa.slug })} className="btn-primary">Enquire Now</button>
          <a href={waLink(`Hi, I'm interested in booking ${villa.name}. Could you please share the details?`)} target="_blank" rel="noopener noreferrer" className="btn-wa"><MessageCircle className="h-4 w-4" aria-hidden="true" />WhatsApp</a>
        </div>
      </div>
    </article>
  )
}
