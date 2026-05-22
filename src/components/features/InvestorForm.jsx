import { useState } from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import { INVESTOR_TYPES, INVESTOR_STAGES } from '../../lib/constants'

const DEFAULTS = {
  name: '', type: 'Angel', contact_name: '', contact_email: '',
  linkedin_url: '', stage: 'New lead', target_amount_eur: '',
  committed_amount_eur: '', last_contacted: '', next_followup: '',
  next_step: '', notes: '', owner: 'Ciaran',
}

export default function InvestorForm({ initial = {}, onSave, onCancel, loading = false }) {
  const [form, setForm] = useState({ ...DEFAULTS, ...initial })
  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave({
      ...form,
      target_amount_eur: parseFloat(form.target_amount_eur) || 0,
      committed_amount_eur: parseFloat(form.committed_amount_eur) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Investor / Fund name *" value={form.name} onChange={set('name')} required placeholder="Enterprise Ireland" />
        <Select label="Type" value={form.type} onChange={set('type')} options={INVESTOR_TYPES} />
        <Input label="Contact name" value={form.contact_name} onChange={set('contact_name')} placeholder="Jane Smith" />
        <Input label="Contact email" type="email" value={form.contact_email} onChange={set('contact_email')} placeholder="jane@fund.com" />
        <Select label="Stage" value={form.stage} onChange={set('stage')} options={INVESTOR_STAGES} />
        <Input label="Target amount (€)" type="number" value={form.target_amount_eur} onChange={set('target_amount_eur')} placeholder="50000" />
        <Input label="Committed (€)" type="number" value={form.committed_amount_eur} onChange={set('committed_amount_eur')} placeholder="0" />
        <Input label="Owner" value={form.owner} onChange={set('owner')} placeholder="Ciaran" />
        <Input label="Last contacted" type="date" value={form.last_contacted} onChange={set('last_contacted')} />
        <Input label="Next follow-up" type="date" value={form.next_followup} onChange={set('next_followup')} />
      </div>

      <Input label="Next step" value={form.next_step} onChange={set('next_step')} placeholder="Send pitch deck" />
      <Textarea label="Notes" value={form.notes} onChange={set('notes')} rows={3} placeholder="Background, thesis fit, key contacts…" />

      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="submit" disabled={!form.name.trim() || loading}>
          {loading ? 'Saving…' : initial.id ? 'Save changes' : 'Add investor'}
        </Button>
        {onCancel && <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  )
}
