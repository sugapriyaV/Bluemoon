import { Link } from 'react-router-dom'
import { useTitle } from '../lib/useTitle'
export default function ComingSoon({ title, stage }) {
  useTitle(title)
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
      <h1 className="text-5xl">{title}</h1>
      <p className="mt-3 text-ink/70">This page is built in Stage {stage}.</p>
      <Link to="/villas" className="btn-primary mt-6">Browse villas</Link>
    </section>
  )
}
