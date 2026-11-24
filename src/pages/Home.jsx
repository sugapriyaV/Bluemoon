import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Star, ShieldCheck, Waves, HeartHandshake, MessageCircle, MapPin, ArrowRight, Quote } from 'lucide-react'
import { useVillas } from '../lib/useVillas'
import { useTitle } from '../lib/useTitle'
import { useScrollAnimations, reducedMotion } from '../lib/useReveal'
import { HERO_IMG, GALLERY, TESTIMONIALS } from '../data/seedVillas'
import { AMENITY_GROUPS } from '../data/amenities'
import { waLink } from '../lib/config'
import SearchCard from '../components/SearchCard'
import VillaCard from '../components/VillaCard'
import SmartImage from '../components/SmartImage'
import { Loading } from '../components/Skeletons'

const WHY = [
  [ShieldCheck, 'Private & secure', 'Entire villa to yourselves — no shared spaces, just your group.'],
  [Waves, 'Beach & pool', 'Steps from the shore with a private swimming pool to cool off.'],
  [HeartHandshake, 'Family friendly', 'Kids\u2019 play area, games and BBQ for every age.'],
  [MessageCircle, 'Easy booking', 'Chat on WhatsApp and get details in minutes — no middlemen.']
]

export default function Home() {
  useTitle('', 'Blue Moon Beach House – private 3BHK beach villas near Mahabalipuram and on ECR, Chennai.')
  const { villas, loading } = useVillas()
  const root = useRef(null)
  const title = useRef(null)
  useScrollAnimations(root, [loading])

  // Hero: split headline into words and animate in; hero image slow zoom.
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-word', { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.09, ease: 'power4.out', delay: 0.2 })
      gsap.from('.hero-fade', { y: 30, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.9 })
      gsap.fromTo('.hero-bg', { scale: 1.15 }, { scale: 1, duration: 2.5, ease: 'power2.out' })
    }, root)
    return () => ctx.revert()
  }, [])

  const words = 'Where the sea breeze meets your perfect getaway'.split(' ')

  return (
    <div ref={root}>
      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-12">
        <SmartImage src={HERO_IMG} alt="Sunset over a quiet beach with calm ocean waves" eager className="hero-bg absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-dark/40 via-transparent to-ocean-dark/60" aria-hidden="true" />
        <div className="container-x relative z-10 text-center text-white">
          <h1 ref={title} className="mx-auto max-w-4xl text-5xl font-bold leading-[1.05] drop-shadow md:text-7xl" aria-label="Where the sea breeze meets your perfect getaway">
            {words.map((w, i) => (
              <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom" aria-hidden="true"><span className="hero-word inline-block">{w}</span></span>
            ))}
          </h1>
          <p className="hero-fade mx-auto mt-5 max-w-xl text-base text-white/95 md:text-lg">Private 3BHK beach villas on ECR &amp; Mahabalipuram — pool, BBQ, games and sunsets.</p>
          <div className="hero-fade mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/villas" className="btn-primary">Explore Villas <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn bg-white/90 text-ink hover:bg-white">WhatsApp us</a>
          </div>
          <div className="hero-fade mx-auto mt-10 max-w-5xl text-left"><SearchCard villas={villas} /></div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="container-x py-20 text-center" data-reveal>
        <h2 className="mx-auto max-w-4xl text-4xl uppercase tracking-tight md:text-6xl">Not just a stay. A world of sea &amp; sunsets.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-ink/70">Two hand-picked villas where beach, comfort and family time come together.</p>
      </section>

      {/* OUR VILLAS */}
      <section className="container-x pb-20">
        <div className="mb-10 flex items-end justify-between gap-4" data-reveal>
          <div><p className="label text-coral-dark">Our Villas</p><h2 className="mt-1 text-4xl md:text-5xl">Choose your beach escape</h2></div>
          <Link to="/villas" className="btn-ghost hidden sm:inline-flex">View all</Link>
        </div>
        {loading ? <Loading /> : <div className="grid gap-8 md:grid-cols-2" data-stagger>{villas.map((v) => <VillaCard key={v.id} villa={v} />)}</div>}
      </section>

      {/* AMENITY HIGHLIGHTS */}
      <section className="bg-sand/60 py-20">
        <div className="container-x">
          <div className="mx-auto mb-10 max-w-2xl text-center" data-reveal>
            <p className="label text-coral-dark">Amenities</p><h2 className="mt-1 text-4xl md:text-5xl">Everything for a perfect stay</h2>
          </div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4" data-stagger>
            {AMENITY_GROUPS.map((g) => (
              <div key={g.title} className="rounded-3xl bg-white p-6 text-center shadow-soft">
                <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/15 text-teal-dark"><g.icon className="h-7 w-7" aria-hidden="true" /></span>
                <h3 className="text-xl">{g.title}</h3>
                <p className="mt-1 text-sm text-ink/70">{g.items.slice(0, 3).map((i) => i.name).join(' · ')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US + COUNTERS */}
      <section className="container-x py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center" data-reveal><p className="label text-coral-dark">Why choose us</p><h2 className="mt-1 text-4xl md:text-5xl">Stays made simple</h2></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          {WHY.map(([Icon, t, d]) => (
            <div key={t} className="rounded-3xl bg-white p-6 shadow-soft"><Icon className="h-8 w-8 text-coral" aria-hidden="true" /><h3 className="mt-3 text-xl">{t}</h3><p className="mt-1 text-sm text-ink/70">{d}</p></div>
          ))}
        </div>
        <dl className="mt-12 grid grid-cols-3 gap-4 rounded-3xl bg-ocean p-8 text-center text-white">
          {[[2, '', 'Private villas'], [500, '+', 'Happy guests'], [5, '★', 'Guest rating']].map(([n, s, l]) => (
            <div key={l}><dt className="order-2 text-sm text-white/85">{l}</dt><dd className="font-serif text-4xl font-bold md:text-6xl" data-count={n} data-suffix={s}>0</dd></div>
          ))}
        </dl>
      </section>

      {/* GALLERY */}
      <section className="container-x pb-20">
        <div className="mb-10 text-center" data-reveal><p className="label text-coral-dark">Gallery</p><h2 className="mt-1 text-4xl md:text-5xl">A glimpse of paradise</h2></div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3" data-stagger>
          {GALLERY.map((src, i) => (
            <div key={i} className={`relative overflow-hidden rounded-3xl ${i % 4 === 0 ? 'aspect-[4/5]' : 'aspect-square'}`}>
              <SmartImage src={src} alt={['Beach villa at sunset', 'Swimming pool', 'Villa exterior', 'Living room', 'Bedroom', 'Villa garden'][i]} data-parallax className="absolute -top-[10%] h-[120%] w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-sand/60 py-20">
        <div className="container-x">
          <div className="mb-10 text-center" data-reveal><p className="label text-coral-dark">Guest love</p><h2 className="mt-1 text-4xl md:text-5xl">What our guests say</h2></div>
          <div className="grid gap-6 md:grid-cols-3" data-stagger>
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="rounded-3xl bg-white p-7 shadow-soft">
                <Quote className="h-7 w-7 text-teal" aria-hidden="true" />
                <div className="mt-3 flex gap-0.5" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-coral text-coral" aria-hidden="true" />)}</div>
                <blockquote className="mt-3 text-sm leading-relaxed text-ink/80">{t.text}</blockquote>
                <figcaption className="mt-4 text-sm font-semibold">{t.name} <span className="font-normal text-ink/60">· {t.place}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION TEASER */}
      <section className="container-x py-20">
        <div className="grid items-center gap-8 rounded-3xl bg-white p-6 shadow-soft md:grid-cols-2 md:p-10" data-reveal>
          <div><p className="label text-coral-dark">Location</p><h2 className="mt-1 text-4xl">On the East Coast Road</h2>
            <p className="mt-3 text-ink/75">Our villas sit minutes from Mahabalipuram and Vadanemmeli — an easy weekend drive from Chennai along scenic ECR.</p>
            <ul className="mt-4 space-y-2 text-sm"><li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-coral" aria-hidden="true" />Mahabalipuram, near the beach</li><li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-coral" aria-hidden="true" />Vadanemmeli, Chengalpattu (ECR)</li></ul>
            <Link to="/contact" className="btn-ocean mt-6">Get directions</Link></div>
          <div className="relative aspect-video overflow-hidden rounded-2xl"><SmartImage src={GALLERY[0]} alt="Coastline near the villas at sunset" data-parallax className="absolute -top-[10%] h-[120%] w-full object-cover" /></div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-x pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-ocean to-teal p-10 text-center text-white md:p-16" data-reveal>
          <h2 className="text-4xl md:text-6xl">Your beach weekend awaits</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">Message us on WhatsApp and we'll share availability and rates right away.</p>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-primary mt-7"><MessageCircle className="h-5 w-5" aria-hidden="true" />Book on WhatsApp</a>
        </div>
      </section>
    </div>
  )
}
