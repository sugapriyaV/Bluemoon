import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ArrowDown, BedDouble, Waves, MessageCircle, Phone, Mail } from 'lucide-react'
import { useVillas } from '../lib/useVillas'
import { useTitle } from '../lib/useTitle'
import { useScrollAnimations, reducedMotion } from '../lib/useReveal'
import { AMENITY_GROUPS } from '../data/amenities'
import { PHONE, EMAIL, waLink, inr, hasRates } from '../lib/config'
import { useGoTo } from '../components/Navbar'
import SmartImage from '../components/SmartImage'
import VillaCard from '../components/VillaCard'
import Lightbox from '../components/Lightbox'
import FillText from '../components/FillText'
import Enquiry from '../components/Enquiry'
import Location from '../components/Location'
import { Loading } from '../components/Skeletons'

const Head = ({ eyebrow, title, className = '' }) => (
  <div className={className} data-reveal><p className="eyebrow">{eyebrow}</p><h2 className="mt-3 text-4xl leading-[1.05] md:text-6xl">{title}</h2></div>
)

export default function Home() {
  useTitle('', 'Bluemoon Beach House – private 3 BHK beach villas in Mahabalipuram and on ECR, Vadanemmeli.')
  const { villas, photos, loading } = useVillas()
  const { state } = useLocation()
  const go = useGoTo()
  const root = useRef(null)
  const [lb, setLb] = useState(null)
  useScrollAnimations(root, [loading, photos.length])

  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-word', { yPercent: 115, duration: 1.2, stagger: 0.1, ease: 'power4.out', delay: 0.15 })
      gsap.from('.hero-fade', { y: 26, opacity: 0, duration: 1, stagger: 0.14, ease: 'power3.out', delay: 0.8 })
      gsap.from('.hero-card', { y: 40, opacity: 0, duration: 1.1, stagger: 0.16, ease: 'power3.out', delay: 1.1 })
      gsap.fromTo('.hero-img', { scale: 1.12 }, { scale: 1, duration: 2.4, ease: 'power2.out' })
      gsap.to('.hero-img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [loading])

  // Arrived from another route (or a "Book Now" on /villas): scroll to requested section.
  useEffect(() => {
    if (!state?.scrollTo || loading) return
    const t = setTimeout(() => { go(state.scrollTo); if (state.villa) window.dispatchEvent(new CustomEvent('pick-villa', { detail: state.villa })) }, 150)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, loading])

  const heroPhoto = photos[0]
  const bedrooms = villas.length && villas.every((v) => v.bedrooms === villas[0].bedrooms) ? villas[0].bedrooms : null
  const rates = villas.filter(hasRates).map((v) => Number(v.weekday_price))
  const words = 'A quiet beach house, entirely yours'.split(' ')

  return (
    <div ref={root}>
      {/* HERO */}
      <section id="top" className="hero relative flex min-h-[100svh] items-end overflow-hidden bg-navy pb-14 pt-32 md:pb-20">
        {heroPhoto && <div className="absolute inset-0 overflow-hidden"><SmartImage src={heroPhoto.src} alt={heroPhoto.alt} eager className="hero-img h-[115%] w-full object-cover" /></div>}
        <div className="absolute inset-0 bg-navy/45" aria-hidden="true" />
        <div className="container-x relative z-10 grid items-end gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="text-white">
            <p className="hero-fade eyebrow !text-seafoam">Mahabalipuram · East Coast Road</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-medium leading-[1.02] !text-white md:text-7xl lg:text-8xl" aria-label="A quiet beach house, entirely yours">
              {words.map((w, i) => <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-bottom" aria-hidden="true"><span className="hero-word inline-block">{w}</span></span>)}
            </h1>
            <p className="hero-fade mt-6 max-w-lg text-base leading-relaxed text-white/90 md:text-lg">Private 3 BHK villas near the beach in Mahabalipuram and on East Coast Road at Vadanemmeli.</p>
            <div className="hero-fade mt-8 flex flex-wrap gap-3">
              <a href="/#villas" onClick={(e) => { e.preventDefault(); go('villas') }} className="btn-light">Explore Villas</a>
              <a href="/#contact" onClick={(e) => { e.preventDefault(); go('contact') }} className="btn border border-white/60 text-white hover:bg-white hover:text-navy">Book Your Stay</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div className="hero-card glass rounded-3xl p-5 text-white"><BedDouble className="h-5 w-5" aria-hidden="true" /><p className="mt-2 font-serif text-3xl text-white">{bedrooms ? `${bedrooms} BHK` : `${villas.length} villas`}</p><p className="text-sm text-white/85">Private villas</p></div>
            <div className="hero-card glass rounded-3xl p-5 text-white"><Waves className="h-5 w-5" aria-hidden="true" /><p className="mt-2 font-serif text-3xl text-white">Pool & BBQ</p><p className="text-sm text-white/85">{rates.length ? `From ${inr(Math.min(...rates))} / night` : 'Rates on request'}</p></div>
          </div>
        </div>
        <ArrowDown className="absolute bottom-5 left-1/2 hidden h-5 w-5 -translate-x-1/2 animate-bounce text-white/70 motion-reduce:hidden md:block" aria-hidden="true" />
      </section>

      {/* ABOUT */}
      <section id="about" className="container-x py-24 md:py-32">
        <FillText className="mx-auto max-w-5xl text-center font-serif text-4xl leading-[1.15] text-navy md:text-6xl" text="Private 3 BHK villas by the sea, with a pool, games and space to slow down." />
        <div className={`mt-16 grid items-center gap-10 ${photos.length > 1 ? 'lg:grid-cols-2' : 'mx-auto max-w-2xl'}`}>
          {photos.length > 1 && (
            <div className="relative">
              <div data-mask className="aspect-[4/5] overflow-hidden rounded-[28px]"><SmartImage src={photos[1].src} alt={photos[1].alt} className="h-full w-full object-cover" /></div>
              {photos[2] && <div data-mask className="absolute -bottom-8 -right-3 hidden aspect-square w-2/5 overflow-hidden rounded-[28px] border-8 border-ivory md:block"><SmartImage src={photos[2].src} alt={photos[2].alt} className="h-full w-full object-cover" /></div>}
            </div>)}
          <div data-reveal>
            <p className="eyebrow">About Bluemoon Beach House</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Two villas, one easy beach stay</h2>
            <p className="mt-5 leading-relaxed text-charcoal/80">Bluemoon Beach House offers private 3 BHK villas — Blue Moon Beach Villa near the beach in Mahabalipuram, and The Ocean Drive Villas on East Coast Road at Vadanemmeli, Chengalpattu.</p>
            <p className="mt-4 leading-relaxed text-charcoal/80">Both come with a swimming pool, BBQ facilities, indoor and outdoor games, a kids' play area and the comforts of Wi-Fi, TV and air conditioning.</p>
            <a href="/#villas" onClick={(e) => { e.preventDefault(); go('villas') }} className="btn-outline mt-7">View the villas</a>
          </div>
        </div>
      </section>

      {/* VILLAS */}
      <section id="villas" className="bg-seafoam/50 py-24 md:py-32">
        <div className="container-x">
          <Head eyebrow="The Villas" title="Choose your beach escape" className="mb-12 max-w-2xl" />
          {loading ? <Loading /> : villas.length === 0 ? <p className="rounded-3xl bg-white p-10 text-center">Villas will be listed here soon.</p>
            : <div className="grid gap-8 md:grid-cols-2" data-stagger>{villas.map((v) => <VillaCard key={v.id} villa={v} />)}</div>}
        </div>
      </section>

      {/* AMENITIES */}
      <section id="amenities" className="container-x py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Head eyebrow="Amenities" title="Everything in place for a relaxed stay" />
            {photos[3] && <div data-mask className="mt-10 hidden aspect-[4/3] overflow-hidden rounded-[28px] lg:block"><SmartImage src={photos[3].src} alt={photos[3].alt} className="h-full w-full object-cover" /></div>}
          </div>
          <ol className="divide-y divide-navy/15" data-stagger>
            {AMENITY_GROUPS.map((g, n) => (
              <li key={g.title} className="py-7 first:pt-0">
                <div className="flex items-baseline gap-5"><span className="font-serif text-3xl text-teal">{String(n + 1).padStart(2, '0')}</span><h3 className="text-3xl font-medium">{g.title}</h3></div>
                <ul className="mt-4 flex flex-wrap gap-2.5 pl-12 md:pl-14">
                  {g.items.map((it) => <li key={it.name} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-sm"><it.icon className="h-4 w-4 text-teal" aria-hidden="true" />{it.name}</li>)}
                </ul>
              </li>))}
          </ol>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="bg-sand/50 py-24 md:py-32">
        <div className="container-x">
          <Head eyebrow="Gallery" title="Inside the villas" className="mb-12" />
          {photos.length === 0 ? <p className="rounded-3xl bg-white p-10 text-center text-charcoal/70">Photos of the villas are coming soon.</p> : (
            <div className="grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4 md:gap-4" data-stagger>
              {photos.slice(0, 9).map((p, i) => (
                <button key={p.src} onClick={() => setLb(i)} aria-label={`Open photo: ${p.alt}`}
                  className={`group relative overflow-hidden rounded-3xl ${[0, 5].includes(i) ? 'col-span-2 row-span-2' : ''}`}>
                  <SmartImage src={p.src} alt={p.alt} className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-110" />
                  <span className="absolute inset-0 bg-navy/0 transition group-hover:bg-navy/25" aria-hidden="true" />
                </button>))}
            </div>)}
        </div>
      </section>
      <Lightbox items={photos} index={lb} onClose={() => setLb(null)} onChange={setLb} />

      {/* LOCATION */}
      <section id="location" className="container-x py-24 md:py-32">
        <Head eyebrow="Location" title="Find us on the coast" className="mb-12" />
        <Location villas={villas} />
      </section>

      {/* CONTACT / BOOKING */}
      <section id="contact" className="bg-navy py-24 md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="text-white" data-reveal>
            <p className="eyebrow !text-seafoam">Book Your Stay</p>
            <h2 className="mt-3 text-4xl !text-white md:text-6xl">Send us your dates</h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/80">Share your stay details and we'll continue the conversation on WhatsApp.</p>
            <ul className="mt-8 space-y-4 text-sm">
              <li><a className="flex items-center gap-3 hover:text-seafoam" href={`tel:+91${PHONE}`}><Phone className="h-5 w-5" aria-hidden="true" />{PHONE}</a></li>
              <li><a className="flex items-center gap-3 hover:text-seafoam" href={`mailto:${EMAIL}`}><Mail className="h-5 w-5" aria-hidden="true" />{EMAIL}</a></li>
              <li><a className="flex items-center gap-3 hover:text-seafoam" href={waLink()} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-5 w-5" aria-hidden="true" />Chat on WhatsApp</a></li>
            </ul>
          </div>
          <div data-reveal><Enquiry villas={villas} /></div>
        </div>
      </section>
    </div>
  )
}
