import { useEffect, useState } from 'react'
import { supabase, supabaseReady } from './supabase'
import { setSettings } from './config'

// Loads the admin-managed phone/email before the public site renders, so every WhatsApp/tel link is correct.
export default function SettingsProvider({ children }) {
  const [ready, setReady] = useState(!supabaseReady)
  useEffect(() => {
    if (!supabaseReady) return
    let alive = true
    const timer = setTimeout(() => alive && setReady(true), 2500) // never block the site on a slow network
    supabase.from('site_settings').select('phone,email').eq('id', 1).maybeSingle()
      .then(({ data }) => { if (data) setSettings(data) }).catch(() => {}).finally(() => { clearTimeout(timer); if (alive) setReady(true) })
    return () => { alive = false; clearTimeout(timer) }
  }, [])
  return ready ? children : <div className="min-h-screen bg-cream" aria-busy="true" />
}
