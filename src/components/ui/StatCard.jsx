import Card from './Card'

export default function StatCard({ label, value, accentColor = '#33533D', sub }) {
  return (
    <Card style={{ padding: '18px 20px', borderLeft: `3px solid ${accentColor}` }}>
      <div style={{
        fontSize: 28,
        fontWeight: 800,
        color: accentColor,
        marginBottom: 4,
        fontFamily: 'Poppins, sans-serif',
        lineHeight: 1.1,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#4A6352', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: '#60866C', marginTop: 4, fontFamily: 'Poppins, sans-serif' }}>
          {sub}
        </div>
      )}
    </Card>
  )
}
