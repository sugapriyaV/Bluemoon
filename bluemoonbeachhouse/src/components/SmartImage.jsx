import { useState } from 'react'

// Unsplash photos are served from /images/villas/<id>.jpg when downloaded (`npm run images`), else from Unsplash.
const idOf = (u) => (typeof u === 'string' ? u.match(/images\.unsplash\.com\/(photo-[\w-]+)/)?.[1] : null)
const candidates = (src) => { const id = idOf(src); return id ? [`/images/villas/${id}.jpg`, src] : [src] }

export default function SmartImage({ src, alt, className = '', eager = false, ...rest }) {
  const list = candidates(src)
  const [n, setN] = useState(0)
  const [loaded, setLoaded] = useState(false)
  if (!src || n >= list.length) return <div role="img" aria-label={alt} className={`${className} bg-sand`} />
  return (
    <img key={list[n]} src={list[n]} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchpriority={eager ? 'high' : undefined}
      onError={() => setN(n + 1)} onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`} {...rest} />
  )
}
