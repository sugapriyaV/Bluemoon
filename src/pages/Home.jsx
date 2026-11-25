import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ShieldCheck, Waves, HeartHandshake, MessageCircle, Quote, Star, ArrowRight } from 'lucide-react'
import { useVillas } from '../lib/useVillas'
import { useTitle } from '../lib/useTitle'
import { useScrollAnimations, reducedMotion } from '../lib/useReveal'
import { HERO_IMG, WHY, TESTIMONIALS } from '../data/seedVillas'
import { AMENITY_GROUPS } from '../data/amenities'
import { waLink } from '../lib/config'
import SearchCard from '../components/SearchCard'
import VillaCard from '../components/VillaCard'
import SmartImage from '../components/SmartImage'
import Lightbox from '../components/Lightbox'
import FillText from '../components/FillText'
import Split from '../components/Split'
import Magnetic from '../components/Magnetic'
import Tilt from '../components/Tilt'
import HScroll from '../components/HScroll'
import Enquiry from '../components/Enquiry'
import Location from '../components/Location'
import { Loading } from '../components/Skeletons'

const ICONS = { ShieldCheck, Waves, HeartHandshake, MessageCircle }
const AMENITY_COUNT = AMENITY_GROUPS.reduce((n, g) => n + g.items.length, 0)

