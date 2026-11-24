import { Link } from 'react-router-dom'
import { Moon, Phone, Mail, MessageCircle, Instagram, Facebook } from 'lucide-react'
import { PHONE, EMAIL, waLink } from '../lib/config'

export default function Footer() {
  return (
    <footer className="bg-ocean-dark text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 font-serif text-2xl font-bold"><Moon className="h-6 w-6 text-coral" aria-hidden="true" /> bluemoonbeachhouse</p>
          <p className="mt-4 text-sm leading-relaxed text-white/80">Private 3BHK beach villas on ECR and Mahabalipuram — pool, BBQ, games and sea breeze.</p>
        </div>
        <div>
          <h3 className="mb-4 text-lg">Quick Links</h3>
          <ul className="space-y-2 text-sm text-white/80">
            {[['/', 'Home'], ['/villas', 'Villas'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([to, l]) => (
              <li key={to}><Link className="hover:text-coral" to={to}>{l}</Link></li>))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg">Contact</h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li><a className="flex items-center gap-2 hover:text-coral" href={`tel:+91${PHONE}`}><Phone className="h-4 w-4" aria-hidden="true" />{PHONE}</a></li>
            <li><a className="flex items-center gap-2 hover:text-coral" href={`mailto:${EMAIL}`}><Mail className="h-4 w-4" aria-hidden="true" />{EMAIL}</a></li>
            <li><a className="flex items-center gap-2 hover:text-coral" href={waLink()} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" aria-hidden="true" />WhatsApp us</a></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg">Follow</h3>
          <div className="flex gap-3">
            <a href="https://instagram.com" aria-label="Instagram" className="rounded-full bg-white/10 p-3 hover:bg-coral"><Instagram className="h-5 w-5" /></a>
            <a href="https://facebook.com" aria-label="Facebook" className="rounded-full bg-white/10 p-3 hover:bg-coral"><Facebook className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-xs text-white/70">© {new Date().getFullYear()} Blue Moon Beach House. All rights reserved.</p>
    </footer>
  )
}
