import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Mail, Phone, ExternalLink, ArrowLeft } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import StatusBadge from '../components/ui/StatusBadge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import ContactForm from '../components/features/ContactForm'
import ActivityTimeline from '../components/features/ActivityTimeline'
import LogActivityForm from '../components/features/LogActivityForm'
import VoiceNoteRecorder from '../components/features/VoiceNoteRecorder'
import { useContact, useUpdateContact, useDeleteContact } from '../hooks/useContacts'
import { useActivities, useCreateActivity } from '../hooks/useActivities'
import { CONTACT_STATUSES } from '../lib/constants'
import { fmtDateFull, isOverdue, isDueSoon } from '../lib/utils'
import { toast } from '../components/ui/Toast'

export default function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: contact, isLoading } = useContact(id)
  const { data: activities = [] }    = useActivities(id)
  const { mutate: updateContact }    = useUpdateContact()
  const { mutate: deleteContact }    = useDeleteContact()
  const { mutate: createActivity }   = useCreateActivity()

  const [showEdit, setShowEdit]   = useState(false)
  const [showLog, setShowLog]     = useState(false)
  const [notes, setNotes]         = useState('')
  const [followup, setFollowup]   = useState('')

  useEffect(() => {
    if (contact) {
      document.title = `${contact.full_name} — EchoByld CRM`
      setNotes(contact.notes || '')
      setFollowup(contact.next_followup || '')
    }
    return () => { document.title = 'EchoByld CRM' }
  }, [contact])

  if (isLoading) return (
    <div style={{ padding: '40px 24px', fontFamily: 'Poppins, sans-serif', color: '#4A6352' }}>
      Loading…
    </div>
  )

  if (!contact) return (
    <div style={{ padding: '40px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#0D1F12', fontFamily: 'Poppins, sans-serif', marginBottom: 12 }}>
        Contact not found
      </div>
      <Button onClick={() => navigate('/contacts')}>← Back to contacts</Button>
    </div>
  )

  const followupColor = isOverdue(followup) ? '#A32D2D' : isDueSoon(followup) ? '#92400E' : '#0D1F12'

  const handleStatusChange = (status) => {
    updateContact({ id, status }, {
      onSuccess: () => toast.success('Status updated'),
      onError:   () => toast.error('Something went wrong — please try again'),
    })
  }

  const handleFollowupChange = (val) => {
    setFollowup(val)
    updateContact({ id, next_followup: val }, {
      onSuccess: () => toast.success('Follow-up updated'),
    })
  }

  const handleNotesBlur = () => {
    updateContact({ id, notes }, {
      onSuccess: () => toast.success('Notes saved'),
    })
  }

  const handleLog = (activity) => {
    createActivity({ ...activity, contact_id: id }, {
      onSuccess: () => { toast.success('Activity logged'); setShowLog(false) },
      onError:   () => toast.error('Something went wrong — please try again'),
    })
  }

  const handleVoiceSave = (activity) => {
    createActivity({ ...activity, contact_id: id }, {
      onSuccess: () => toast.success('Voice note saved'),
      onError:   () => toast.error('Something went wrong — please try again'),
    })
  }

  const handleDelete = () => {
    if (!confirm(`Delete ${contact.full_name}? This cannot be undone.`)) return
    deleteContact(id, {
      onSuccess: () => { toast.success('Contact deleted'); navigate('/contacts') },
      onError:   () => toast.error('Something went wrong — please try again'),
    })
  }

  return (
    <div style={{ padding: '20px 24px' }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/contacts')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#60866C', fontWeight: 600, fontSize: 13,
          fontFamily: 'Poppins, sans-serif', display: 'flex',
          alignItems: 'center', gap: 6, marginBottom: 20, padding: 0,
        }}
      >
        <ArrowLeft size={15} /> Contacts
      </button>

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* LEFT SIDEBAR */}
        <div style={{
          width: 280, flexShrink: 0,
          background: '#fff', border: '1px solid #D4E0D8',
          borderRadius: 10, padding: 24,
        }}>
          {/* Profile */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
            <Avatar name={contact.full_name} size={80} />
            <div style={{
              fontSize: 20, fontWeight: 800, color: '#0D1F12',
              marginTop: 12, textAlign: 'center', fontFamily: 'Poppins, sans-serif',
            }}>
              {contact.full_name}
            </div>
            {contact.role && (
              <div style={{ fontSize: 14, color: '#4A6352', textAlign: 'center', fontFamily: 'Poppins, sans-serif', marginTop: 2 }}>
                {contact.role}
              </div>
            )}
            {contact.company && (
              <div style={{ fontSize: 14, fontWeight: 600, color: '#60866C', textAlign: 'center', fontFamily: 'Poppins, sans-serif', marginTop: 2 }}>
                {contact.company}
              </div>
            )}
            <div style={{ marginTop: 10 }}>
              <StatusBadge status={contact.status} />
            </div>
            <div style={{ marginTop: 8, width: '100%' }}>
              <select
                value={contact.status}
                onChange={e => handleStatusChange(e.target.value)}
                style={{
                  width: '100%', border: '1px solid #D4E0D8', borderRadius: 7,
                  padding: '7px 10px', fontSize: 12, fontFamily: 'Poppins, sans-serif',
                  color: '#0D1F12', outline: 'none', background: '#fff', cursor: 'pointer',
                }}
              >
                {CONTACT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #D4E0D8', margin: '16px 0' }} />

          {/* Info rows */}
          {[
            { label: 'Country',        value: contact.country },
            { label: 'Source',         value: contact.source },
            { label: 'Interest',       value: contact.interest_level },
            { label: 'Segment',        value: contact.segment },
            { label: 'Owner',          value: contact.owner },
          ].map(({ label, value }) => value ? (
            <InfoRow key={label} label={label} value={value} />
          ) : null)}

          {contact.email && (
            <InfoRow label="Email">
              <a href={`mailto:${contact.email}`} style={{ color: '#60866C', textDecoration: 'none', fontSize: 12 }}>
                <Mail size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />{contact.email}
              </a>
            </InfoRow>
          )}
          {contact.phone && (
            <InfoRow label="Phone">
              <a href={`tel:${contact.phone}`} style={{ color: '#60866C', textDecoration: 'none', fontSize: 12 }}>
                <Phone size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />{contact.phone}
              </a>
            </InfoRow>
          )}
          {contact.linkedin_url && (
            <InfoRow label="LinkedIn">
              <a href={contact.linkedin_url} target="_blank" rel="noreferrer" style={{ color: '#60866C', textDecoration: 'none', fontSize: 12 }}>
                <ExternalLink size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />View profile
              </a>
            </InfoRow>
          )}

          <div style={{ borderTop: '1px solid #D4E0D8', margin: '16px 0' }} />

          {/* Follow-up */}
          <div style={{ marginBottom: 14 }}>
            <Label>Next follow-up</Label>
            <input
              type="date"
              value={followup}
              onChange={e => handleFollowupChange(e.target.value)}
              style={{
                width: '100%', border: '1px solid #D4E0D8', borderRadius: 7,
                padding: '7px 10px', fontSize: 13, fontFamily: 'Poppins, sans-serif',
                color: followupColor, fontWeight: isOverdue(followup) ? 600 : 400,
                outline: 'none', background: '#fff',
              }}
            />
            {isOverdue(followup) && (
              <div style={{
                display: 'inline-block', marginTop: 4,
                background: '#FFEBEE', color: '#A32D2D', border: '1px solid #EF9A9A',
                borderRadius: 9999, padding: '1px 8px', fontSize: 10, fontWeight: 700,
                fontFamily: 'Poppins, sans-serif',
              }}>
                Overdue
              </div>
            )}
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 16 }}>
            <Label>Notes</Label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              rows={3}
              style={{
                width: '100%', border: '1px solid #D4E0D8', borderRadius: 6,
                padding: '8px 10px', fontSize: 13, fontFamily: 'Poppins, sans-serif',
                color: '#0D1F12', background: '#F4F7F5', resize: 'vertical', outline: 'none',
              }}
              placeholder="Key context, notes…"
            />
          </div>

          <Button variant="ghost" style={{ width: '100%' }} onClick={() => setShowEdit(true)}>
            Edit contact
          </Button>
          <button
            onClick={handleDelete}
            style={{
              width: '100%', marginTop: 8, background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 12, color: '#A32D2D',
              fontFamily: 'Poppins, sans-serif', padding: '6px 0',
            }}
          >
            Delete contact
          </button>
        </div>

        {/* RIGHT MAIN */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <VoiceNoteRecorder onSave={handleVoiceSave} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{
              fontSize: 16, fontWeight: 700, color: '#0D1F12', fontFamily: 'Poppins, sans-serif',
            }}>
              Activity timeline
            </div>
            <Button variant="secondary" size="sm" onClick={() => setShowLog(s => !s)}>
              {showLog ? 'Cancel' : '+ Log activity'}
            </Button>
          </div>

          {showLog && (
            <div style={{
              background: '#fff', border: '1px solid #D4E0D8',
              borderRadius: 10, padding: 16, marginBottom: 14,
            }}>
              <LogActivityForm onLog={handleLog} onCancel={() => setShowLog(false)} />
            </div>
          )}

          <ActivityTimeline activities={activities} />
        </div>
      </div>

      {showEdit && (
        <Modal title="Edit contact" onClose={() => setShowEdit(false)} width={600}>
          <ContactForm
            initial={contact}
            onSave={(data) => {
              updateContact({ id, ...data }, {
                onSuccess: () => { toast.success('Contact updated'); setShowEdit(false) },
                onError:   () => toast.error('Something went wrong — please try again'),
              })
            }}
            onCancel={() => setShowEdit(false)}
          />
        </Modal>
      )}
    </div>
  )
}

function InfoRow({ label, value, children }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      fontSize: 13, padding: '4px 0',
    }}>
      <span style={{ color: '#4A6352', fontWeight: 500, fontFamily: 'Poppins, sans-serif', flexShrink: 0, marginRight: 8 }}>
        {label}
      </span>
      <span style={{ color: '#0D1F12', fontWeight: 600, fontFamily: 'Poppins, sans-serif', textAlign: 'right' }}>
        {children ?? value}
      </span>
    </div>
  )
}

function Label({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: '#4A6352', letterSpacing: '0.06em',
      textTransform: 'uppercase', fontFamily: 'Poppins, sans-serif', marginBottom: 6,
    }}>
      {children}
    </div>
  )
}
