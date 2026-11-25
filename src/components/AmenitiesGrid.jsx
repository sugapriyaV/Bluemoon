import { AMENITY_GROUPS } from '../data/amenities'

export default function AmenitiesGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2" data-stagger>
      {AMENITY_GROUPS.map((g) => (
        <section key={g.title} className="rounded-3xl bg-white p-6 shadow-soft">
          <h3 className="mb-4 flex items-center gap-3 text-2xl"><span className="rounded-2xl bg-teal/15 p-2.5 text-teal-dark"><g.icon className="h-6 w-6" aria-hidden="true" /></span>{g.title}</h3>
          <ul className="grid grid-cols-2 gap-3">
            {g.items.map((it) => (
              <li key={it.name} className="flex items-center gap-2.5 rounded-xl bg-cream px-3 py-2.5 text-sm font-medium"><it.icon className="h-4 w-4 shrink-0 text-coral" aria-hidden="true" />{it.name}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
