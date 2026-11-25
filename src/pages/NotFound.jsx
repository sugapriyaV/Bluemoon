import { Link } from 'react-router-dom'
import { useTitle } from '../lib/useTitle'
export default function NotFound() {
  useTitle('Page not found')
  return (
    <section className="container-x flex min-h-[80vh] flex-col items-center justify-center pt-24 text-center">
      <p className="font-serif text-8xl text-teal">404</p>
      <h1 className="mt-2 text-4xl">This page has drifted away</h1>
      <Link to="/" className="btn-primary mt-7">Back to home</Link>
    </section>
  )
}
