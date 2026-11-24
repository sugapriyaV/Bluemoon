import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import Home from './pages/Home'

// Code splitting: everything except Home is lazy-loaded.
const Villas = lazy(() => import('./pages/Villas'))
const ComingSoon = lazy(() => import('./pages/ComingSoon'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
      <Navbar />
      <main id="main">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/villas" element={<Villas />} />
            {/* Stage 2: Villa details + enquiry. Stage 3: About + Contact. */}
            <Route path="/villas/:slug" element={<ComingSoon title="Villa details" stage={2} />} />
            <Route path="/about" element={<ComingSoon title="About us" stage={3} />} />
            <Route path="/contact" element={<ComingSoon title="Contact" stage={3} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
