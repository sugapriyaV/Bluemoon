import { useState } from 'react'

// Lazy image. If a villa photo fails to load we show a neutral sand block – never a stock photo.
export default function SmartImage({ src, alt, className = '', eager = false, ...rest }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  if (!src || failed) return <div role="img" aria-label={alt} className={`${className} bg-sand`} />
  return (
    <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async"
      onError={() => setFailed(true)} onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`} {...rest} />
  )
}
