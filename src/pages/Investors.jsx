import { useState, useMemo, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../components/ui/Avatar'
import StatusBadge from '../components/ui/StatusBadge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import InvestorForm from '../components/features/InvestorForm'
import EmptyState from '../components/ui/EmptyState'
import {
  useInvestors, useCreateInvestor, useUpdateInvestor, useDeleteInvestor,
} from '../hooks/useInvestors'
import { fmtCurrency, fmtDateFull, isOverdue } from '../lib/utils'
import { INVESTOR_STAGES, INVESTOR_TYPES } from '../lib/constants'
import { toast } from '../components/ui/Toast'

export default function Investors() {
  useEffect(() => {
    document.title = 'Investors — EchoByld CRM'
    return () => { document.title = 'EchoByld CRM' }
  }, [])

  const navigate = useNavigate()
  const { data: investors = [] }   = useInvestors()
  const { mutate: createInvestor } = useCreateInvestor()
  const { mutate: updateInvestor } = useUpdateInvestor()
  const { mutate: deleteInvestor } = useDeleteInvestor()

  const [showAdd, setShowAdd]   = useState(false)
  const [editInv, setEditInv]   = useState(null)
  const [stageFilter, setStage] = useState('')
  const [typeFilter, setType]   = useState('')

  const filtered = useMemo(() => {
    return investors.filter(i => {
      const stageOk = !stageFilter || i.stage === stageFilter
      const typeOk  = !typeFilter  || i.type  === typeFilter
      return stageOk && typeOk
    })
  }, [investors, stageFilter, typeFilter])

  const totalTarget    = investors.reduce((s, i) => s + (i.target_amount_eur || 0), 0)
  const totalCommitted = investors.reduce((s, i) => s + (i.committed_amount_eur || 0), 0)

  const handleAdd = (data) => {
    createInvestor(data, {
      onSuccess: () => { toast.success('Investor added'); setShowAdd(false) },
      onError:   () => toast.error('Something went wrong — please try again'),
    })
  }

  const handleEdit = (data) => {
    updateInvestor(
      { id: editInv.id, ...data },
      {
        onSuccess: () => { toast.success('Investor updated'); setEditInv(null) },
        onError:   () => toast.error('Something went wrong — please try again'),
      },
    )
  }

  const handleDelete = (inv) => {
    if (!confirm(`Delete "${inv.name}"?`)) return
    deleteInvestor(inv.id, {
      onSuccess: () => toast.success('Investor deleted'),
      onError:   () => toast.error('Something went wrong — please try again'),
    })
  }

  const TH = ({ children }) => (
    <th style={{
      textAlign: 'left',
      padding: '10px 14px',
      fontSize: 10,
      fontWeight: 700,
      color: '#4A6352',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontFamily: 'Poppins, sans-serif',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </th>
  )

  return (
    <div style={{ padding: '24px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0D1F12', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
            Investors
          </h1>
          <div style={{ fontSize: 13, color: '#4A6352', marginTop: 2, fontFamily: 'Poppins, sans-serif' }}>
            {investors.length} investors · target {fmtCurrency(totalTarget)} · committed {fmtCurrency(totalCommitted)}
          </div>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus size={14} /> Add investor
        </Button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <select
          value={stageFilter}
          onChange={e => setStage(e.target.value)}
          style={{
            border: '1px solid #D4E0D8', borderRadius: 7, padding: '7px 11px',
            fontSize: 12, fontFamily: 'Poppins, sans-serif', color: '#0D1F12',
            outline: 'none', background: '#fff', cursor: 'pointer',
          }}
        >
          <option value="">All stages</option>
          {INVESTOR_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={e => setType(e.target.value)}
          style={{
            border: '1px solid #D4E0D8', borderRadius: 7, padding: '7px 11px',
            fontSize: 12, fontFamily: 'Poppins, sans-serif', color: '#0D1F12',
            outline: 'none', background: '#fff', cursor: 'pointer',
          }}
        >
          <option value="">All types</option>
          {INVESTOR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{
        background: '#fff',
        border: '1px solid #D4E0D8',
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(13,31,18,0.06)',
      }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon="💼"
            title="No investors yet"
            sub="Track VCs, angels, grants and accelerators here."
            action={<Button onClick={() => setShowAdd(true)}><Plus size={14} /> Add investor</Button>}
          />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F4F7F5', borderBottom: '1px solid #D4E0D8' }}>
                <TH>Name</TH>
                <TH>Type</TH>
                <TH>Stage</TH>
                <TH>Target</TH>
                <TH>Committed</TH>
                <TH>Last contact</TH>
                <TH>Next follow-up</TH>
                <TH>Next step</TH>
                <TH></TH>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => (
                <tr
                  key={inv.id}
                  style={{
                    background: i % 2 === 0 ? '#fff' : '#F4F7F5',
                    borderBottom: '1px solid #D4E0D8',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/investors/${inv.id}`)}
                  onMouseEnter={e => { e.currentTarget.style.background = '#E8F5E9' }}
                  onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#F4F7F5' }}
                >
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={inv.name} size={36} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1F12', fontFamily: 'Poppins, sans-serif' }}>
                          {inv.name}
                        </div>
                        {inv.contact_name && (
                          <div style={{ fontSize: 11, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>
                            {inv.contact_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>
                    {inv.type}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <StatusBadge status={inv.stage} />
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 12, fontFamily: 'Poppins, sans-serif', color: '#0D1F12', fontWeight: 600 }}>
                    {inv.target_amount_eur > 0 ? fmtCurrency(inv.target_amount_eur) : '—'}
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 12, fontFamily: 'Poppins, sans-serif', color: '#33533D', fontWeight: 600 }}>
                    {inv.committed_amount_eur > 0 ? fmtCurrency(inv.committed_amount_eur) : '—'}
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>
                    {inv.last_contacted ? fmtDateFull(inv.last_contacted) : '—'}
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}>
                    {inv.next_followup ? (
                      <span style={{ color: isOverdue(inv.next_followup) ? '#7F0000' : '#4A6352', fontWeight: isOverdue(inv.next_followup) ? 600 : 400 }}>
                        {fmtDateFull(inv.next_followup)}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>
                    {inv.next_step || '—'}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={e => { e.stopPropagation(); setEditInv(inv) }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A6352', padding: 4, display: 'flex' }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(inv) }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7F0000', padding: 4, display: 'flex' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && (
        <Modal title="Add investor" onClose={() => setShowAdd(false)} width={600}>
          <InvestorForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />
        </Modal>
      )}

      {editInv && (
        <Modal title="Edit investor" onClose={() => setEditInv(null)} width={600}>
          <InvestorForm initial={editInv} onSave={handleEdit} onCancel={() => setEditInv(null)} />
        </Modal>
      )}
    </div>
  )
}

