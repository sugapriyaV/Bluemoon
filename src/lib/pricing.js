import { hasRates } from './config'
// Weekend night = Friday or Saturday night. Returns null until rates + dates are available.
export function estimate(villa, checkin, checkout) {
  if (!villa || !hasRates(villa) || !checkin || !checkout || checkout <= checkin) return null
  let wd = 0, we = 0
  for (let d = new Date(checkin + 'T00:00:00Z'); d < new Date(checkout + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 1)) {
    const day = d.getUTCDay(); (day === 5 || day === 6) ? we++ : wd++
  }
  const wdRate = Number(villa.weekday_price) || 0, weRate = Number(villa.weekend_price) || 0
  return { wd, we, wdRate, weRate, total: wd * wdRate + we * weRate }
}
