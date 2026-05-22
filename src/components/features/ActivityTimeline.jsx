import TypeBadge from '../ui/TypeBadge'
import EmptyState from '../ui/EmptyState'
import { ACTIVITY_STYLES } from '../../lib/constants'
import { timeAgo } from '../../lib/utils'

export default function ActivityTimeline({ activities = [], loading = false }) {
  if (loading) {
    return (
      <div style={{ padding: 24, color: '#4A6352', fontFamily: 'Poppins, sans-serif', fontSize: 13 }}>
        Loading…
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No activity yet"
        sub="Log a call, email or meeting to get started"
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {activities.map(a => (
        <div key={a.id} style={{
          background: '#fff',
          border: '1px solid #D4E0D8',
          borderLeft: `3px solid ${ACTIVITY_STYLES[a.type]?.border ?? '#D4E0D8'}`,
          borderRadius: 8,
          padding: '12px 14px',
          boxShadow: '0 1px 3px rgba(13,31,18,0.05)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 6,
            flexWrap: 'wrap',
          }}>
            <TypeBadge type={a.type} />
            {a.title && (
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#0D1F12',
                fontFamily: 'Poppins, sans-serif',
              }}>
                {a.title}
              </span>
            )}
            <span style={{
              fontSize: 11,
              color: '#4A6352',
              marginLeft: 'auto',
              fontFamily: 'Poppins, sans-serif',
            }}>
              {timeAgo(a.occurred_at)} · {a.owner}
            </span>
          </div>

          {a.body && (
            <div style={{
              fontSize: 13,
              color: '#4A6352',
              lineHeight: 1.65,
              fontFamily: 'Poppins, sans-serif',
            }}>
              {a.body}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
