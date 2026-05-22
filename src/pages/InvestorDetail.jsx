import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import StatusBadge from '../components/ui/StatusBadge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import InvestorForm from '../components/features/InvestorForm'
import ActivityTimeline from '../components/features/ActivityTimeline'
import LogActivityForm from '../components/features/LogActivityForm'
import {
  useInvestor, useUpdateInvestor, useDeleteInvestor,
  useInvestorActivities, useCreateInvestorActivity,
} from '../hooks/useInvestors'
import { INVESTOR_STAGES } from '../lib/constants'
import { fmtCurrency, fmtDateFull, isOverdue, isDueSoon } from '../lib/utils'
import { toast } from '../components/ui/Toast'

export default function InvestorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: investor, isLoading } = useInvestor(id)
  const { data: activities = [] }     = useInvestorActivities(id)
  const { mutate: updateInvestor }    = useUpdateInvestor()
  const { mutate: deleteInvestor }    = useDeleteInvestor()
  const { mutate: createActivity }    = useCreateInvestorActivity()

  const [showEdit, setShowEdit] = useState(false)
  const [showLog, setShowLog]   = useState(false)
  const [notes, setNotes]       = useState('')
  const [followup, setFollowup] = useState('')

  useEffect(() => {
    if (investor) {
      document.title = `${investor.name} — EchoByld CRM`
      setNotes(investor.notes || '')
      setFollowup(investor.next_followup || '')
    }
    return () => { document.title = 'EchoByld CRM' }
  }, [investor])

  if (isLoading) return (
    <div style={{ padding: '40px 24px', fontFamily: 'Poppins, sans-serif', color: '#4A6352' }}>
      Loading…
    </div>
  )

  if (!investor) return (
    <div style={{ padding: '40px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#0D1F12', fontFamily: 'Poppins, sans-serif', marginBottom: 12 }}>
        Investor not found
      </div>
      <Button onClick={() => navigate('/investors')}>← Back to investors</Button>
    </div>
  )

  const followupColor = isOverdue(followup) ? '#A32D2D' : isDueSoon(followup) ? '#92400E' : '#0D1F12'

  const handleStageChange = (stage) => {
    updateInvestor({ id, stage }, {
      onSuccess: () => toast.success('Stage updated'),
      onError:   () => toast.error('Something went wrong — please try again'),
    })
  }

  const handleFollowupChange = (val) => {
    setFollowup(val)
    updateInvestor({ id, next_followup: val }, {
      onSuccess: () => toast.success('Follow-up updated'),
    })
  }

  const handleNotesBlur = () => {
    updateInvestor({ id, notes }, {
      onSuccess: () => toast.success('Notes saved'),
    })
  }

  const handleLog = (activity) => {
    createActivity({ ...activity, investor_id: id }, {
      onSuccess: () => { toast.success('Activity logged'); setShowLog(false) },
      onError:   () => toast.error('Something went wrong — please try again'),
    })
  }

  const handleDelete = () => {
    if (!confirm(`Delete ${investor.name}? This cannot be undone.`)) return
    deleteInvestor(id, {
      onSuccess: () => { toast.success('Investor deleted'); navigate('/investors') },
      onError:   () => toast.error('Something went wrong — please try again'),
    })
  }

  return (
    <div style={{ padding: '20px 24px' }}>
      <button
        onClick={() => navigate('/investors')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#60866C', fontWeight: 600, fontSize: 13,
          fontFamily: 'Poppins, sans-serif', display: 'flex',
          alignItems: 'center', gap: 6, marginBottom: 20, padding: 0,
        }}
      >
        <ArrowLeft size={15} /> Investors
      </button>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* LEFT SIDEBAR */}
        <div style={{
          width: 280, flexShrink: 0,
          background: '#fff', border: '1px solid #D4E0D8',
          borderRadius: 10, padding: 24,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
            <Avatar name={investor.name} size={80} />
            <div style={{
              fontSize: 20, fontWeight: 800, color: '#0D1F12',
              marginTop: 12, textAlign: 'center', fontFamily: 'Poppins, sans-serif',
            }}>
              {investor.name}
            </div>
            {investor.contact_name && (
              <div style={{ fontSize: 14, color: '#4A6352', textAlign: 'center', fontFamily: 'Poppins, sans-serif', marginTop: 2 }}>
                {investor.contact_name}
              </div>
            )}
            {investor.type && (
              <div style={{ fontSize: 14, fontWeight: 600, color: '#60866C', textAlign: 'center', fontFamily: 'Poppins, sans-serif', marginTop: 2 }}>
                {investor.type}
              </div>
            )}
            <div style={{ marginTop: 10 }}>
              <StatusBadge status={investor.stage} />
            </div>
            <div style={{ marginTop: 8, width: '100%' }}>
              <select
                value={investor.stage}
                onChange={e => handleStageChange(e.target.value)}
                style={{
                  width: '100%', border: '1px solid #D4E0D8', borderRadius: 7,
                  padding: '7px 10px', fontSize: 12, fontFamily: 'Poppins, sans-serif',
                  color: '#0D1F12', outline: 'none', background: '#fff', cursor: 'pointer',
                }}
              >
                {INVESTOR_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #D4E0D8', margin: '16px 0' }} />

          {[
            { label: 'Type',      value: investor.type },
            { label: 'Target',    value: investor.target_amount_eur > 0 ? fmtCurrency(investor.target_amount_eur) : null },
            { label: 'Committed', value: investor.committed_amount_eur > 0 ? fmtCurrency(investor.committed_amount_eur) : null },
            { label: 'Owner',     value: investor.owner },
            { label: 'Next step', value: investor.next_step },
            { label: 'Last contact', value: investor.last_contacted ? fmtDateFull(investor.last_contacted) : null },
          ].map(({ label, value }) => value ? (
            <InfoRow key={label} label={label} value={value} />
          ) : null)}

          {investor.contact_email && (
            <InfoRow label="Email">
              <a href={`mailto:${investor.contact_email}`} style={{ color: '#60866C', textDecoration: 'none', fontSize: 12 }}>
                <Mail size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />{investor.contact_email}
              </a>
            </InfoRow>
          )}

          <div style={{ borderTop: '1px solid #D4E0D8', margin: '16px 0' }} />

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
            Edit investor
          </Button>
          <button
            onClick={handleDelete}
            style={{
              width: '100%', marginTop: 8, background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 12, color: '#A32D2D',
              fontFamily: 'Poppins, sans-serif', padding: '6px 0',
            }}
          >
            Delete investor
          </button>
        </div>

        {/* RIGHT MAIN */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0D1F12', fontFamily: 'Poppins, sans-serif' }}>
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
        <Modal title="Edit investor" onClose={() => setShowEdit(false)} width={600}>
          <InvestorForm
            initial={investor}
            onSave={(data) => {
              updateInvestor({ id, ...data }, {
                onSuccess: () => { toast.success('Investor updated'); setShowEdit(false) },
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
