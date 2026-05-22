import { initials } from '../../lib/utils'

export default function Avatar({ name = '?', size = 36 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: '#E8F5E9',
      border: '1.5px solid #ADCCB7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.35,
      fontWeight: 700,
      color: '#33533D',
      flexShrink: 0,
      fontFamily: 'Poppins, sans-serif',
    }}>
      {initials(name)}
    </div>
  )
}
