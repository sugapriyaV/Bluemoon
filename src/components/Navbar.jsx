import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const LINKS = [['top', 'Home'], ['about', 'About'], ['villas', 'Villas'], ['amenities', 'Amenities'], ['gallery', 'Gallery'], ['location', 'Location'], ['contact', 'Contact']]

export function useGoTo() {
  const { pathname } = useLocation(); const nav = useNavigate()
  return (id, extra = {}) => {
    if (pathname === '/') { id === 'top' ? window.scrollTo({ top: 0, behavior: 'smooth' }) : document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); if (extra.villa) window.dispatchEvent(new CustomEvent('pick-villa', { detail: extra.villa })) }
    else nav('/', { state: { scrollTo: id, ...extra } })
  }
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const { pathname } = useLocation()
  const go = useGoTo()
  const overHero = pathname === '/' && !solid && !open

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 60)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const tone = overHero ? 'text-white' : 'text-navy'
  const click = (id) => (e) => { e.preventDefault(); setOpen(false); go(id) }
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${overHero ? 'bg-transparent' : 'bg-ivory/90 shadow-[0_1px_0_rgba(18,48,71,.08)] backdrop-blur-md'}`}>
      <nav className="container-x flex h-[76px] items-center justify-between" aria-label="Main">
        <Link to="/" onClick={() => window.scrollTo(0, 0)} className={`font-serif text-2xl font-semibold tracking-wide ${tone}`} aria-label="Bluemoon Beach House home">
          Bluemoon <span className="font-normal italic">Beach House</span>
        </Link>
        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map(([id, label]) => (
            <li key={id}><a href={`/#${id}`} onClick={click(id)} className={`text-sm font-medium transition hover:text-teal ${tone}`}>{label}</a></li>))}
          <li><a href="/#contact" onClick={click('contact')} className={overHero ? 'btn-light' : 'btn-primary'}>Book Now</a></li>
        </ul>
        <button className={`lg:hidden ${tone}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button>
      </nav>
      {open && (
        <div className="max-h-[80vh] overflow-auto border-t border-sand bg-ivory px-5 pb-6 lg:hidden">
          <ul className="flex flex-col pt-2">
            {LINKS.map(([id, label]) => (<li key={id}><a href={`/#${id}`} onClick={click(id)} className="block rounded-xl px-3 py-3 text-base font-medium text-navy hover:bg-sand">{label}</a></li>))}
            <li className="pt-3"><a href="/#contact" onClick={click('contact')} className="btn-primary w-full">Book Now</a></li>
          </ul>
        </div>
      )}
    </header>
  )
}
