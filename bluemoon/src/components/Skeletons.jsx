export function Loading({ n = 2 }) {
  return <div className="grid gap-8 md:grid-cols-2" role="status" aria-label="Loading villas">{Array.from({ length: n }).map((_, i) => <div key={i} className="skeleton h-[520px]" />)}</div>
}
