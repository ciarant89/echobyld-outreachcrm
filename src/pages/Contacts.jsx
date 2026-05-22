import { useState, useMemo, useEffect } from 'react'
import { Search, Plus, Upload } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../components/ui/Avatar'
import StatusBadge from '../components/ui/StatusBadge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import ContactForm from '../components/features/ContactForm'
import EmptyState from '../components/ui/EmptyState'
import { useContacts, useCreateContact } from '../hooks/useContacts'
import { CONTACT_STATUSES, SEGMENTS } from '../lib/constants'
import { fmtDateFull, isOverdue, isDueSoon } from '../lib/utils'
import { toast } from '../components/ui/Toast'

const CHIP_FILTERS = [
  { label: 'All',           filter: () => true },
  { label: 'Ireland',       filter: c => c.country === 'Ireland' },
  { label: 'UK',            filter: c => c.country === 'UK' },
  { label: 'High interest', filter: c => c.interest_level === 'High' },
  { label: 'Follow-up due', filter: c => isOverdue(c.next_followup) || isDueSoon(c.next_followup) },
]

export default function Contacts() {
  useEffect(() => {
    document.title = 'Contacts — EchoByld CRM'
    return () => { document.title = 'EchoByld CRM' }
  }, [])

  const { data: contacts = [], isLoading } = useContacts()
  const { mutate: createContact } = useCreateContact()
  const navigate = useNavigate()

  const [search, setSearch]     = useState('')
  const [chipIdx, setChipIdx]   = useState(0)
  const [statusFilter, setStatus] = useState('')
  const [segFilter, setSeg]     = useState('')
  const [showAdd, setShowAdd]   = useState(false)

  const filtered = useMemo(() => {
    return contacts.filter(c => {
      const chipOk   = CHIP_FILTERS[chipIdx].filter(c)
      const statusOk = !statusFilter || c.status === statusFilter
      const segOk    = !segFilter    || c.segment === segFilter
      const q        = search.toLowerCase()
      const searchOk = !q || [c.full_name, c.company, c.email, c.role, c.country]
        .some(f => f?.toLowerCase().includes(q))
      return chipOk && statusOk && segOk && searchOk
    })
  }, [contacts, search, chipIdx, statusFilter, segFilter])

  const handleAdd = (data) => {
    createContact(data, {
      onSuccess: () => { toast.success('Contact added'); setShowAdd(false) },
      onError:   () => toast.error('Something went wrong — please try again'),
    })
  }

  const TH = ({ children }) => (
    <th style={{
      textAlign: 'left', padding: '10px 14px', fontSize: 10, fontWeight: 700,
      color: '#4A6352', letterSpacing: '0.08em', textTransform: 'uppercase',
      fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap',
    }}>
      {children}
    </th>
  )

  return (
    <div className="page-pad" style={{ padding: '24px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0D1F12', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
            Contacts
          </h1>
          <div style={{ fontSize: 13, color: '#4A6352', marginTop: 2, fontFamily: 'Poppins, sans-serif' }}>
            {filtered.length} of {contacts.length} contacts
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" className="hide-mobile" onClick={() => navigate('/import')}>
            <Upload size={14} /> Import CSV
          </Button>
          <Button onClick={() => setShowAdd(true)}>
            <Plus size={14} /> Add
          </Button>
        </div>
      </div>

      {/* Filter row */}
      <div className="filter-scroll" style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#4A6352' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            style={{
              border: '1px solid #D4E0D8', borderRadius: 7, padding: '7px 11px 7px 32px',
              fontSize: 13, fontFamily: 'Poppins, sans-serif', color: '#0D1F12',
              outline: 'none', width: 180, background: '#fff',
            }}
          />
        </div>

        {CHIP_FILTERS.map((chip, i) => (
          <button key={chip.label} onClick={() => setChipIdx(i)} style={{
            background: chipIdx === i ? '#33533D' : '#fff',
            color: chipIdx === i ? '#fff' : '#4A6352',
            border: `1px solid ${chipIdx === i ? '#33533D' : '#D4E0D8'}`,
            borderRadius: 9999, padding: '5px 14px', fontSize: 12,
            fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
            flexShrink: 0,
          }}>
            {chip.label}
          </button>
        ))}

        <select value={statusFilter} onChange={e => setStatus(e.target.value)} style={{
          border: '1px solid #D4E0D8', borderRadius: 7, padding: '7px 11px',
          fontSize: 12, fontFamily: 'Poppins, sans-serif', color: '#0D1F12',
          outline: 'none', background: '#fff', cursor: 'pointer', flexShrink: 0,
        }}>
          <option value="">All statuses</option>
          {CONTACT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={segFilter} onChange={e => setSeg(e.target.value)} style={{
          border: '1px solid #D4E0D8', borderRadius: 7, padding: '7px 11px',
          fontSize: 12, fontFamily: 'Poppins, sans-serif', color: '#0D1F12',
          outline: 'none', background: '#fff', cursor: 'pointer', flexShrink: 0,
        }}>
          <option value="">All segments</option>
          {SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Desktop table */}
      <div className="contacts-table-wrap" style={{
        background: '#fff', border: '1px solid #D4E0D8', borderRadius: 10,
        overflow: 'hidden', boxShadow: '0 1px 4px rgba(13,31,18,0.06)',
      }}>
        {isLoading ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div className="skeleton" style={{ width: 120, height: 12 }} />
                        <div className="skeleton" style={{ width: 80, height: 10 }} />
                      </div>
                    </div>
                  </td>
                  {[80, 90, 70, 70, 70, 50].map((w, j) => (
                    <td key={j} style={{ padding: '12px 14px' }}>
                      <div className="skeleton" style={{ width: w, height: 12 }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={search ? '🔍' : '👤'}
            title={search ? 'No contacts match your search' : 'No contacts found'}
            sub={search ? 'Try a different name or company' : 'Add your first contact to get started.'}
            action={!search && <Button onClick={() => setShowAdd(true)}><Plus size={14} /> Add contact</Button>}
          />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F4F7F5', borderBottom: '1px solid #D4E0D8' }}>
                <TH>Name / Company</TH>
                <TH>Role</TH>
                <TH>Status</TH>
                <TH>Country</TH>
                <TH>Segment</TH>
                <TH>Last contact</TH>
                <TH>Next follow-up</TH>
                <TH>Owner</TH>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/contacts/${c.id}`)}
                  style={{
                    background: i % 2 === 0 ? '#fff' : '#FAFAF8',
                    borderBottom: '1px solid #D4E0D8',
                    cursor: 'pointer',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F0F4F1'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAFAF8'}
                >
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={c.full_name} size={32} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1F12', fontFamily: 'Poppins, sans-serif' }}>{c.full_name}</div>
                        {c.company && <div style={{ fontSize: 11, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>{c.company}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>{c.role || '—'}</td>
                  <td style={{ padding: '11px 14px' }}><StatusBadge status={c.status} /></td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>{c.country || '—'}</td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>{c.segment || '—'}</td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>{c.last_contacted ? fmtDateFull(c.last_contacted) : '—'}</td>
                  <td style={{ padding: '11px 14px', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}>
                    {c.next_followup ? (
                      <span style={{ color: isOverdue(c.next_followup) ? '#A32D2D' : isDueSoon(c.next_followup) ? '#92400E' : '#4A6352', fontWeight: isOverdue(c.next_followup) ? 600 : 400 }}>
                        {fmtDateFull(c.next_followup)}{isOverdue(c.next_followup) && ' ●'}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>{c.owner || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile card list */}
      <div className="contacts-cards-wrap" style={{ display: 'none', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <EmptyState icon={search ? '🔍' : '👤'} title={search ? 'No contacts match' : 'No contacts yet'} sub="Add your first contact." />
        ) : filtered.map(c => (
          <div
            key={c.id}
            onClick={() => navigate(`/contacts/${c.id}`)}
            style={{
              background: '#fff', border: '1px solid #D4E0D8', borderRadius: 10,
              padding: '12px 14px', cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: 12,
            }}
          >
            <Avatar name={c.full_name} size={40} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0D1F12', fontFamily: 'Poppins, sans-serif', marginBottom: 2 }}>{c.full_name}</div>
              {c.company && <div style={{ fontSize: 12, color: '#4A6352', fontFamily: 'Poppins, sans-serif', marginBottom: 4 }}>{c.company}</div>}
              <StatusBadge status={c.status} />
            </div>
            {c.next_followup && isOverdue(c.next_followup) && (
              <div style={{ fontSize: 10, color: '#A32D2D', fontWeight: 700, fontFamily: 'Poppins, sans-serif', flexShrink: 0 }}>Overdue</div>
            )}
          </div>
        ))}
      </div>

      {showAdd && (
        <Modal title="Add contact" onClose={() => setShowAdd(false)} width={600}>
          <ContactForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />
        </Modal>
      )}
    </div>
  )
}
