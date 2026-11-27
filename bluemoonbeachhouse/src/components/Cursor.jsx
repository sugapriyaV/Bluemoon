import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { reducedMotion, fineHover } from '../lib/useReveal'

// Elegant follower ring (desktop only). Grows over links/buttons; shows a label over [data-cursor="Label"].
export default function Cursor() {
  const ring = useRef(null)
  const [label, setLabel] = useState('')
  useEffect(() => {
    const el = ring.current
    if (!el || reducedMotion() || !fineHover() || window.innerWidth < 1024) return
    el.style.display = 'flex'
    const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' }), y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })
    const move = (e) => { x(e.clientX); y(e.clientY) }
    const over = (e) => {
      const t = e.target.closest?.('[data-cursor], a, button, summary, [role="tab"]')
      gsap.to(el, { scale: t ? (t.dataset?.cursor ? 3.2 : 1.9) : 1, duration: 0.4, ease: 'power3', overwrite: 'auto' })
      setLabel(t?.dataset?.cursor || '')
    }
    window.addEventListener('pointermove', move); window.addEventListener('pointerover', over)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', over) }
  }, [])
  return (
    <div ref={ring} aria-hidden="true" style={{ display: 'none' }}
      className="pointer-events-none fixed left-0 top-0 z-[90] -ml-3 -mt-3 h-6 w-6 items-center justify-center rounded-full border border-champagne bg-champagne/10 text-[5px] font-bold uppercase tracking-wider text-navy mix-blend-normal">
      {label && <span className="whitespace-nowrap text-[4px]">{label}</span>}
    </div>
  )
}
