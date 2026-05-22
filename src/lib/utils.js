import { format, formatDistanceToNow } from 'date-fns'

export const fmtDate = (d) => {
  if (!d) return '—'
  try { return format(new Date(d), 'd MMM') } catch { return '—' }
}

export const fmtDateFull = (d) => {
  if (!d) return '—'
  try { return format(new Date(d), 'd MMM yyyy') } catch { return '—' }
}

export const timeAgo = (d) => {
  if (!d) return '—'
  try { return formatDistanceToNow(new Date(d), { addSuffix: true }) } catch { return '—' }
}

export const fmtCurrency = (n) => {
  if (!n || n === 0) return '—'
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}m`
  if (n >= 1_000)     return `€${Math.round(n / 1_000)}k`
  return `€${n}`
}

export const initials = (name) =>
  name?.split(' ')
    .filter(w => /^[a-zA-Z]/.test(w))
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'

export const isOverdue = (d) =>
  d && new Date(d) < new Date(new Date().toDateString())

export const isDueSoon = (d) => {
  if (!d) return false
  const today = new Date(new Date().toDateString())
  const diff = (new Date(d) - today) / (1000 * 60 * 60 * 24)
  return diff >= 0 && diff <= 2
}
