import { useEffect, useLayoutEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import gsap from 'gsap'
import { reducedMotion } from '../lib/useReveal'
import Magnetic from './Magnetic'

const LINKS = [['/', 'Home'], ['/villas', 'Villas'], ['/about', 'About'], ['/contact', 'Contact']]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const { pathname } = useLocation()
  const overHero = (pathname === '/' || pathname.startsWith('/villas/')) && !solid && !open

  useLayoutEffect(() => {
    if (reducedMotion()) return
    const c = gsap.context(() => gsap.from('.nav-in', { y: -24, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.4 }))
    return () => c.revert()
  }, [])
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 60)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' ; return () => { document.body.style.overflow = '' } }, [open])

  const tone = overHero ? 'text-white' : 'text-navy'
  return (
    <>
    <header className={`fixed inset-x-0 top-0 ${open ? 'z-[56] bg-transparent' : 'z-50'} transition-all duration-500 ${open ? '' : overHero ? 'bg-transparent' : 'bg-cream/90 shadow-[0_1px_0_rgba(10,31,51,.08)] backdrop-blur-md'}`}>
      <nav className="container-x flex h-[78px] items-center justify-between" aria-label="Main">
        <Link to="/" className={`nav-in relative z-[60] font-serif text-2xl font-semibold tracking-wide ${open ? 'text-cream' : tone}`} aria-label="Bluemoon Beach House home">
          Bluemoon <span className="font-normal italic text-champagne">Beach House</span>
        </Link>
        <ul className="hidden items-center gap-9 md:flex">
          {LINKS.map(([to, label]) => (
            <li key={to} className="nav-in"><NavLink to={to} end className={({ isActive }) => `nav-link ${tone} ${isActive ? 'active' : ''}`}>{label}</NavLink></li>))}
          <li className="nav-in"><Magnetic><Link to="/contact" className={overHero ? 'btn-gold' : 'btn-primary'}>Book Now</Link></Magnetic></li>
        </ul>
        <button className={`relative z-[60] md:hidden ${open ? 'text-cream' : tone}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
    </header>
      <div id="mobile-menu" aria-hidden={!open} className="fixed inset-0 z-[52] flex flex-col justify-center bg-navy px-8 md:hidden"
        style={{ clipPath: open ? 'circle(150% at 92% 4%)' : 'circle(0% at 92% 4%)', visibility: open ? 'visible' : 'hidden', transition: `clip-path .8s cubic-bezier(.7,0,.2,1), visibility 0s linear ${open ? '0s' : '.8s'}` }}>
        <ul className="space-y-2">
          {LINKS.map(([to, label], i) => (
            <li key={to} className="overflow-hidden"><Link to={to} tabIndex={open ? 0 : -1} className="block font-serif text-5xl text-cream transition duration-700 hover:text-champagne"
              style={{ transform: open ? 'none' : 'translateY(110%)', transitionDelay: open ? `${250 + i * 90}ms` : '0ms' }}>{label}</Link></li>))}
        </ul>
        <Link to="/contact" tabIndex={open ? 0 : -1} className="btn-gold mt-10 self-start">Book Now</Link>
      </div>
    </>
  )
}
