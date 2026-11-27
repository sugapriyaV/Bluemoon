import { useRef } from 'react'
import { Phone, Mail, MessageCircle } from 'lucide-react'
import { useVillas } from '../lib/useVillas'
import { useTitle } from '../lib/useTitle'
import { useScrollAnimations } from '../lib/useReveal'
import { getSettings, waLink } from '../lib/config'
import Enquiry from '../components/Enquiry'
import Location from '../components/Location'
import Split from '../components/Split'

export default function Contact() {
  useTitle('Contact', 'Contact Bluemoon Beach House – enquire or book your beach villa stay.')
  const { villas, loading } = useVillas()
  const ref = useRef(null)
  const { phone: PHONE, email: EMAIL } = getSettings()
  useScrollAnimations(ref, [loading])
  return (
    <div ref={ref} className="bg-cream pb-28 pt-40">
      <div className="container-x">
        <p className="eyebrow" data-reveal>Contact</p>
        <Split as="h1" text="Let's plan your stay" className="mt-3 text-5xl md:text-7xl" />
        <div className="mt-14 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <ul className="space-y-5 text-lg" data-stagger>
            <li><a className="flex items-center gap-4 hover:text-teal-dark" href={`tel:+91${PHONE}`}><Phone className="h-6 w-6 text-champagne-dark" aria-hidden="true" />{PHONE}</a></li>
            <li><a className="flex items-center gap-4 hover:text-teal-dark" href={`mailto:${EMAIL}`}><Mail className="h-6 w-6 text-champagne-dark" aria-hidden="true" />{EMAIL}</a></li>
            <li><a className="btn-wa" href={waLink()} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-5 w-5" aria-hidden="true" />Chat on WhatsApp</a></li>
          </ul>
          <div data-reveal><Enquiry villas={villas} /></div>
        </div>
        <div className="mt-24"><h2 className="mb-8 text-4xl" data-reveal>Find us</h2><Location villas={villas} /></div>
      </div>
    </div>
  )
}
