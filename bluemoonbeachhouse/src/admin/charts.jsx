// Dependency-free SVG charts (responsive via viewBox, with text alternatives for screen readers).
const W = 600, H = 220, P = { l: 34, r: 10, t: 12, b: 28 }
const niceMax = (m) => { if (m <= 5) return 5; const p = 10 ** Math.floor(Math.log10(m)); return Math.ceil(m / p) * p }

export function BarChart({ data, color = '#0F5C7A', label }) {
  const max = niceMax(Math.max(0, ...data.map((d) => d.value))); const iw = W - P.l - P.r, ih = H - P.t - P.b, bw = iw / Math.max(data.length, 1)
  const step = Math.ceil(data.length / 8)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="w-full">
      <title>{label}</title><desc>{data.map((d) => `${d.label}: ${d.value}`).join(', ')}</desc>
      {[0, 0.5, 1].map((t) => <g key={t}><line x1={P.l} x2={W - P.r} y1={P.t + ih * (1 - t)} y2={P.t + ih * (1 - t)} stroke="#E8DCC6" /><text x={P.l - 6} y={P.t + ih * (1 - t) + 4} textAnchor="end" fontSize="12" fill="#1B2A38">{Math.round(max * t)}</text></g>)}
      {data.map((d, i) => { const h = (d.value / max) * ih; return (
        <g key={i}><rect x={P.l + i * bw + bw * 0.15} y={P.t + ih - h} width={bw * 0.7} height={h} rx="3" fill={color}><title>{`${d.label}: ${d.value}`}</title></rect>
          {i % step === 0 && <text x={P.l + i * bw + bw / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#1B2A38">{d.label}</text>}</g>) })}
    </svg>
  )
}

export function LineChart({ series, labels, label }) {
  const all = series.flatMap((s) => s.values), max = niceMax(Math.max(0, ...all)); const iw = W - P.l - P.r, ih = H - P.t - P.b
  const x = (i) => P.l + (labels.length <= 1 ? 0 : (i / (labels.length - 1)) * iw), y = (v) => P.t + ih * (1 - v / max), step = Math.ceil(labels.length / 7)
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="w-full">
        <title>{label}</title><desc>{series.map((s) => `${s.name}: total ${s.values.reduce((a, b) => a + b, 0)}`).join('; ')}</desc>
        {[0, 0.5, 1].map((t) => <g key={t}><line x1={P.l} x2={W - P.r} y1={P.t + ih * (1 - t)} y2={P.t + ih * (1 - t)} stroke="#E8DCC6" /><text x={P.l - 6} y={P.t + ih * (1 - t) + 4} textAnchor="end" fontSize="12" fill="#1B2A38">{Math.round(max * t)}</text></g>)}
        {series.map((s) => <polyline key={s.name} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />)}
        {labels.map((l, i) => i % step === 0 && <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="12" fill="#1B2A38">{l}</text>)}
      </svg>
      <ul className="mt-2 flex gap-5 text-xs">{series.map((s) => <li key={s.name} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />{s.name}</li>)}</ul>
    </div>
  )
}

export function HBars({ rows, color = '#5DB7B2' }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return <ul className="space-y-3">{rows.length === 0 && <li className="text-sm text-charcoal/60">No data yet.</li>}{rows.map((r) => (
    <li key={r.label}><div className="mb-1 flex justify-between text-sm"><span>{r.label}</span><span className="font-semibold">{r.value}</span></div><div className="h-2.5 rounded-full bg-sand"><div className="h-full rounded-full" style={{ width: `${(r.value / max) * 100}%`, background: color }} /></div></li>))}</ul>
}
