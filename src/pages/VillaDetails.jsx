import { useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { BedDouble, Bath, Users, MapPin } from 'lucide-react'
import { useVillas } from '../lib/useVillas'
import { useTitle } from '../lib/useTitle'
import { useScrollAnimations } from '../lib/useReveal'
import { AMENITY_GROUPS } from '../data/amenities'
import { inr, hasRates, collectPhotos } from '../lib/config'
import SmartImage from '../components/SmartImage'
import Lightbox from '../components/Lightbox'
import Enquiry from '../components/Enquiry'
import Location from '../components/Location'
import Split from '../components/Split'
import NotFound from './NotFound'

export default function VillaDetails() {
  const { slug } = useParams()
  const { villas, loading } = useVillas()
  const villa = villas.find((v) => v.slug === slug)
  const [lb, setLb] = useState(null)
  const ref = useRef(null)
  useTitle(villa?.name || 'Villa', villa?.short_description)
  useScrollAnimations(ref, [loading, slug])
  if (loading) return <div className="min-h-screen bg-cream pt-40"><div className="container-x"><div className="skeleton h-[60vh]" /></div></div>
  if (!villa) return <NotFound />
  const photos = collectPhotos([villa])
  return (
    <div ref={ref}>
      <section className="relative flex min-h-[78svh] items-end overflow-hidden bg-navy pb-12 pt-32">
        <SmartImage src={photos[0]?.src} alt={photos[0]?.alt || villa.name} eager className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-navy/40" aria-hidden="true" />
        <div className="container-x relative z-10 text-white">
          <p className="flex items-center gap-2 text-sm text-champagne"><MapPin className="h-4 w-4" aria-hidden="true" />{villa.location}</p>
          <Split as="h1" text={villa.name} className="mt-3 max-w-4xl text-5xl !text-white md:text-7xl" />
          <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-sm text-white/90">
            <li className="flex items-center gap-2"><BedDouble className="h-4 w-4" aria-hidden="true" />{villa.bedrooms} BHK</li>
            {villa.bathrooms && <li className="flex items-center gap-2"><Bath className="h-4 w-4" aria-hidden="true" />{villa.bathrooms} Bathrooms</li>}
            {villa.max_guests && <li className="flex items-center gap-2"><Users className="h-4 w-4" aria-hidden="true" />Up to {villa.max_guests} guests</li>}
          </ul>
        </div>
      </section>

      <section className="container-x grid gap-14 py-20 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <div data-reveal><p className="eyebrow">About this villa</p><p className="mt-4 font-serif text-3xl leading-snug text-navy md:text-4xl">{villa.long_description || villa.short_description}</p></div>
          {hasRates(villa) && <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-sand text-center" data-reveal>
            <div className="bg-ivory py-6"><p className="text-xs uppercase tracking-wider text-charcoal/70">Weekday night</p><p className="mt-1 font-serif text-4xl text-navy">{inr(villa.weekday_price)}</p></div>
            <div className="bg-ivory py-6"><p className="text-xs uppercase tracking-wider text-charcoal/70">Weekend night</p><p className="mt-1 font-serif text-4xl text-navy">{inr(villa.weekend_price)}</p></div></div>}
          {photos.length > 0 && <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3" data-stagger>
            {photos.map((p, i) => <button key={p.src} onClick={() => setLb(i)} data-cursor="Open" aria-label={`Open photo ${i + 1}`} className={`group overflow-hidden rounded-3xl ${i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'}`}>
              <SmartImage src={p.src} alt={p.alt} className="h-full w-full object-cover transition duration-[1400ms] group-hover:scale-110" /></button>)}</div>}
          <div className="mt-16"><h2 className="text-4xl" data-reveal>Amenities</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2" data-stagger>{AMENITY_GROUPS.map((g) => <section key={g.title} className="rounded-3xl bg-ivory p-6"><h3 className="mb-3 text-2xl">{g.title}</h3>
              <ul className="space-y-2 text-sm">{g.items.map((it) => <li key={it.name} className="flex items-center gap-2.5"><it.icon className="h-4 w-4 text-teal-dark" aria-hidden="true" />{it.name}</li>)}</ul></section>)}</div></div>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Enquire about this villa"><h2 className="mb-5 text-3xl">Enquire about this villa</h2><Enquiry villas={villas} preset={villa.slug} /></aside>
      </section>

      <section className="container-x pb-24"><h2 className="mb-8 text-4xl" data-reveal>Location</h2><Location villas={[villa]} /></section>
      <div className="container-x pb-24"><Link to="/villas" className="btn-outline">← All villas</Link></div>
      <Lightbox items={photos} index={lb} onClose={() => setLb(null)} onChange={setLb} />
    </div>
  )
}
