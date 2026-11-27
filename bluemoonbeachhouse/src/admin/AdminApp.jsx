import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { supabaseReady } from '../lib/supabase'
import { AdminProvider, useAdmin } from './auth'
import Layout from './Layout'
import Login from './Login'
import Dashboard from './Dashboard'
import VillasAdmin from './VillasAdmin'
import VillaForm from './VillaForm'
import EnquiriesAdmin from './EnquiriesAdmin'
import Reports from './Reports'
import SettingsAdmin from './SettingsAdmin'

// Route guard. This only controls what is *shown*; the real protection is Postgres RLS (see supabase/schema.sql).
function RequireAdmin() {
  const { status } = useAdmin(); const loc = useLocation()
  if (status === 'loading') return <div className="grid min-h-screen place-items-center bg-ivory" role="status" aria-label="Loading">…</div>
  if (status !== 'admin') return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />
  return <Layout />
}

export default function AdminApp() {
  useEffect(() => {
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex,nofollow'; document.head.appendChild(m)
    return () => m.remove()
  }, [])
  if (!supabaseReady) return <main className="grid min-h-screen place-items-center bg-ivory p-8 text-center"><div><h1 className="text-4xl">Admin is not configured</h1><p className="mt-3 max-w-md text-charcoal/75">Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example), run supabase/schema.sql, then reload.</p></div></main>
  return (
    <AdminProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<RequireAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="villas" element={<VillasAdmin />} />
          <Route path="villas/new" element={<VillaForm />} />
          <Route path="villas/:id" element={<VillaForm />} />
          <Route path="enquiries" element={<EnquiriesAdmin />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminProvider>
  )
}
