import { useState } from 'react'
import { Plus } from 'lucide-react'
import Modal from '../ui/Modal'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import { useContacts, useUpdateContact } from '../../hooks/useContacts'
import { useCreateActivity } from '../../hooks/useActivities'
import { ACTIVITY_TYPES } from '../../lib/constants'
import { toast } from '../ui/Toast'

export default function QuickLogFAB() {
  const [open, setOpen]         = useState(false)
  const [type, setType]         = useState('call')
  const [contactId, setContact] = useState('')
  const [body, setBody]         = useState('')
  const [followup, setFollowup] = useState('')
  const [errors, setErrors]     = useState({})

  const { data: contacts = [] }           = useContacts()
  const { mutate: logActivity }           = useCreateActivity()
  const { mutate: updateContact }         = useUpdateContact()

  const today = new Date().toISOString().split('T')[0]

  const contactOptions = [
    { value: '', label: 'Select contact…' },
    ...(contacts ?? []).map(c => ({
      value: c.id,
      label: `${c.full_name}${c.company ? ` — ${c.company}` : ''}`,
    })),
  ]

  const validate = () => {
    const e = {}
    if (!contactId) e.contact = 'Please select a contact'
    if (!body.trim()) e.body   = 'Notes cannot be empty'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return

    logActivity(
      {
        type,
        title: type.charAt(0).toUpperCase() + type.slice(1),
        body:  body.trim(),
        contact_id: contactId,
        occurred_at: new Date().toISOString(),
        owner: 'Ciaran',
      },
      {
        onSuccess: () => {
          // Update last_contacted and optionally next_followup
          const updates = { id: contactId, last_contacted: today }
          if (followup) updates.next_followup = followup
          updateContact(updates)

          toast.success('Activity logged')
          setOpen(false)
          setBody('')
          setContact('')
          setFollowup('')
          setType('call')
          setErrors({})
        },
        onError: () => toast.error('Something went wrong — please try again'),
      },
    )
  }

  const handleClose = () => {
    setOpen(false)
    setErrors({})
    setBody('')
    setContact('')
    setFollowup('')
    setType('call')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: 72, right: 20,
          width: 52, height: 52, borderRadius: '50%',
          background: '#33533D', border: '2px solid #60866C',
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(13,31,18,0.25)', zIndex: 150,
        }}
        title="Quick log activity"
      >
        <Plus size={22} />
      </button>

      {open && (
        <Modal title="Quick log" onClose={handleClose} width={440}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Select label="Activity type" value={type} onChange={setType} options={ACTIVITY_TYPES} />

            <div>
              <Select
                label="Contact *"
                value={contactId}
                onChange={v => { setContact(v); setErrors(e => ({ ...e, contact: '' })) }}
                options={contactOptions}
              />
              {errors.contact && (
                <div style={{ fontSize: 11, color: '#A32D2D', marginTop: 4, fontFamily: 'Poppins, sans-serif' }}>
                  {errors.contact}
                </div>
              )}
            </div>

            <div>
              <Textarea
                label="Notes *"
                value={body}
                onChange={v => { setBody(v); setErrors(e => ({ ...e, body: '' })) }}
                rows={4}
                placeholder="What happened? Key points, next steps…"
              />
              {errors.body && (
                <div style={{ fontSize: 11, color: '#A32D2D', marginTop: 4, fontFamily: 'Poppins, sans-serif' }}>
                  {errors.body}
                </div>
              )}
            </div>

            <div>
              <label style={{
                fontSize: 11, fontWeight: 600, color: '#4A6352',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                fontFamily: 'Poppins, sans-serif', display: 'block', marginBottom: 4,
              }}>
                Next follow-up (optional)
              </label>
              <input
                type="date"
                value={followup}
                onChange={e => setFollowup(e.target.value)}
                style={{
                  width: '100%', border: '1px solid #D4E0D8', borderRadius: 7,
                  padding: '8px 11px', fontSize: 13, fontFamily: 'Poppins, sans-serif',
                  color: '#0D1F12', outline: 'none', background: '#fff',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <Button onClick={handleSave}>Log</Button>
              <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
