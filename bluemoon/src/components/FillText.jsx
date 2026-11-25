// Statement whose words light up as the visitor scrolls (animated via data-fill).
export default function FillText({ text, className = '' }) {
  return (
    <p data-fill className={className} aria-label={text}>
      {text.split(' ').map((w, i) => <span key={i} className="fill-word" aria-hidden="true">{w} </span>)}
    </p>
  )
}
