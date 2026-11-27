import { useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useVillas } from '../lib/useVillas'
import { useTitle } from '../lib/useTitle'
import { useScrollAnimations } from '../lib/useReveal'
import VillaCard from '../components/VillaCard'
import Split from '../components/Split'
import { Loading } from '../components/Skeletons'

export default function Villas() {
  useTitle('Villas', 'Two private 3BHK luxury beach villas near Mahabalipuram and on ECR.')
  const { villas, loading } = useVillas()
  const [q] = useSearchParams()
  const ref = useRef(null)
  useScrollAnimations(ref, [loading])
  const guests = Number(q.get('guests')) || 0
  const list = villas.filter((v) => !guests || !v.max_guests || guests <= v.max_guests)
  const qs = ['checkin', 'checkout', 'guests'].filter((k) => q.get(k)).map((k) => `${k}=${q.get(k)}`).join('&')
  return (
    <div ref={ref} className="bg-cream pb-28 pt-40">
      <div className="container-x">
        <header className="mb-14 max-w-3xl"><p className="eyebrow" data-reveal>The Villas</p><Split as="h1" text="Choose your beach escape" className="mt-3 text-5xl md:text-7xl" />
          {(q.get('checkin') || guests > 0) && <p className="mt-5 text-charcoal/75" data-reveal>Showing villas for {guests ? `${guests} guest${guests > 1 ? 's' : ''}` : 'your dates'}{q.get('checkin') ? ` · ${q.get('checkin')} → ${q.get('checkout') || '…'}` : ''}. <Link to="/villas" className="underline">Clear</Link></p>}</header>
        {loading ? <Loading /> : list.length === 0 ? <p className="rounded-3xl bg-ivory p-10 text-center">No villa fits that guest count. <Link className="underline" to="/contact">Contact us</Link> for group options.</p>
          : <div className="grid gap-10 md:grid-cols-2" data-stagger>{list.map((v) => <div key={v.id}><VillaCard villa={{ ...v }} className="h-full" /></div>)}</div>}
        {qs && !loading && list.length > 0 && <p className="mt-8 text-sm text-charcoal/70">Open a villa to enquire with your selected dates.</p>}
      </div>
    </div>
  )
}
