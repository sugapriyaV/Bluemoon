import { Link } from 'react-router-dom'
import { Phone, Mail, MessageCircle } from 'lucide-react'
import { PHONE, EMAIL, waLink } from '../lib/config'

export default function Footer() {
  return (
    <footer className="bg-navy text-cream">
      <div className="container-x grid gap-12 py-20 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-4xl font-semibold text-cream">Bluemoon <span className="font-normal italic text-champagne">Beach House</span></p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/75">Private 3BHK beach villas near Mahabalipuram and on East Coast Road — pool, BBQ, games and sea breeze.</p>
        </div>
        <nav aria-label="Footer"><h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.24em] text-champagne">Explore</h3>
          <ul className="space-y-2.5 text-sm text-cream/85">
            {[['/', 'Home'], ['/villas', 'Villas'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, l]) => <li key={to}><Link className="nav-link" to={to}>{l}</Link></li>)}
          </ul></nav>
        <div><h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.24em] text-champagne">Contact</h3>
          <ul className="space-y-3 text-sm text-cream/85">
            <li><a className="flex items-center gap-2 hover:text-champagne" href={`tel:+91${PHONE}`}><Phone className="h-4 w-4" aria-hidden="true" />{PHONE}</a></li>
            <li><a className="flex items-center gap-2 hover:text-champagne" href={`mailto:${EMAIL}`}><Mail className="h-4 w-4" aria-hidden="true" />{EMAIL}</a></li>
            <li><a className="flex items-center gap-2 hover:text-champagne" href={waLink()} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" aria-hidden="true" />WhatsApp</a></li>
          </ul></div>
      </div>
      <p className="border-t border-white/10 py-6 text-center text-xs text-cream/65">© {new Date().getFullYear()} Bluemoon Beach House. All rights reserved.</p>
    </footer>
  )
}
