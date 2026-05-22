export default function Textarea({ label, value, onChange, rows = 3, placeholder = '', style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && (
        <label style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#4A6352',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontFamily: 'Poppins, sans-serif',
        }}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          border: '1px solid #D4E0D8',
          borderRadius: 7,
          padding: '8px 11px',
          fontSize: 13,
          color: '#0D1F12',
          outline: 'none',
          fontFamily: 'Poppins, sans-serif',
          background: '#fff',
          resize: 'vertical',
          width: '100%',
        }}
        onFocus={e => e.target.style.borderColor = '#60866C'}
        onBlur={e => e.target.style.borderColor = '#D4E0D8'}
      />
    </div>
  )
}
