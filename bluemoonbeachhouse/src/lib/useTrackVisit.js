import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase, supabaseReady } from './supabase'

// Anonymous page-view counter for the admin dashboard: once per path per browser session, no personal data.
export function useTrackVisit() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (!supabaseReady || pathname.startsWith('/admin')) return
    try {
      const k = `v:${pathname}`
      if (sessionStorage.getItem(k)) return
      sessionStorage.setItem(k, '1')
    } catch { /* storage blocked – still count */ }
    supabase.from('visits').insert({ path: pathname.slice(0, 200) }).then(() => {}, () => {})
  }, [pathname])
}
