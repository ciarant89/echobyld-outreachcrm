import { useMemo, useState, useEffect } from 'react'
import { Calendar, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import TypeBadge from '../components/ui/TypeBadge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import LogActivityForm from '../components/features/LogActivityForm'
import Select from '../components/ui/Select'
import { useAllActivities, useCreateActivity } from '../hooks/useActivities'
import { useContacts } from '../hooks/useContacts'
import { timeAgo } from '../lib/utils'
import { toast } from '../components/ui/Toast'

const TYPE_FILTERS = ['all', 'meeting', 'call', 'email', 'note', 'voice_note', 'pipeline']

export default function Meetings() {
  useEffect(() => {
    document.title = 'Activity Log — EchoByld CRM'
    return () => { document.title = 'EchoByld CRM' }
  }, [])

  const navigate = useNavigate()
  const { data: activities = [], isLoading } = useAllActivities()
  const { data: contacts = [] }              = useContacts()
  const { mutate: createActivity }           = useCreateActivity()

  const [showLog, setShowLog]   = useState(false)
  const [typeFilter, setType]   = useState('all')
  const [contactId, setContact] = useState('')

  const contactOptions = [
    { value: '', label: 'All contacts' },
    ...contacts.map(c => ({ value: c.id, label: `${c.full_name}${c.company ? ` — ${c.company}` : ''}` })),
  ]

  const filtered = useMemo(() => {
    return activities.filter(a => {
      const typeOk    = typeFilter === 'all' || a.type === typeFilter
      const contactOk = !contactId || a.contact_id === contactId
      return typeOk && contactOk
    })
  }, [activities, typeFilter, contactId])

  const handleLog = (data) => {
    createActivity(
      { ...data, contact_id: contactId || undefined },
      {
        onSuccess: () => { toast.success('Activity logged'); setShowLog(false) },
        onError:   () => toast.error('Something went wrong — please try again'),
      },
    )
  }

  const getContact = (id) => contacts.find(c => c.id === id)

  return (
    <div style={{ padding: '24px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0D1F12', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
            Activity log
          </h1>
          <div style={{ fontSize: 13, color: '#4A6352', marginTop: 2, fontFamily: 'Poppins, sans-serif' }}>
            {filtered.length} records
          </div>
        </div>
        <Button onClick={() => setShowLog(true)}>
          <Plus size={14} /> Log activity
        </Button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {TYPE_FILTERS.map(t => (
            <button key={t} onClick={() => setType(t)} style={{
              background: typeFilter === t ? '#33533D' : '#fff',
              color: typeFilter === t ? '#fff' : '#4A6352',
              border: `1px solid ${typeFilter === t ? '#33533D' : '#D4E0D8'}`,
              borderRadius: 9999, padding: '5px 12px', fontSize: 11,
              fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
            }}>
              {t === 'all' ? 'All' : t === 'voice_note' ? 'Voice note' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <Select value={contactId} onChange={setContact} options={contactOptions} style={{ width: 240 }} />
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div className="skeleton" style={{ width: 50, height: 20, borderRadius: 9999 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                  <div className="skeleton" style={{ width: 160, height: 12 }} />
                  <div className="skeleton" style={{ width: 240, height: 11 }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No activity yet"
          sub="Log a call or record a voice note to get started"
          action={<Button onClick={() => setShowLog(true)}><Plus size={14} /> Log activity</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(a => {
            const contact = getContact(a.contact_id)
            return (
              <Card key={a.id} style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: '#F4F7F5', border: '1px solid #D4E0D8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Calendar size={16} color="#4A6352" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <TypeBadge type={a.type} />
                      {a.title && (
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#0D1F12', fontFamily: 'Poppins, sans-serif' }}>
                          {a.title}
                        </span>
                      )}
                      {contact && (
                        <span
                          onClick={() => navigate(`/contacts/${contact.id}`)}
                          style={{
                            background: '#F4F7F5', border: '1px solid #D4E0D8',
                            borderRadius: 20, padding: '3px 10px', fontSize: 12,
                            color: '#33533D', fontWeight: 600, cursor: 'pointer',
                            fontFamily: 'Poppins, sans-serif', transition: 'background 0.12s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#E8F5E9'}
                          onMouseLeave={e => e.currentTarget.style.background = '#F4F7F5'}
                        >
                          {contact.full_name}{contact.company ? ` — ${contact.company}` : ''}
                        </span>
                      )}
                      <span style={{ fontSize: 11, color: '#4A6352', marginLeft: 'auto', fontFamily: 'Poppins, sans-serif' }}>
                        {timeAgo(a.occurred_at)} · {a.owner}
                      </span>
                    </div>
                    {a.body && (
                      <div style={{ fontSize: 13, color: '#4A6352', lineHeight: 1.6, fontFamily: 'Poppins, sans-serif' }}>
                        {a.body}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {showLog && (
        <Modal title="Log activity" onClose={() => setShowLog(false)} width={500}>
          <div style={{ marginBottom: 14 }}>
            <Select label="Contact (optional)" value={contactId} onChange={setContact} options={contactOptions} />
          </div>
          <LogActivityForm onLog={handleLog} onCancel={() => setShowLog(false)} />
        </Modal>
      )}
    </div>
  )
}
