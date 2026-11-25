import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * data-reveal   fade + rise          data-stagger  children rise in sequence
 * data-mask     clip-path image reveal (inner <img> settles from a slight zoom)
 * data-parallax slow vertical drift   data-fill     words fill in as you scroll
 * Everything is visible by default; GSAP only animates *from* hidden, so reduced-motion = static.
 */
export function useScrollAnimations(ref, deps = []) {
  useLayoutEffect(() => {
    if (!ref.current || reducedMotion()) return
    const ctx = gsap.context(() => {
      const once = (trigger, start = 'top 88%') => ({ trigger, start, once: true })
      gsap.utils.toArray('[data-reveal]').forEach((el) =>
        gsap.from(el, { y: 36, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: once(el) }))
      gsap.utils.toArray('[data-stagger]').forEach((wrap) =>
        gsap.from(wrap.children, { y: 48, opacity: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out', scrollTrigger: once(wrap, 'top 85%') }))
      gsap.utils.toArray('[data-mask]').forEach((el) => {
        gsap.fromTo(el, { clipPath: 'inset(14% 14% 14% 14% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.3, ease: 'power3.inOut', scrollTrigger: once(el, 'top 85%') })
        const img = el.querySelector('img'); if (img) gsap.from(img, { scale: 1.25, duration: 1.6, ease: 'power3.out', scrollTrigger: once(el, 'top 85%') })
      })
      gsap.utils.toArray('[data-parallax]').forEach((el) =>
        gsap.fromTo(el, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: el.parentElement, scrub: true } }))
      gsap.utils.toArray('[data-fill]').forEach((el) => {
        const words = el.querySelectorAll('.fill-word')
        gsap.fromTo(words, { opacity: 0.18 }, { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } })
      })
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
