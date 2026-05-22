import { useState } from 'react'
import { Mic, Square, Plus } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import { PIPELINE_STAGES } from '../../lib/constants'
import { useVoiceNote } from '../../hooks/useVoiceNote'

const DEFAULTS = {
  title: '', stage: 'New lead', value_eur: '',
  contact_id: '', currency: 'EUR', close_date: '', owner: 'Ciaran', notes: '',
}

export default function DealForm({ initial = {}, contacts = [], onSave, onCancel, loading = false }) {
  const [form, setForm] = useState({ ...DEFAULTS, ...initial })
  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }))
  const { isRecording, transcript, isSupported, startRecording, stopRecording, clearTranscript } = useVoiceNote()

  const addTranscriptToNotes = () => {
    if (!transcript.trim()) return
    const separator = form.notes.trim() ? '\n\n' : ''
    setForm(f => ({ ...f, notes: f.notes + separator + transcript }))
    clearTranscript()
    stopRecording()
  }

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

      <Textarea label="Notes" value={form.notes} onChange={set('notes')} rows={3} placeholder="Key context for this deal…" />

      {/* Voice recorder — appends transcript to notes */}
      {isSupported && (
        <div style={{
          background: '#0D1410', border: '1px solid #33533D',
          borderRadius: 8, padding: '10px 14px',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#ADCCB7', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Poppins, sans-serif', marginBottom: 8 }}>
            Voice note → notes
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={isRecording ? 'recording-pulse' : ''}
              style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: isRecording ? '#7F0000' : '#33533D',
                border: `2px solid ${isRecording ? '#EF9A9A' : '#60866C'}`,
                color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {isRecording ? <Square size={15} /> : <Mic size={15} />}
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              {isRecording && (
                <div style={{ fontSize: 10, color: '#EF4444', fontWeight: 700, fontFamily: 'Poppins, sans-serif', marginBottom: 4 }}>● Recording…</div>
              )}
              <div style={{
                fontSize: 12, color: transcript ? '#ADCCB7' : '#4A6352',
                fontFamily: 'Poppins, sans-serif', lineHeight: 1.5,
                background: transcript ? '#1A2B1F' : 'transparent',
                borderRadius: 5, padding: transcript ? '6px 8px' : 0,
                minHeight: 20,
              }}>
                {transcript || (isRecording ? 'Speak now…' : 'Tap mic, speak, then add to notes')}
              </div>
            </div>
            {transcript && !isRecording && (
              <button
                type="button"
                onClick={addTranscriptToNotes}
                style={{
                  background: '#33533D', color: '#fff', border: 'none', borderRadius: 6,
                  padding: '6px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
                }}
              >
                <Plus size={12} /> Add to notes
              </button>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="submit" disabled={!form.title.trim() || loading}>
          {loading ? 'Saving…' : initial.id ? 'Save changes' : 'Add deal'}
        </Button>
        {onCancel && <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  )
}
