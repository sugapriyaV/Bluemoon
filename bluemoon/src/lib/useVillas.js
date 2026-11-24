import { useEffect, useState } from 'react'
import { supabase, supabaseReady } from './supabase'
import { SEED_VILLAS } from '../data/seedVillas'

// Loads villas from Supabase; falls back to seed data so the site works on first run.
export function useVillas() {
  const [villas, setVillas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    async function load() {
      if (!supabaseReady) { setVillas(SEED_VILLAS); setLoading(false); return }
      const { data, error } = await supabase.from('villas').select('*').order('sort_order', { ascending: true })
      if (!alive) return
      if (error || !data?.length) { setVillas(SEED_VILLAS); if (error) setError(error.message) }
      else setVillas(data)
      setLoading(false)
    }
    load()
    return () => { alive = false }
  }, [])

  return { villas, loading, error }
}
