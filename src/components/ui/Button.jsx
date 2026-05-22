export default function Button({
  children, onClick, variant = 'primary', size = 'md',
  disabled = false, type = 'button', style = {},
}) {
  const base = {
    border: 'none',
    borderRadius: 7,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    opacity: disabled ? 0.5 : 1,
    fontFamily: 'Poppins, sans-serif',
    transition: 'opacity 0.15s',
  }
  const sizes = {
    sm: { padding: '4px 12px', fontSize: 11 },
    md: { padding: '8px 16px', fontSize: 13 },
    lg: { padding: '11px 22px', fontSize: 14 },
  }
  const variants = {
    primary:   { background: '#33533D', color: '#fff' },
    secondary: { background: '#E8F5E9', color: '#33533D', border: '1px solid #ADCCB7' },
    ghost:     { background: 'transparent', color: '#4A6352', border: '1px solid #D4E0D8' },
    danger:    { background: '#FFEBEE', color: '#7F0000', border: '1px solid #EF9A9A' },
    dark:      { background: '#000', color: '#ADCCB7', border: '1px solid #33533D' },
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {children}
    </button>
  )
}
