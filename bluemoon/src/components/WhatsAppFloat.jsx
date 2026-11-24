import { MessageCircle } from 'lucide-react'
import { waLink } from '../lib/config'

export default function WhatsAppFloat() {
  return (
    <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"
       className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1FA855] text-white shadow-2xl transition hover:scale-110">
      <span className="absolute inset-0 animate-ping rounded-full bg-[#1FA855]/40 motion-reduce:hidden" aria-hidden="true" />
      <MessageCircle className="relative h-7 w-7" />
    </a>
  )
}
