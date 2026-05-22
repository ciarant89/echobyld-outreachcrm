import { useState } from 'react'
import { X, Mail, Phone, ExternalLink, Edit2, Trash2 } from 'lucide-react'
import Avatar from '../ui/Avatar'
import StatusBadge from '../ui/StatusBadge'
import Button from '../ui/Button'
import Select from '../ui/Select'
import ActivityTimeline from './ActivityTimeline'
import LogActivityForm from './LogActivityForm'
import VoiceNoteRecorder from './VoiceNoteRecorder'
import Modal from '../ui/Modal'
import ContactForm from './ContactForm'
import { useActivities, useCreateActivity } from '../../hooks/useActivities'
import { useUpdateContact, useDeleteContact } from '../../hooks/useContacts'
import { CONTACT_STATUSES } from '../../lib/constants'
import { fmtDateFull, isOverdue, isDueSoon } from '../../lib/utils'
import { toast } from '../ui/Toast'

export default function ContactDetail({ contact, onClose }) {
  const [showEdit,    setShowEdit]    = useState(false)
  const [showLog,     setShowLog]     = useState(false)
  const [activeTab,   setActiveTab]   = useState('activity')

  const { data: activities } = useActivities(contact.id)
  const { mutate: updateContact } = useUpdateContact()
  const { mutate: deleteContact } = useDeleteContact()
  const { mutate: createActivity } = useCreateActivity()

  const handleStatusChange = (status) => {
    updateContact(
      { id: contact.id, status },
      { onSuccess: () => toast.success('Status updated') },
    )
  }

  const handleLog = (activity) => {
    createActivity(
      { ...activity, contact_id: contact.id },
      { onSuccess: () => { toast.success('Activity logged'); setShowLog(false) } },
    )
  }

  const handleVoiceSave = (activity) => {
    createActivity(
      { ...activity, contact_id: contact.id },
      { onSuccess: () => toast.success('Voice note saved') },
    )
  }

  const handleDelete = () => {
    if (!confirm(`Delete ${contact.full_name}? This cannot be undone.`)) return
    deleteContact(contact.id, { onSuccess: () => { toast.success('Contact deleted'); onClose() } })
  }

  const followupColor = isOverdue(contact.next_followup)
    ? '#7F0000'
    : isDueSoon(contact.next_followup)
    ? '#7A3800'
    : '#0D1F12'

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200,
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: 680,
        background: '#F4F7F5',
        zIndex: 201,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.15)',
      }}>
        {/* Header */}
        <div style={{
          background: '#fff',
          borderBottom: '1px solid #D4E0D8',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <Avatar name={contact.full_name} size={48} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 17,
              fontWeight: 700,
              color: '#0D1F12',
              fontFamily: 'Poppins, sans-serif',
            }}>
              {contact.full_name}
            </div>
            <div style={{
              fontSize: 13,
              color: '#4A6352',
              fontFamily: 'Poppins, sans-serif',
              marginTop: 2,
            }}>
              {[contact.role, contact.company].filter(Boolean).join(' · ')}
            </div>
            <div style={{ marginTop: 6 }}>
              <StatusBadge status={contact.status} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setShowEdit(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A6352', padding: 6, display: 'flex' }}
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7F0000', padding: 6, display: 'flex' }}
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A6352', padding: 6, display: 'flex' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body: two-column layout */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left info panel */}
          <div style={{
            width: 240,
            flexShrink: 0,
            background: '#fff',
            borderRight: '1px solid #D4E0D8',
            padding: '16px 16px',
            overflowY: 'auto',
          }}>
            <InfoBlock label="Country">{contact.country || '—'}</InfoBlock>
            <InfoBlock label="Segment">{contact.segment || '—'}</InfoBlock>
            <InfoBlock label="Interest">{contact.interest_level || '—'}</InfoBlock>
            <InfoBlock label="Source">{contact.source || '—'}</InfoBlock>
            <InfoBlock label="Owner">{contact.owner || '—'}</InfoBlock>

            {contact.next_followup && (
              <InfoBlock label="Follow-up">
                <span style={{ color: followupColor, fontWeight: 600 }}>
                  {fmtDateFull(contact.next_followup)}
                  {isOverdue(contact.next_followup) && ' — Overdue'}
                  {isDueSoon(contact.next_followup) && !isOverdue(contact.next_followup) && ' — Due soon'}
                </span>
              </InfoBlock>
            )}

            {contact.last_contacted && (
              <InfoBlock label="Last contacted">{fmtDateFull(contact.last_contacted)}</InfoBlock>
            )}

            {contact.email && (
              <InfoBlock label="Email">
                <a href={`mailto:${contact.email}`} style={{ color: '#33533D', textDecoration: 'none', fontSize: 12 }}>
                  <Mail size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  {contact.email}
                </a>
              </InfoBlock>
            )}

            {contact.phone && (
              <InfoBlock label="Phone">
                <a href={`tel:${contact.phone}`} style={{ color: '#33533D', textDecoration: 'none', fontSize: 12 }}>
                  <Phone size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  {contact.phone}
                </a>
              </InfoBlock>
            )}

            {contact.linkedin_url && (
              <InfoBlock label="LinkedIn">
                <a href={contact.linkedin_url} target="_blank" rel="noreferrer"
                  style={{ color: '#33533D', textDecoration: 'none', fontSize: 12 }}>
                  <ExternalLink size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  View profile
                </a>
              </InfoBlock>
            )}

            {contact.notes && (
              <InfoBlock label="Notes">
                <span style={{ fontSize: 12, color: '#4A6352', lineHeight: 1.5 }}>{contact.notes}</span>
              </InfoBlock>
            )}

            <div style={{ marginTop: 16 }}>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#4A6352',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 6,
                fontFamily: 'Poppins, sans-serif',
              }}>
                Update status
              </div>
              <Select
                value={contact.status}
                onChange={handleStatusChange}
                options={CONTACT_STATUSES}
              />
            </div>
          </div>

          {/* Right activity panel */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px' }}>
            <VoiceNoteRecorder onSave={handleVoiceSave} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#4A6352',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'Poppins, sans-serif',
              }}>
                Activity
              </div>
              <Button variant="secondary" size="sm" onClick={() => setShowLog(s => !s)}>
                {showLog ? 'Cancel' : '+ Log'}
              </Button>
            </div>

            {showLog && (
              <div style={{
                background: '#fff',
                border: '1px solid #D4E0D8',
                borderRadius: 10,
                padding: 16,
                marginBottom: 14,
              }}>
                <LogActivityForm onLog={handleLog} onCancel={() => setShowLog(false)} />
              </div>
            )}

            <ActivityTimeline activities={activities ?? []} />
          </div>
        </div>
      </div>

      {showEdit && (
        <Modal title="Edit contact" onClose={() => setShowEdit(false)} width={600}>
          <ContactForm
            initial={contact}
            onSave={(data) => {
              updateContact(
                { id: contact.id, ...data },
                {
                  onSuccess: () => {
                    toast.success('Contact updated')
                    setShowEdit(false)
                  },
                },
              )
            }}
            onCancel={() => setShowEdit(false)}
          />
        </Modal>
      )}
    </>
  )
}

function InfoBlock({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        color: '#4A6352',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontFamily: 'Poppins, sans-serif',
        marginBottom: 2,
      }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: '#0D1F12', fontFamily: 'Poppins, sans-serif' }}>
        {children}
      </div>
    </div>
  )
}
