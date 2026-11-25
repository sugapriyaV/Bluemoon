import { useRef } from 'react'
import { useVillas } from '../lib/useVillas'
import { useTitle } from '../lib/useTitle'
import { useScrollAnimations } from '../lib/useReveal'
import VillaCard from '../components/VillaCard'
import { Loading } from '../components/Skeletons'

export default function Villas() {
  useTitle('Villas', 'Two private 3 BHK beach villas in Mahabalipuram and on ECR, Vadanemmeli.')
  const { villas, loading } = useVillas()
  const ref = useRef(null)
  useScrollAnimations(ref, [loading])
  return (
    <div ref={ref} className="pt-36 pb-24">
      <div className="container-x">
        <header className="mb-12 max-w-2xl" data-reveal><p className="eyebrow">The Villas</p><h1 className="mt-3 text-5xl md:text-7xl">Choose your beach escape</h1></header>
        {loading ? <Loading /> : <div className="grid gap-8 md:grid-cols-2" data-stagger>{villas.map((v) => <VillaCard key={v.id} villa={v} />)}</div>}
      </div>
    </div>
  )
}
