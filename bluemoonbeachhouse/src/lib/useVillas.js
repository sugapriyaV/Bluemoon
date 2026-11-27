import { useEffect, useMemo, useState } from 'react'
import { supabase, supabaseReady } from './supabase'
import { SEED_VILLAS } from '../data/seedVillas'
import { collectPhotos } from './config'
import { safeUrl } from './safe'

// Supabase configured  -> villas (details + photos) come ONLY from the admin-managed database.
// Not configured       -> built-in demo villas so the project still previews.
export function useVillas() {
  const [villas, setVillas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    let alive = true
    ;(async () => {
      if (!supabaseReady) { setVillas(SEED_VILLAS); setLoading(false); return }
      const { data, error } = await supabase.from('villas').select('*').order('sort_order', { ascending: true })
      if (!alive) return
      if (error) setError('Could not load villas.')
      setVillas((data || []).map((v) => ({ ...v, photos: (v.photos || []).map(safeUrl).filter(Boolean), map_link: safeUrl(v.map_link) })))
      setLoading(false)
    })()
    return () => { alive = false }
  }, [])
  const photos = useMemo(() => collectPhotos(villas), [villas])
  return { villas, photos, loading, error }
}
