export default function EmptyState({ icon, title, sub, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      {icon && <div style={{ fontSize: 40, marginBottom: 14 }}>{icon}</div>}
      <div style={{
        fontSize: 15,
        fontWeight: 700,
        color: '#0D1F12',
        marginBottom: 6,
        fontFamily: 'Poppins, sans-serif',
      }}>
        {title}
      </div>
      {sub && (
        <div style={{ fontSize: 13, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>
          {sub}
        </div>
      )}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  )
}
