import { useEffect, useMemo, useState } from 'react'
import { supabase, supabaseReady } from './supabase'
import { SEED_VILLAS } from '../data/seedVillas'
import { withPhotos, collectPhotos } from './photos'

export function useVillas() {
  const [raw, setRaw] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      if (!supabaseReady) { setRaw(SEED_VILLAS); setLoading(false); return }
      const { data, error } = await supabase.from('villas').select('*').order('sort_order', { ascending: true })
      if (!alive) return
      if (error || !data?.length) { setRaw(SEED_VILLAS); if (error) setError(error.message) } else setRaw(data)
      setLoading(false)
    })()
    return () => { alive = false }
  }, [])

  const villas = useMemo(() => raw.map(withPhotos), [raw])
  const photos = useMemo(() => collectPhotos(villas), [villas])
  return { villas, photos, loading, error }
}
