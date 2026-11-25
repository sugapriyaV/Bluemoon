import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import Cursor from './components/Cursor'
import Home from './pages/Home'

// Code splitting: every page except Home loads on demand.
const Villas = lazy(() => import('./pages/Villas'))
const VillaDetails = lazy(() => import('./pages/VillaDetails'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:rounded-full focus:bg-cream focus:px-4 focus:py-2">Skip to content</a>
      <ScrollTop />
      <Navbar />
      <main id="main">
        <Suspense fallback={<div className="min-h-screen bg-cream" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/villas" element={<Villas />} />
            <Route path="/villas/:slug" element={<VillaDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFloat />
      <Cursor />
    </>
  )
}
