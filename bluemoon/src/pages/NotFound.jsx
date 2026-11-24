import { Link } from 'react-router-dom'
import { useTitle } from '../lib/useTitle'
export default function NotFound() {
  useTitle('Page not found')
  return (
    <section className="container-x flex min-h-[80vh] flex-col items-center justify-center pt-24 text-center">
      <p className="font-serif text-8xl font-bold text-coral">404</p>
      <h1 className="mt-2 text-4xl">Lost at sea?</h1>
      <p className="mt-3 max-w-md text-ink/70">The page you're looking for has drifted away. Let's get you back to shore.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </section>
  )
}
