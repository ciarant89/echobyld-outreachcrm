export default function Select({ label, value, onChange, options, style = {} }) {
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
      <select
        value={value}
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
          width: '100%',
          cursor: 'pointer',
        }}
      >
        {options.map(o => (
          <option
            key={typeof o === 'string' ? o : o.value}
            value={typeof o === 'string' ? o : o.value}
          >
            {typeof o === 'string' ? o : o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
