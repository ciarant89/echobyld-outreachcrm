import { useState } from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import { CONTACT_STATUSES, COUNTRIES, SEGMENTS, INTEREST_LEVELS, SOURCES } from '../../lib/constants'

const DEFAULTS = {
  full_name: '', role: '', company: '', email: '', phone: '',
  linkedin_url: '', country: 'Ireland', status: 'New lead',
  interest_level: 'Unknown', segment: 'Other', source: '',
  owner: 'Ciaran', notes: '', next_followup: '',
}

export default function ContactForm({ initial = {}, onSave, onCancel, loading = false }) {
  const [form, setForm] = useState({ ...DEFAULTS, ...initial })
  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.full_name.trim()) return
    onSave({ ...form })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Full name" value={form.full_name} onChange={set('full_name')} required placeholder="Jane Smith" />
        <Input label="Role / Title" value={form.role} onChange={set('role')} placeholder="Head of Operations" />
        <Input label="Company" value={form.company} onChange={set('company')} placeholder="Sisk & Son" />
        <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="jane@example.com" />
        <Input label="Phone" value={form.phone} onChange={set('phone')} placeholder="+353 87 123 4567" />
        <Input label="LinkedIn URL" value={form.linkedin_url} onChange={set('linkedin_url')} placeholder="https://linkedin.com/in/..." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <Select label="Country" value={form.country} onChange={set('country')} options={COUNTRIES} />
        <Select label="Status" value={form.status} onChange={set('status')} options={CONTACT_STATUSES} />
        <Select label="Interest" value={form.interest_level} onChange={set('interest_level')} options={INTEREST_LEVELS} />
        <Select label="Segment" value={form.segment} onChange={set('segment')} options={SEGMENTS} />
        <Select label="Source" value={form.source} onChange={set('source')} options={['', ...SOURCES]} />
        <Input label="Next follow-up" type="date" value={form.next_followup} onChange={set('next_followup')} />
      </div>

      <Textarea label="Notes" value={form.notes} onChange={set('notes')} rows={3} placeholder="Key context, interests, background…" />

      <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
        <Button type="submit" disabled={!form.full_name.trim() || loading}>
          {loading ? 'Saving…' : initial.id ? 'Save changes' : 'Add contact'}
        </Button>
        {onCancel && <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  )
}
