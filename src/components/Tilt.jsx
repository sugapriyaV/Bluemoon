import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { reducedMotion, fineHover } from '../lib/useReveal'

// 3D tilt + layered depth ([data-depth] children) + dynamic shadow. Pointer-fine devices only.
export default function Tilt({ children, max = 6, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion() || !fineHover()) return
    gsap.set(el, { transformPerspective: 1000, transformStyle: 'preserve-3d' })
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' }), ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' })
    const layers = [...el.querySelectorAll('[data-depth]')].map((l) => ({ x: gsap.quickTo(l, 'x', { duration: 0.7, ease: 'power3' }), y: gsap.quickTo(l, 'y', { duration: 0.7, ease: 'power3' }), d: Number(l.dataset.depth) }))
    const move = (e) => {
      const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5
      ry(px * max * 2); rx(-py * max * 2); layers.forEach((l) => { l.x(px * l.d); l.y(py * l.d) })
      el.style.boxShadow = `${-px * 40}px ${34 + py * 24}px 70px -28px rgba(10,31,51,.45)`
    }
    const leave = () => { rx(0); ry(0); layers.forEach((l) => { l.x(0); l.y(0) }); el.style.boxShadow = '' }
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); gsap.killTweensOf(el); gsap.set(el, { clearProps: 'all' }) }
  }, [max])
  return <div ref={ref} className={`will-change-transform transition-shadow duration-500 ${className}`}>{children}</div>
}
