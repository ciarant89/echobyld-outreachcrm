export default function Card({ children, className = '', style = {}, onClick }) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid #D4E0D8',
        borderRadius: 10,
        boxShadow: '0 1px 4px rgba(13,31,18,0.06)',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
