import { useState } from 'react'
import { FALLBACK_IMG } from '../lib/config'

// Lazy-loaded image with fallback + blur-in on load. Alt text is required.
export default function SmartImage({ src, alt, className = '', eager = false, ...rest }) {
  const [url, setUrl] = useState(src)
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={url} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async"
      onError={() => url !== FALLBACK_IMG && setUrl(FALLBACK_IMG)}
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      {...rest}
    />
  )
}
