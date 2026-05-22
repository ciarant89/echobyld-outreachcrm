import { useState } from 'react'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { ACTIVITY_TYPES } from '../../lib/constants'

export default function LogActivityForm({ onLog, onCancel }) {
  const [type, setType]       = useState('call')
  const [title, setTitle]     = useState('')
  const [body, setBody]       = useState('')
  const [date, setDate]       = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = () => {
    if (!body.trim()) return
    onLog({
      type,
      title: title || type.charAt(0).toUpperCase() + type.slice(1),
      body: body.trim(),
      occurred_at: new Date(date).toISOString(),
      owner: 'Ciaran',
    })
    setBody('')
    setTitle('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <Select
          label="Type"
          value={type}
          onChange={setType}
          options={ACTIVITY_TYPES}
          style={{ flex: 1 }}
        />
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={setDate}
          style={{ flex: 1 }}
        />
      </div>
      <Input
        label="Title (optional)"
        value={title}
        onChange={setTitle}
        placeholder="e.g. Intro call"
      />
      <Textarea
        label="Notes *"
        value={body}
        onChange={setBody}
        rows={3}
        placeholder="What happened? Key takeaways, next steps…"
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <Button onClick={handleSubmit} disabled={!body.trim()}>Log Activity</Button>
        {onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
      </div>
    </div>
  )
}
