import { Phone, Mail, MessageCircle } from 'lucide-react'
import { PHONE, EMAIL, waLink } from '../lib/config'
import { useGoTo } from './Navbar'

const LINKS = [['top', 'Home'], ['about', 'About'], ['villas', 'Villas'], ['amenities', 'Amenities'], ['gallery', 'Gallery'], ['location', 'Location'], ['contact', 'Contact']]
export default function Footer() {
  const go = useGoTo()
  return (
    <footer className="bg-navy text-white">
      <div className="container-x grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-3xl font-semibold text-white">Bluemoon <span className="font-normal italic">Beach House</span></p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">Private 3BHK beach villas near Mahabalipuram and on ECR.</p>
        </div>
        <nav aria-label="Footer"><h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Explore</h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/85">
            {LINKS.map(([id, l]) => <li key={id}><a href={`/#${id}`} onClick={(e) => { e.preventDefault(); go(id) }} className="hover:text-seafoam">{l}</a></li>)}
          </ul></nav>
        <div><h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Contact</h3>
          <ul className="space-y-3 text-sm text-white/85">
            <li><a className="flex items-center gap-2 hover:text-seafoam" href={`tel:+91${PHONE}`}><Phone className="h-4 w-4" aria-hidden="true" />{PHONE}</a></li>
            <li><a className="flex items-center gap-2 hover:text-seafoam" href={`mailto:${EMAIL}`}><Mail className="h-4 w-4" aria-hidden="true" />{EMAIL}</a></li>
            <li><a className="flex items-center gap-2 hover:text-seafoam" href={waLink()} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" aria-hidden="true" />WhatsApp</a></li>
          </ul></div>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-xs text-white/65">© {new Date().getFullYear()} Bluemoon Beach House. All rights reserved.</p>
    </footer>
  )
}
