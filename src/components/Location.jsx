import { useState } from 'react'
import { Navigation, MapPin } from 'lucide-react'

export default function Location({ villas }) {
  const [i, setI] = useState(0)
  const v = villas[i]; if (!v) return null
  const q = encodeURIComponent(`${v.name} ${v.location || ''}`)
  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]" data-reveal>
      <div>
        <div className="flex flex-col gap-3" role="tablist" aria-label="Choose villa location">
          {villas.map((x, n) => (
            <button key={x.slug} role="tab" aria-selected={n === i} onClick={() => setI(n)}
              className={`rounded-2xl p-5 text-left transition ${n === i ? 'bg-navy text-white' : 'bg-cream text-navy hover:bg-sand'}`}>
              <span className="font-serif text-2xl font-semibold">{x.name}</span>
              <span className={`mt-1 flex items-center gap-1.5 text-sm ${n === i ? 'text-white/80' : 'text-charcoal/70'}`}><MapPin className="h-4 w-4" aria-hidden="true" />{x.location}</span>
            </button>))}
        </div>
        <a href={v.map_link || `https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6"><Navigation className="h-4 w-4" aria-hidden="true" />Get Directions</a>
      </div>
      <div className="overflow-hidden rounded-[28px] bg-sand shadow-soft">
        <iframe key={v.slug} title={`Map of ${v.name}`} loading="lazy" className="h-[360px] w-full border-0 md:h-[440px]" referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${q}&output=embed`} />
      </div>
    </div>
  )
}
