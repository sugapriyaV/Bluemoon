import { useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Lightbox({ items, index, onClose, onChange }) {
  const closeRef = useRef(null)
  const open = index !== null
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'
    const key = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onChange((index + 1) % items.length)
      if (e.key === 'ArrowLeft') onChange((index - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', key)
    return () => { window.removeEventListener('keydown', key); document.body.style.overflow = prev }
  }, [open, index, items.length, onClose, onChange])
  if (!open) return null
  const it = items[index]
  return (
    <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-[70] flex animate-[fade_.3s_ease] items-center justify-center bg-navy/95 p-4" onClick={onClose}>
      <style>{`@keyframes fade{from{opacity:0}to{opacity:1}}`}</style>
      <button ref={closeRef} onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-full bg-white/15 p-3 text-white hover:bg-white/30"><X /></button>
      <button onClick={(e) => { e.stopPropagation(); onChange((index - 1 + items.length) % items.length) }} aria-label="Previous photo" className="absolute left-3 rounded-full bg-white/15 p-3 text-white hover:bg-white/30"><ChevronLeft /></button>
      <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <img src={it.src} alt={it.alt} className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain" />
        <figcaption className="mt-3 text-center text-sm text-white/85">{it.villa} · {index + 1} / {items.length}</figcaption>
      </figure>
      <button onClick={(e) => { e.stopPropagation(); onChange((index + 1) % items.length) }} aria-label="Next photo" className="absolute right-3 rounded-full bg-white/15 p-3 text-white hover:bg-white/30"><ChevronRight /></button>
    </div>
  )
}
