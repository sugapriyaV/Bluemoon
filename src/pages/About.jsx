import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Waves, HeartHandshake, MessageCircle } from 'lucide-react'
import { useVillas } from '../lib/useVillas'
import { useTitle } from '../lib/useTitle'
import { useScrollAnimations } from '../lib/useReveal'
import { WHY } from '../data/seedVillas'
import SmartImage from '../components/SmartImage'
import Split from '../components/Split'
import Tilt from '../components/Tilt'

const ICONS = { ShieldCheck, Waves, HeartHandshake, MessageCircle }
export default function About() {
  useTitle('About', 'About Bluemoon Beach House – private 3BHK beach villas on ECR and Mahabalipuram.')
  const { photos, loading } = useVillas()
  const ref = useRef(null)
  useScrollAnimations(ref, [loading])
  return (
    <div ref={ref} className="bg-cream pb-28 pt-40">
      <div className="container-x">
        <p className="eyebrow" data-reveal>About us</p>
        <Split as="h1" text="A beach house made for slow weekends" className="mt-3 max-w-4xl text-5xl md:text-7xl" />
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
          {photos[3] && <div data-mask className="aspect-[4/5] overflow-hidden rounded-[28px] shadow-float"><SmartImage src={photos[3].src} alt={photos[3].alt} className="h-full w-full object-cover" /></div>}
          <div data-reveal className="space-y-5 text-lg leading-relaxed text-charcoal/85">
            <p>Bluemoon Beach House offers private 3BHK villas near the sea — Blue Moon Beach Villa in Mahabalipuram and The Ocean Drive Villas on East Coast Road at Vadanemmeli.</p>
            <p>Each villa has a swimming pool, BBQ facilities, indoor and outdoor games and a kids' play area, with Wi-Fi, TV and air conditioning for comfort.</p>
            <div className="flex flex-wrap gap-3 pt-3"><Link to="/villas" className="btn-primary">Explore villas</Link><Link to="/contact" className="btn-outline">Get in touch</Link></div>
          </div>
        </div>
        <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          {WHY.map(([ic, t, d]) => { const Icon = ICONS[ic]; return <Tilt key={t} className="rounded-[28px] bg-ivory p-7"><Icon data-depth="12" className="h-8 w-8 text-champagne-dark" aria-hidden="true" /><h3 className="mt-4 text-2xl">{t}</h3><p className="mt-2 text-sm text-charcoal/75">{d}</p></Tilt> })}
        </div>
      </div>
    </div>
  )
}
