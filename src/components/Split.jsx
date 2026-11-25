// Words wrapped for the masked "rise" text reveal (animated by data-split in useScrollAnimations).
export default function Split({ text, as: Tag = 'h2', className = '', ...rest }) {
  return (
    <Tag data-split className={className} aria-label={text} {...rest}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom" aria-hidden="true"><span className="sp-w inline-block">{w}</span></span>))}
    </Tag>
  )
}
