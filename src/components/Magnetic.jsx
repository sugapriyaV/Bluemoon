import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { reducedMotion, fineHover } from '../lib/useReveal'

// Desktop-only magnetic pull toward the pointer for CTAs.
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion() || !fineHover()) return
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' }), y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
    const move = (e) => { const r = el.getBoundingClientRect(); x((e.clientX - (r.left + r.width / 2)) * strength); y((e.clientY - (r.top + r.height / 2)) * strength) }
    const leave = () => { x(0); y(0) }
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); gsap.killTweensOf(el); gsap.set(el, { clearProps: 'transform' }) }
  }, [strength])
  return <span ref={ref} className={`inline-block ${className}`}>{children}</span>
}
