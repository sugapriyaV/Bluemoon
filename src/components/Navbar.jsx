import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Moon } from 'lucide-react'

const LINKS = [['/', 'Home'], ['/villas', 'Villas'], ['/about', 'About'], ['/contact', 'Contact']]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const { pathname } = useLocation()
  const overHero = pathname === '/' && !solid

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const text = overHero ? 'text-white' : 'text-ink'
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${overHero ? 'bg-transparent' : 'bg-cream/90 backdrop-blur-md shadow-sm'}`}>
      <nav className="container-x flex h-20 items-center justify-between" aria-label="Main">
        <Link to="/" className={`flex items-center gap-2 font-serif text-2xl font-bold ${text}`} aria-label="Blue Moon Beach House home">
          <Moon className="h-6 w-6 text-coral" aria-hidden="true" /> bluemoonbeachhouse
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map(([to, label]) => (
            <li key={to}>
              <NavLink to={to} end className={({ isActive }) => `text-sm font-medium transition hover:text-coral ${text} ${isActive ? 'underline decoration-coral decoration-2 underline-offset-8' : ''}`}>{label}</NavLink>
            </li>
          ))}
          <li><Link to="/contact" className="btn-primary">Enquire Now</Link></li>
        </ul>
        <button className={`md:hidden ${text}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-sand bg-cream px-5 pb-6 md:hidden">
          <ul className="flex flex-col gap-1 pt-3">
            {LINKS.map(([to, label]) => (
              <li key={to}><NavLink to={to} end className="block rounded-xl px-3 py-3 text-base font-medium text-ink hover:bg-sand">{label}</NavLink></li>
            ))}
            <li className="pt-2"><Link to="/contact" className="btn-primary w-full">Enquire Now</Link></li>
          </ul>
        </div>
      )}
    </header>
  )
}
