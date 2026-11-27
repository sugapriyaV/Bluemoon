import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, Home, Inbox, BarChart3, Settings, LogOut, Menu, X, ExternalLink } from 'lucide-react'
import { useAdmin } from './auth'

const NAV = [['/admin', 'Dashboard', LayoutDashboard, true], ['/admin/villas', 'Villas', Home], ['/admin/enquiries', 'Enquiries', Inbox], ['/admin/reports', 'Reports', BarChart3], ['/admin/settings', 'Settings', Settings]]

export default function Layout() {
  const { logout } = useAdmin()
  const [open, setOpen] = useState(false)
  const links = (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {NAV.map(([to, label, Icon, end]) => (
        <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-champagne text-navy' : 'text-cream/85 hover:bg-white/10'}`}><Icon className="h-5 w-5" aria-hidden="true" />{label}</NavLink>))}
    </nav>
  )
  const foot = (<div className="mt-auto space-y-1 border-t border-white/10 pt-4">
    <Link to="/" target="_blank" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-cream/85 hover:bg-white/10"><ExternalLink className="h-5 w-5" aria-hidden="true" />View site</Link>
    <button onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-cream/85 hover:bg-white/10"><LogOut className="h-5 w-5" aria-hidden="true" />Log out</button></div>)
  return (
    <div className="min-h-screen bg-ivory md:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-navy p-5 md:flex">
        <p className="mb-8 px-2 font-serif text-2xl font-semibold text-cream">Bluemoon <span className="italic text-champagne">Admin</span></p>{links}{foot}
      </aside>
      <header className="sticky top-0 z-40 flex items-center justify-between bg-navy px-5 py-3 md:hidden">
        <p className="font-serif text-xl font-semibold text-cream">Bluemoon <span className="italic text-champagne">Admin</span></p>
        <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="text-cream"><Menu /></button>
      </header>
      {open && <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
        <div className="absolute inset-0 bg-navy/60" onClick={() => setOpen(false)} />
        <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-navy p-5"><button onClick={() => setOpen(false)} aria-label="Close menu" className="mb-4 self-end text-cream"><X /></button>{links}{foot}</div></div>}
      <main className="min-w-0 flex-1 p-5 md:p-10"><Outlet /></main>
    </div>
  )
}
