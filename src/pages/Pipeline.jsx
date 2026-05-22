import { useState, useMemo, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import DealForm from '../components/features/DealForm'
import { useDeals, useCreateDeal, useUpdateDeal, useDeleteDeal } from '../hooks/useDeals'
import { useContacts } from '../hooks/useContacts'
import { fmtCurrency, fmtDateFull } from '../lib/utils'
import { PIPELINE_STAGES, STAGE_BORDER_COLORS } from '../lib/constants'
import { toast } from '../components/ui/Toast'

export default function Pipeline() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Pipeline — EchoByld CRM'
    return () => { document.title = 'EchoByld CRM' }
  }, [])

  const { data: deals = [] }    = useDeals()
  const { data: contacts = [] } = useContacts()
  const { mutate: createDeal }  = useCreateDeal()
  const { mutate: updateDeal }  = useUpdateDeal()
  const { mutate: deleteDeal }  = useDeleteDeal()

  const [showAdd, setShowAdd]   = useState(false)
  const [addStage, setAddStage] = useState('New lead')
  const [openDeal, setOpenDeal] = useState(null)

  // Local stage map for optimistic drag updates
  const [localStages, setLocalStages] = useState({})

  const byStage = useMemo(() => {
    const map = {}
    PIPELINE_STAGES.forEach(s => { map[s] = [] })
    deals.forEach(d => {
      const stage = localStages[d.id] ?? d.stage
      if (map[stage]) map[stage].push({ ...d, stage })
    })
    return map
  }, [deals, localStages])

  // Contacts with no deal at all — auto-shown in New lead
  const linkedContactIds = useMemo(() => new Set(deals.map(d => d.contact_id).filter(Boolean)), [deals])
  const contactsWithoutDeals = useMemo(
    () => contacts.filter(c => !linkedContactIds.has(c.id)),
    [contacts, linkedContactIds]
  )

  const totalValue = deals.reduce((s, d) => s + (d.value_eur || 0), 0)

  const handleDragEnd = ({ source, destination, draggableId }) => {
    if (!destination || source.droppableId === destination.droppableId) return
    const prevStage = source.droppableId
    const newStage  = destination.droppableId

    // Optimistic update
    setLocalStages(p => ({ ...p, [draggableId]: newStage }))

    updateDeal({ id: draggableId, stage: newStage }, {
      onSuccess: () => toast.success(`Moved to ${newStage}`),
      onError: () => {
        setLocalStages(p => ({ ...p, [draggableId]: prevStage }))
        toast.error('Failed to move deal')
      },
    })
  }

  const handleAdd = (data) => {
    createDeal({ ...data, stage: addStage }, {
      onSuccess: () => { toast.success('Deal added'); setShowAdd(false) },
      onError:   () => toast.error('Something went wrong — please try again'),
    })
  }

  const handleUpdate = (data) => {
    updateDeal({ id: openDeal.id, ...data }, {
      onSuccess: () => { toast.success('Deal updated'); setOpenDeal(null) },
      onError:   () => toast.error('Something went wrong — please try again'),
    })
  }

  const handleDelete = () => {
    if (!confirm('Delete this deal?')) return
    deleteDeal(openDeal.id, {
      onSuccess: () => { toast.success('Deal deleted'); setOpenDeal(null) },
      onError:   () => toast.error('Something went wrong — please try again'),
    })
  }

  return (
    <div style={{ padding: '24px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0D1F12', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
            Pipeline
          </h1>
          <div style={{ fontSize: 13, color: '#4A6352', marginTop: 2, fontFamily: 'Poppins, sans-serif' }}>
            {deals.length} deals · total {fmtCurrency(totalValue)}
          </div>
        </div>
        <Button onClick={() => { setAddStage('New lead'); setShowAdd(true) }}>
          <Plus size={14} /> Add deal
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${PIPELINE_STAGES.length}, 1fr)`,
          gap: 6, paddingBottom: 16,
        }}>
          {PIPELINE_STAGES.map(stage => {
            const stageDeals  = byStage[stage] ?? []
            const stageValue  = stageDeals.reduce((s, d) => s + (d.value_eur || 0), 0)
            const borderColor = STAGE_BORDER_COLORS[stage] || '#D4E0D8'
            const isNewLead   = stage === 'New lead'
            const totalCount  = isNewLead ? stageDeals.length + contactsWithoutDeals.length : stageDeals.length

            return (
              <div key={stage} style={{ minWidth: 0 }}>
                {/* Column header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3, padding: '0 2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0D1F12', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>
                      {stage}
                    </span>
                    <span style={{
                      background: borderColor + '33', color: '#0D1F12', border: `1px solid ${borderColor}`,
                      borderRadius: 9999, padding: '0 5px', fontSize: 9, fontWeight: 700,
                      fontFamily: 'Poppins, sans-serif', flexShrink: 0,
                    }}>
                      {totalCount}
                    </span>
                  </div>
                  <button
                    onClick={() => { setAddStage(stage); setShowAdd(true) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A6352', padding: 1, display: 'flex', flexShrink: 0 }}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Stage value */}
                <div style={{
                  fontSize: 13, fontWeight: 700, color: '#33533D',
                  fontFamily: 'Poppins, sans-serif', marginBottom: 8, paddingLeft: 2,
                  minHeight: 18,
                }}>
                  {stageValue > 0 ? fmtCurrency(stageValue) : ''}
                </div>

                {/* Contacts without deals — only in New lead */}
                {isNewLead && contactsWithoutDeals.map(c => (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/contacts/${c.id}`)}
                    style={{ marginBottom: 6 }}
                  >
                    <Card style={{
                      padding: '8px 10px',
                      borderLeft: `3px solid ${borderColor}`,
                      boxShadow: '0 1px 3px rgba(13,31,18,0.06)',
                      cursor: 'pointer',
                      background: '#F9FCF9',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                        <User size={10} color="#60866C" />
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#0D1F12', fontFamily: 'Poppins, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.full_name}
                        </div>
                      </div>
                      {c.company && (
                        <div style={{ fontSize: 10, color: '#60866C', fontFamily: 'Poppins, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.company}
                        </div>
                      )}
                    </Card>
                  </div>
                ))}

                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: 60,
                        background: snapshot.isDraggingOver ? '#E8F5E9' : 'transparent',
                        borderRadius: 8, transition: 'background 0.15s',
                        display: 'flex', flexDirection: 'column', gap: 6, padding: 2,
                      }}
                    >
                      {stageDeals.length === 0 && !isNewLead && (
                        <div style={{
                          border: `1.5px dashed ${borderColor}`, borderRadius: 8,
                          padding: '14px 8px', textAlign: 'center',
                          fontSize: 10, color: '#4A6352', fontFamily: 'Poppins, sans-serif',
                        }}>
                          Drop here
                        </div>
                      )}

                      {stageDeals.map((deal, idx) => (
                        <Draggable key={deal.id} draggableId={deal.id} index={idx}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setOpenDeal(deal)}
                            >
                              <Card style={{
                                padding: '8px 10px',
                                borderLeft: `3px solid ${borderColor}`,
                                boxShadow: snapshot.isDragging
                                  ? '0 8px 24px rgba(13,31,18,0.18)'
                                  : '0 1px 3px rgba(13,31,18,0.06)',
                                cursor: 'pointer',
                              }}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: '#0D1F12', fontFamily: 'Poppins, sans-serif', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {deal.title}
                                </div>
                                {deal.contact_id && contacts.find(c => c.id === deal.contact_id) && (
                                  <div style={{ fontSize: 10, color: '#60866C', fontFamily: 'Poppins, sans-serif', fontWeight: 600, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {contacts.find(c => c.id === deal.contact_id).full_name}
                                  </div>
                                )}
                                {deal.value_eur > 0 && (
                                  <div style={{
                                    display: 'inline-block', background: '#E8F5E9', color: '#33533D',
                                    border: '1px solid #ADCCB7', borderRadius: 9999, padding: '0 6px',
                                    fontSize: 10, fontWeight: 700, fontFamily: 'Poppins, sans-serif', marginBottom: 2,
                                  }}>
                                    {fmtCurrency(deal.value_eur)}
                                  </div>
                                )}
                                {deal.close_date && (
                                  <div style={{ fontSize: 9, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>
                                    Close {fmtDateFull(deal.close_date)}
                                  </div>
                                )}
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>

      {/* Add deal modal */}
      {showAdd && (
        <Modal title={`Add deal — ${addStage}`} onClose={() => setShowAdd(false)} width={560}>
          <DealForm
            initial={{ stage: addStage }}
            contacts={contacts}
            onSave={handleAdd}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {/* Edit deal modal */}
      {openDeal && (
        <Modal title={openDeal.title} onClose={() => setOpenDeal(null)} width={560}>
          <DealForm
            initial={openDeal}
            contacts={contacts}
            onSave={handleUpdate}
            onCancel={() => setOpenDeal(null)}
          />
          <div style={{ borderTop: '1px solid #D4E0D8', marginTop: 16, paddingTop: 16 }}>
            <Button variant="danger" onClick={handleDelete}>Delete deal</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
