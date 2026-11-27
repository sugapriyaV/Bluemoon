import { useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import SmartImage from './SmartImage'

// Animated lightbox: fades/scales in and out, arrow keys + Esc, focus moves to Close, body scroll locked.
export default function Lightbox({ items, index, onClose, onChange }) {
  const [show, setShow] = useState(false)
  const closeRef = useRef(null)
  const open = index !== null
  const close = () => { setShow(false); setTimeout(onClose, 320) }
  useEffect(() => {
    if (!open) return
    const r = requestAnimationFrame(() => setShow(true)); closeRef.current?.focus()
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'
    const key = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') onChange((index + 1) % items.length)
      if (e.key === 'ArrowLeft') onChange((index - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', key)
    return () => { cancelAnimationFrame(r); window.removeEventListener('keydown', key); document.body.style.overflow = prev }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index])
  if (!open || !items[index]) return null
  const it = items[index], nav = (d) => (e) => { e.stopPropagation(); onChange((index + d + items.length) % items.length) }
  return (
    <div role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={close}
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-navy/95 p-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <button ref={closeRef} onClick={close} aria-label="Close" className="absolute right-4 top-4 rounded-full bg-white/15 p-3 text-white hover:bg-white/30"><X /></button>
      <button onClick={nav(-1)} aria-label="Previous photo" className="absolute left-3 rounded-full bg-white/15 p-3 text-white hover:bg-white/30"><ChevronLeft /></button>
      <figure onClick={(e) => e.stopPropagation()} className={`max-h-full max-w-5xl transition duration-500 ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <SmartImage key={it.src} src={it.src} alt={it.alt} className="max-h-[78vh] w-auto max-w-full rounded-2xl object-contain" eager />
        <figcaption className="mt-3 text-center text-sm text-white/85">{it.villa} · {index + 1} / {items.length}</figcaption>
      </figure>
      <button onClick={nav(1)} aria-label="Next photo" className="absolute right-3 rounded-full bg-white/15 p-3 text-white hover:bg-white/30"><ChevronRight /></button>
    </div>
  )
}
