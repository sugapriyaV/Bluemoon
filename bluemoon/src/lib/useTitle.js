import { useEffect } from 'react'
export function useTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | Blue Moon Beach House` : 'Blue Moon Beach House'
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
