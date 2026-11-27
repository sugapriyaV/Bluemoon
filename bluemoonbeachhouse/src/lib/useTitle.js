import { useEffect } from 'react'
export function useTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | Bluemoon Beach House` : 'Bluemoon Beach House'
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
