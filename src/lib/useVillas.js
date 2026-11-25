import { useEffect, useMemo, useState } from 'react'
import { supabase, supabaseReady } from './supabase'
import { SEED_VILLAS } from '../data/seedVillas'
import { collectPhotos } from './config'

// Supabase villas when configured, otherwise built-in seed data so the site always looks complete.
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
      if (error || !data?.length) { setVillas(SEED_VILLAS); if (error) setError(error.message) } else setVillas(data)
      setLoading(false)
    })()
    return () => { alive = false }
  }, [])
  const photos = useMemo(() => collectPhotos(villas), [villas])
  return { villas, photos, loading, error }
}
