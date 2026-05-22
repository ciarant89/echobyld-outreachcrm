import { useState } from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import { PIPELINE_STAGES } from '../../lib/constants'

const DEFAULTS = {
  title: '', stage: 'New lead', value_eur: '',
  contact_id: '', currency: 'EUR', close_date: '', owner: 'Ciaran', notes: '',
}

export default function DealForm({ initial = {}, contacts = [], onSave, onCancel, loading = false }) {
  const [form, setForm] = useState({ ...DEFAULTS, ...initial })
  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }))

  const contactOptions = [
    { value: '', label: 'No contact linked' },
    ...contacts.map(c => ({ value: c.id, label: `${c.full_name}${c.company ? ` — ${c.company}` : ''}` })),
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave({ ...form, value_eur: parseFloat(form.value_eur) || 0 })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Input label="Deal title *" value={form.title} onChange={set('title')} required placeholder="Sisk — Preconstruction Module" />

      <Select label="Contact" value={form.contact_id || ''} onChange={set('contact_id')} options={contactOptions} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Select label="Stage" value={form.stage} onChange={set('stage')} options={PIPELINE_STAGES} />
        <Input label="Value (€)" type="number" value={form.value_eur} onChange={set('value_eur')} placeholder="24000" />
        <Input label="Close date" type="date" value={form.close_date} onChange={set('close_date')} />
        <Input label="Owner" value={form.owner} onChange={set('owner')} placeholder="Ciaran" />
      </div>

      <Textarea label="Notes" value={form.notes} onChange={set('notes')} rows={2} placeholder="Key context for this deal…" />

      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="submit" disabled={!form.title.trim() || loading}>
          {loading ? 'Saving…' : initial.id ? 'Save changes' : 'Add deal'}
        </Button>
        {onCancel && <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  )
}
