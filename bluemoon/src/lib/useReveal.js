import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scroll animations for elements inside `ref`:
 *  [data-reveal]   fade-up          [data-stagger]  children stagger in
 *  [data-parallax] image parallax   [data-count]    number counter
 */
export function useScrollAnimations(ref, deps = []) {
  useLayoutEffect(() => {
    if (!ref.current || reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      })
      gsap.utils.toArray('[data-stagger]').forEach((wrap) => {
        gsap.from(wrap.children, { y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: wrap, start: 'top 85%', once: true } })
      })
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        gsap.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el.parentElement, scrub: true } })
      })
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count); const o = { v: 0 }
        gsap.to(o, { v: end, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('en-IN') + (el.dataset.suffix || '') } })
      })
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