export default function Home() {
  useTitle('', 'Bluemoon Beach House – private 3BHK luxury beach villas near Mahabalipuram and on ECR, Chennai.')
  const { villas, photos, loading } = useVillas()
  const root = useRef(null)
  const [lb, setLb] = useState(null)
  useScrollAnimations(root, [loading, photos.length])

  // Cinematic hero: framed image opens to full-bleed, slow zoom, headline rises, CTAs/cards float in.
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.fromTo('.hero-media', { clipPath: 'inset(14% 10% 14% 10% round 36px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.9, ease: 'power4.inOut' })
        .fromTo('.hero-img', { scale: 1.3 }, { scale: 1.02, duration: 2.8, ease: 'power2.out' }, 0)
        .from('.hero-word', { yPercent: 118, duration: 1.2, stagger: 0.09 }, 0.9)
        .from('.hero-fade', { y: 28, opacity: 0, duration: 1, stagger: 0.14 }, 1.5)
        .from('.hero-search', { y: 50, opacity: 0, duration: 1.1 }, 1.8)
      gsap.to('.hero-img', { yPercent: 12, scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('.hero-copy', { yPercent: -14, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: '55% top', end: 'bottom top', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [])

  const words = 'Where the sea breeze meets your perfect getaway'.split(' ')
  const gallery = photos.slice(0, 12)

  return (
    <div ref={root}>
      {/* HERO */}
      <section className="hero relative flex min-h-[100svh] items-end overflow-hidden bg-navy pb-8 pt-32 md:pb-12">
        <div className="hero-media absolute inset-0 overflow-hidden"><SmartImage src={HERO_IMG} alt="Luxury villa with swimming pool at dusk" eager className="hero-img h-full w-full object-cover" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-navy/45" aria-hidden="true" />
        <div className="container-x relative z-10 w-full">
          <div className="hero-copy text-white">
            <p className="hero-fade eyebrow !text-champagne">Mahabalipuram · East Coast Road</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-medium leading-[1.02] !text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]" aria-label="Where the sea breeze meets your perfect getaway">
              {words.map((w, i) => <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom" aria-hidden="true"><span className="hero-word inline-block">{w}</span></span>)}
            </h1>
            <p className="hero-fade mt-5 max-w-xl text-base text-white/90 md:text-lg">Private 3BHK luxury villas with a pool, BBQ, games and sunsets — just minutes from the sea.</p>
            <div className="hero-fade mt-7 flex flex-wrap items-center gap-4">
              <Magnetic><Link to="/villas" className="btn-gold">Explore Villas <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></Magnetic>
              <Magnetic><a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-ghost-light">WhatsApp us</a></Magnetic>
            </div>
          </div>
          <div className="hero-search mt-10"><SearchCard villas={villas} /></div>
          <div className="mt-6 hidden justify-center md:flex" aria-hidden="true"><span className="relative block h-9 w-5 rounded-full border border-white/60"><span className="absolute left-1/2 top-2 h-1.5 w-1 -translate-x-1/2 animate-scrolldot rounded-full bg-champagne" /></span></div>
        </div>
      </section>

      {/* INTRO — scroll-filled statement + floating image composition */}
      <section className="container-x py-24 md:py-36">
        <p className="eyebrow text-center" data-reveal>Welcome to Bluemoon</p>
        <FillText className="mx-auto mt-6 max-w-5xl text-center font-serif text-4xl leading-[1.12] text-navy md:text-6xl lg:text-7xl" text="Not just a stay. A private beach house, a pool at golden hour and a world of sea and sunsets." />
        {photos.length > 2 && (
          <div className="relative mx-auto mt-20 grid max-w-5xl items-center gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div data-mask className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-float"><SmartImage src={photos[1].src} alt={photos[1].alt} data-parallax="6" className="absolute -top-[8%] h-[116%] w-full object-cover" /></div>
            <div className="relative md:-ml-24 md:mt-24"><div data-mask className="aspect-[4/5] overflow-hidden rounded-[28px] border-[10px] border-cream shadow-float animate-float"><SmartImage src={photos[8]?.src || photos[2].src} alt={photos[8]?.alt || photos[2].alt} className="h-full w-full object-cover" /></div></div>
          </div>)}
      </section>

      {/* FEATURED VILLAS — pinned horizontal scroll on desktop, swipeable row on touch */}
      <HScroll id="villas" className="bg-ivory py-20 lg:py-0" trackClass="items-stretch lg:items-center"
        header={<div className="flex items-end justify-between gap-6"><div><p className="eyebrow" data-reveal>Featured villas</p><Split text="Choose your beach escape" className="mt-3 text-4xl md:text-6xl" /></div><Link to="/villas" className="btn-outline hidden shrink-0 sm:inline-flex">View all villas</Link></div>}>
        {loading ? <div className="w-[85vw] sm:w-[440px]"><div className="skeleton h-[560px]" /></div> : villas.map((v) => <div key={v.id} className="w-[85vw] shrink-0 snap-center sm:w-[440px]"><VillaCard villa={v} className="h-full" /></div>)}
        <div className="flex w-[85vw] shrink-0 snap-center flex-col justify-center rounded-[28px] bg-navy p-10 text-cream sm:w-[420px]">
          <p className="eyebrow !text-champagne">Every villa includes</p>
          <ul className="mt-5 space-y-3 font-serif text-2xl">{['Private swimming pool', 'BBQ facilities', 'Indoor & outdoor games', "Kids' play area", 'Wi-Fi, TV & air conditioning'].map((t) => <li key={t} className="flex gap-3"><span className="text-champagne">—</span>{t}</li>)}</ul>
          <Link to="/contact" className="btn-gold mt-8 self-start">Enquire now</Link>
        </div>
      </HScroll>

      {/* AMENITIES — sticky heading, numbered groups */}
      <section className="container-x py-24 md:py-36">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow" data-reveal>Amenities</p>
            <Split text="Everything in place for a perfect stay" className="mt-3 text-4xl md:text-6xl" />
            <p className="mt-6 max-w-sm text-charcoal/75" data-reveal><span data-count={AMENITY_COUNT} className="font-serif text-5xl text-champagne-dark">0</span> <span className="text-sm">amenities across games, play, comfort and outdoor living.</span></p>
          </div>
          <ol className="divide-y divide-navy/15" data-stagger>
            {AMENITY_GROUPS.map((g, n) => (
              <li key={g.title} className="py-8 first:pt-0">
                <div className="flex items-center gap-5"><span className="font-serif text-4xl text-champagne-dark">{String(n + 1).padStart(2, '0')}</span><h3 className="text-3xl font-medium md:text-4xl">{g.title}</h3></div>
                <ul className="mt-5 flex flex-wrap gap-2.5 md:pl-[4.5rem]">{g.items.map((it) => <li key={it.name} className="group flex items-center gap-2 rounded-full bg-ivory px-4 py-2.5 text-sm transition duration-500 hover:-translate-y-1 hover:bg-navy hover:text-cream"><it.icon className="h-4 w-4 text-teal-dark transition duration-500 group-hover:rotate-12 group-hover:text-champagne" aria-hidden="true" />{it.name}</li>)}</ul>
              </li>))}
          </ol>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-navy py-24 text-cream md:py-32">
        <div className="container-x">
          <div className="mb-14 max-w-2xl"><p className="eyebrow !text-champagne" data-reveal>Why choose us</p><Split text="Stays made simple" className="mt-3 text-4xl !text-cream md:text-6xl" /></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
            {WHY.map(([ic, t, d]) => { const Icon = ICONS[ic]; return (
              <Tilt key={t} className="rounded-[28px] border border-white/10 bg-white/5 p-7 backdrop-blur"><Icon data-depth="14" className="h-9 w-9 text-champagne" aria-hidden="true" /><h3 data-depth="6" className="mt-5 text-2xl !text-cream">{t}</h3><p className="mt-2 text-sm leading-relaxed text-cream/75">{d}</p></Tilt>) })}
          </div>
          <dl className="mt-14 grid grid-cols-3 gap-4 border-t border-white/15 pt-10 text-center">
            {[[villas.length || 2, '', 'Private villas'], [3, ' BHK', 'In every villa'], [AMENITY_COUNT, '', 'Amenities']].map(([n, s, l]) => (
              <div key={l}><dd className="font-serif text-5xl text-champagne md:text-7xl" data-count={n} data-suffix={s}>0</dd><dt className="mt-1 text-sm text-cream/75">{l}</dt></div>))}
          </dl>
        </div>
      </section>

      {/* GALLERY — horizontal storytelling */}
      {gallery.length > 0 && (
        <HScroll id="gallery" className="py-20 lg:py-0" trackClass="items-center"
          header={<div className="flex items-end justify-between gap-6"><div><p className="eyebrow" data-reveal>Gallery</p><Split text="A glimpse of paradise" className="mt-3 text-4xl md:text-6xl" /></div><p className="hidden text-sm text-charcoal/70 lg:block">Scroll to explore →</p></div>}>
          {gallery.map((p, i) => (
            <button key={p.src} onClick={() => setLb(i)} data-cursor="Open" aria-label={`Open photo: ${p.alt}`}
              className={`group relative shrink-0 snap-center overflow-hidden rounded-[28px] shadow-soft ${i % 3 === 1 ? 'aspect-[4/5] w-[68vw] sm:w-[340px] lg:w-[360px]' : 'aspect-[4/3] w-[85vw] sm:w-[520px] lg:w-[560px]'}`}>
              <SmartImage src={p.src} alt={p.alt} className="h-full w-full object-cover transition duration-[1400ms] group-hover:scale-110" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/70 to-transparent p-5 text-left text-sm text-white opacity-0 transition duration-500 group-hover:opacity-100 max-md:opacity-100">{p.villa}</span>
            </button>))}
        </HScroll>)}
      <Lightbox items={photos} index={lb} onClose={() => setLb(null)} onChange={setLb} />

      {/* TESTIMONIALS */}
      <section className="bg-ivory py-24 md:py-32">
        <div className="container-x">
          <div className="mb-12"><p className="eyebrow" data-reveal>Guest love</p><Split text="What our guests say" className="mt-3 text-4xl md:text-6xl" /></div>
          <div className="grid gap-6 md:grid-cols-3" data-stagger>
            {TESTIMONIALS.map((t) => (
              <Tilt key={t.name} max={4} className="rounded-[28px] bg-cream p-8 shadow-soft">
                <figure><Quote className="h-8 w-8 text-champagne" aria-hidden="true" />
                  <div className="mt-3 flex gap-0.5" role="img" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-champagne text-champagne" aria-hidden="true" />)}</div>
                  <blockquote className="mt-4 font-serif text-xl leading-snug text-navy">{t.text}</blockquote>
                  <figcaption className="mt-5 text-sm font-semibold">{t.name} <span className="font-normal text-charcoal/60">· {t.place}</span></figcaption></figure>
              </Tilt>))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="container-x py-24 md:py-32">
        <div className="mb-12"><p className="eyebrow" data-reveal>Location</p><Split text="On the East Coast Road" className="mt-3 text-4xl md:text-6xl" /></div>
        <Location villas={villas} />
      </section>

      {/* ENQUIRY + FINAL CTA */}
      <section id="enquiry" className="bg-navy py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="text-cream">
            <p className="eyebrow !text-champagne" data-reveal>Book your stay</p>
            <Split text="Your beach weekend awaits" className="mt-3 text-4xl !text-cream md:text-6xl" />
            <p className="mt-6 max-w-md text-cream/80" data-reveal>Send your dates and we'll continue on WhatsApp — or message us directly right now.</p>
            <Magnetic className="mt-8"><a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-wa"><MessageCircle className="h-5 w-5" aria-hidden="true" />Book on WhatsApp</a></Magnetic>
          </div>
          <div data-reveal><Enquiry villas={villas} /></div>
        </div>
      </section>
    </div>
  )
}
