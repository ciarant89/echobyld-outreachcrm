import { STATUS_STYLES } from '../../lib/constants'

export default function StatusBadge({ status, onClick }) {
  const s = STATUS_STYLES[status] ?? { bg: '#F4F7F5', text: '#4A6352', border: '#D4E0D8' }
  return (
    <span
      onClick={onClick}
      style={{
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        borderRadius: 9999,
        padding: '2px 10px',
        fontSize: 11,
        fontWeight: 600,
        cursor: onClick ? 'pointer' : 'default',
        whiteSpace: 'nowrap',
        fontFamily: 'Poppins, sans-serif',
        display: 'inline-block',
      }}
    >
      {status}
    </span>
  )
}
