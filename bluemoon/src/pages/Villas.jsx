import { useRef } from 'react'
import { useVillas } from '../lib/useVillas'
import { useTitle } from '../lib/useTitle'
import { useScrollAnimations } from '../lib/useReveal'
import VillaCard from '../components/VillaCard'
import { Loading } from '../components/Skeletons'

export default function Villas() {
  useTitle('Our Villas', 'Two private 3BHK beach villas near Mahabalipuram and on ECR with pool, BBQ and kids play area.')
  const { villas, loading, error } = useVillas()
  const ref = useRef(null)
  useScrollAnimations(ref, [loading])

  return (
    <div ref={ref} className="pt-32 pb-24">
      <div className="container-x">
        <header className="mb-12 max-w-2xl" data-reveal>
          <p className="label text-coral-dark">Stay with us</p>
          <h1 className="mt-2 text-5xl md:text-6xl">Our Villas</h1>
          <p className="mt-4 text-lg text-ink/75">Two private 3BHK villas, each with a pool, BBQ area, games and a kids' play corner.</p>
        </header>
        {error && <p role="alert" className="mb-6 rounded-xl bg-coral/10 p-4 text-sm text-coral-dark">Couldn't reach the server — showing saved listings.</p>}
        {loading ? <Loading /> : villas.length === 0 ? (
          <p className="rounded-3xl bg-white p-10 text-center text-ink/70">No villas listed yet. Please check back soon.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2" data-stagger>{villas.map((v) => <VillaCard key={v.id} villa={v} />)}</div>
        )}
      </div>
    </div>
  )
}
