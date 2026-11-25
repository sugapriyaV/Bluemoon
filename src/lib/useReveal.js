import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const fineHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

/**
 * Scoped scroll animations (all ScrollTriggers are reverted on unmount via gsap.context).
 *  data-reveal  fade-up   data-stagger  children cascade   data-split  word-by-word text reveal
 *  data-mask    clip-path image reveal   data-parallax="n" drift (desktop/tablet only)   data-fill  scroll-filled words
 * Content is visible by default; animation only runs when motion is allowed.
 */
export function useScrollAnimations(ref, deps = []) {
  useLayoutEffect(() => {
    if (!ref.current || reducedMotion()) return
    const wide = window.matchMedia('(min-width: 768px)').matches
    const ctx = gsap.context(() => {
      const once = (trigger, start = 'top 88%') => ({ trigger, start, once: true })
      gsap.utils.toArray('[data-reveal]').forEach((el) =>
        gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: once(el) }))
      gsap.utils.toArray('[data-stagger]').forEach((wrap) =>
        gsap.from(wrap.children, { y: 56, opacity: 0, duration: 1, stagger: 0.14, ease: 'power3.out', scrollTrigger: once(wrap, 'top 85%') }))
      gsap.utils.toArray('[data-split]').forEach((el) =>
        gsap.from(el.querySelectorAll('.sp-w'), { yPercent: 115, duration: 1.1, stagger: 0.06, ease: 'power4.out', scrollTrigger: once(el, 'top 85%') }))
      gsap.utils.toArray('[data-mask]').forEach((el) => {
        gsap.fromTo(el, { clipPath: 'inset(16% 16% 16% 16% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.4, ease: 'power3.inOut', scrollTrigger: once(el, 'top 85%') })
        const img = el.querySelector('img'); if (img) gsap.from(img, { scale: 1.3, duration: 1.8, ease: 'power3.out', scrollTrigger: once(el, 'top 85%') })
      })
      if (wide) {
        gsap.utils.toArray('[data-parallax]').forEach((el) => {
          const s = Number(el.dataset.parallax) || 8
          gsap.fromTo(el, { yPercent: -s }, { yPercent: s, ease: 'none', scrollTrigger: { trigger: el.parentElement, scrub: true } })
        })
      }
      gsap.utils.toArray('[data-fill]').forEach((el) =>
        gsap.fromTo(el.querySelectorAll('.fill-word'), { opacity: 0.16 }, { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true } }))
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count); const o = { v: 0 }
        gsap.to(o, { v: end, duration: 2.2, ease: 'power2.out', scrollTrigger: once(el, 'top 92%'), onUpdate: () => { el.textContent = Math.round(o.v) + (el.dataset.suffix || '') } })
      })
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
