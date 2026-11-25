import { MessageCircle } from 'lucide-react'
import { waLink } from '../lib/config'

export default function WhatsAppFloat() {
  return (
    <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"
       className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1B8F4B] text-white shadow-soft transition hover:scale-105">
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
