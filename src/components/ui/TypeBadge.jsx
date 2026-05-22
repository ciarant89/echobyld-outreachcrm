import { ACTIVITY_STYLES } from '../../lib/constants'

export default function TypeBadge({ type }) {
  const s = ACTIVITY_STYLES[type] ?? ACTIVITY_STYLES.note
  return (
    <span style={{
      background: s.bg,
      color: s.text,
      border: `1px solid ${s.border}`,
      borderRadius: 9999,
      padding: '2px 8px',
      fontSize: 10,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      fontFamily: 'Poppins, sans-serif',
      display: 'inline-block',
    }}>
      {s.label}
    </span>
  )
}
