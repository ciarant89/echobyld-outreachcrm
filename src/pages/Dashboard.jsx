import { useMemo, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import TypeBadge from '../components/ui/TypeBadge'
import Avatar from '../components/ui/Avatar'
import { useContacts } from '../hooks/useContacts'
import { useDeals } from '../hooks/useDeals'
import { useAllActivities } from '../hooks/useActivities'
import { fmtCurrency, fmtDateFull, isOverdue } from '../lib/utils'
import { PIPELINE_STAGES } from '../lib/constants'

export default function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard — EchoByld CRM'
    return () => { document.title = 'EchoByld CRM' }
  }, [])

  const navigate = useNavigate()
  const { data: contacts = [] }   = useContacts()
  const { data: deals = [] }      = useDeals()
  const { data: activities = [] } = useAllActivities()

  const totalContacts    = contacts.length
  const activeDeals      = deals.filter(d => d.stage !== 'Closed won' && d.stage !== 'Closed lost').length
  const followupsDue     = contacts.filter(c => isOverdue(c.next_followup)).length
  const totalPipeline    = deals.reduce((s, d) => s + (d.value_eur || 0), 0)

  const meetingsThisWeek = useMemo(() => {
    const now = new Date()
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay())
    const weekEnd   = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 7)
    return activities.filter(a => {
      if (a.type !== 'meeting') return false
      const d = new Date(a.occurred_at)
      return d >= weekStart && d < weekEnd
    }).length
  }, [activities])

  const pipelineByStage = PIPELINE_STAGES.map(stage => ({
    stage,
    value: deals.filter(d => d.stage === stage).reduce((s, d) => s + (d.value_eur || 0), 0),
  })).filter(s => s.value > 0)

  const recentActivities = activities.slice(0, 10)

  return (
    <div style={{ padding: '24px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0D1F12', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
          Dashboard
        </h1>
        <div style={{ fontSize: 13, color: '#4A6352', marginTop: 2, fontFamily: 'Poppins, sans-serif' }}>
          Good morning, Ciaran. Here's where things stand.
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total contacts"       value={totalContacts}  accentColor="#33533D" />
        <StatCard label="Active deals"         value={activeDeals}    accentColor="#60866C" />
        <StatCard
          label="Follow-ups overdue"
          value={followupsDue}
          accentColor={followupsDue > 0 ? '#A32D2D' : '#33533D'}
        />
        <StatCard
          label="Meetings this week"
          value={meetingsThisWeek}
          accentColor="#5B1FA0"
          sub={totalPipeline > 0 ? `Pipeline: ${fmtCurrency(totalPipeline)}` : undefined}
        />
      </div>

      {/* Chart + Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
        {/* Pipeline chart */}
        <Card style={{ padding: '20px 20px' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#4A6352',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 16, fontFamily: 'Poppins, sans-serif',
          }}>
            Pipeline by stage
          </div>

          {pipelineByStage.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#4A6352', fontSize: 13, fontFamily: 'Poppins, sans-serif' }}>
              No deals yet — add some in the Pipeline tab.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pipelineByStage} layout="vertical" margin={{ left: 0, right: 16 }}>
                <CartesianGrid horizontal={false} stroke="#D4E0D8" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={v => fmtCurrency(v)}
                  tick={{ fontSize: 12, fontFamily: 'Poppins, sans-serif', fill: '#4A6352' }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  dataKey="stage" type="category" width={120}
                  tick={{ fontSize: 12, fontFamily: 'Poppins, sans-serif', fill: '#4A6352' }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip
                  formatter={v => [fmtCurrency(v), 'Value']}
                  contentStyle={{
                    background: '#0D1410', border: '1px solid #33533D',
                    borderRadius: 6, fontFamily: 'Poppins, sans-serif',
                  }}
                  labelStyle={{ color: '#ADCCB7', fontWeight: 600 }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(96,134,108,0.08)' }}
                />
                <Bar dataKey="value" fill="#60866C" activeBar={{ fill: '#33533D' }} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Activity feed */}
        <Card style={{ padding: '20px 16px', overflowY: 'auto', maxHeight: 360 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#4A6352',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 14, fontFamily: 'Poppins, sans-serif',
          }}>
            Recent activity
          </div>

          {recentActivities.length === 0 ? (
            <div style={{ fontSize: 13, color: '#4A6352', textAlign: 'center', padding: '24px 0', fontFamily: 'Poppins, sans-serif' }}>
              No activity yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentActivities.map(a => (
                <div key={a.id} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  padding: '8px 0', borderBottom: '1px solid #F4F7F5',
                }}>
                  <TypeBadge type={a.type} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12, fontWeight: 600, color: '#0D1F12',
                      fontFamily: 'Poppins, sans-serif',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {a.title || a.type}
                    </div>
                    {a.body && (
                      <div style={{
                        fontSize: 11, color: '#4A6352', fontFamily: 'Poppins, sans-serif',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2,
                      }}>
                        {a.body}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Overdue follow-ups */}
      {followupsDue > 0 && (
        <Card style={{ marginTop: 16, padding: '16px 20px' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#A32D2D',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 12, fontFamily: 'Poppins, sans-serif',
          }}>
            Overdue follow-ups ({followupsDue})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {contacts.filter(c => isOverdue(c.next_followup)).slice(0, 5).map(c => (
              <div
                key={c.id}
                onClick={() => navigate(`/contacts/${c.id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '6px 8px', borderRadius: 7, cursor: 'pointer',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F0F4F1'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Avatar name={c.full_name} size={28} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1F12', fontFamily: 'Poppins, sans-serif' }}>{c.full_name}</div>
                  <div style={{ fontSize: 11, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>{c.company || c.country}</div>
                </div>
                <div style={{ fontSize: 11, color: '#A32D2D', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                  Due {fmtDateFull(c.next_followup)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
