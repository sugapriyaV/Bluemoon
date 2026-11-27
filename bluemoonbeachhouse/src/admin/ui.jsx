import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export function ConfirmModal({ title, body, confirmLabel = 'Delete', onConfirm, onCancel, busy }) {
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.focus()
    const k = (e) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [onCancel])
  return (
    <div role="alertdialog" aria-modal="true" aria-labelledby="cm-t" aria-describedby="cm-b" className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/70 p-4" onClick={onCancel}>
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-float" onClick={(e) => e.stopPropagation()}>
        <h2 id="cm-t" className="text-3xl">{title}</h2>
        <p id="cm-b" className="mt-3 text-sm text-charcoal/80">{body}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button ref={ref} onClick={onCancel} className="btn-outline !py-2.5">Cancel</button>
          <button onClick={onConfirm} disabled={busy} className="btn !bg-[#B3261E] !py-2.5 text-white hover:!bg-[#8f1d17] disabled:opacity-60">{busy ? 'Working…' : confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

export function Toast({ toast, onClose }) {
  useEffect(() => { if (!toast) return; const t = setTimeout(onClose, 4500); return () => clearTimeout(t) }, [toast, onClose])
  if (!toast) return null
  return (
    <div role="status" className={`fixed bottom-5 left-1/2 z-[110] flex max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-3 text-sm font-medium shadow-float ${toast.type === 'error' ? 'bg-[#B3261E] text-white' : 'bg-navy text-cream'}`}>
      {toast.msg}<button onClick={onClose} aria-label="Dismiss"><X className="h-4 w-4" /></button>
    </div>
  )
}

export const Card = ({ children, className = '' }) => <div className={`rounded-3xl border border-sand bg-white p-5 shadow-sm md:p-6 ${className}`}>{children}</div>
export const PageHead = ({ title, children }) => <div className="mb-7 flex flex-wrap items-center justify-between gap-4"><h1 className="text-4xl md:text-5xl">{title}</h1><div className="flex flex-wrap gap-3">{children}</div></div>
export const Label = ({ id, children }) => <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-navy">{children}</label>
