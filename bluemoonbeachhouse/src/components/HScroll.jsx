import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

/**
 * Horizontal storytelling.
 *  - Desktop (>=1024px, motion allowed): the section pins and vertical scroll drives the track sideways.
 *  - Everything else (phones, tablets, reduced motion): a normal swipeable, snap-aligned row.
 * The track is always `overflow-x: auto` + full width, so touch/trackpad scrolling works without any JS.
 */
export default function HScroll({ id, header, children, className = '', trackClass = '' }) {
  const wrap = useRef(null), track = useRef(null)
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const t = track.current, host = t.parentElement
      Object.assign(t.style, { width: 'max-content', overflow: 'visible', scrollSnapType: 'none' })
      const dist = () => Math.max(0, t.scrollWidth + parseFloat(getComputedStyle(host).paddingLeft) - host.clientWidth)
      if (dist() < 40) { Object.assign(t.style, { width: '', overflow: '', scrollSnapType: '' }); return }
      gsap.to(t, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: wrap.current, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true } })
      return () => { gsap.set(t, { clearProps: 'transform' }); Object.assign(t.style, { width: '', overflow: '', scrollSnapType: '' }) }
    })
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh); document.fonts?.ready.then(refresh)
    return () => { window.removeEventListener('load', refresh); mm.revert() }
  }, [])
  return (
    <section id={id} ref={wrap} className={`overflow-hidden lg:flex lg:h-screen lg:flex-col lg:justify-center ${className}`}>
      {header && <div className="container-x mb-8 w-full lg:mb-10">{header}</div>}
      <div className="w-full overflow-hidden pl-5 md:pl-10 lg:pl-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))]">
        <div ref={track} className={`hscroll flex w-full snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-4 pr-10 lg:gap-8 ${trackClass}`}>{children}</div>
      </div>
    </section>
  )
}
