import { useState, useMemo, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
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
          gridTemplateColumns: `repeat(${PIPELINE_STAGES.length}, minmax(230px, 1fr))`,
          gap: 12, overflowX: 'auto', paddingBottom: 16,
        }}>
          {PIPELINE_STAGES.map(stage => {
            const stageDeals  = byStage[stage] ?? []
            const stageValue  = stageDeals.reduce((s, d) => s + (d.value_eur || 0), 0)
            const borderColor = STAGE_BORDER_COLORS[stage] || '#D4E0D8'

            return (
              <div key={stage} style={{ minWidth: 230 }}>
                {/* Column header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, padding: '0 2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0D1F12', fontFamily: 'Poppins, sans-serif' }}>
                      {stage}
                    </span>
                    <span style={{
                      background: borderColor + '33', color: '#0D1F12', border: `1px solid ${borderColor}`,
                      borderRadius: 9999, padding: '0 7px', fontSize: 10, fontWeight: 700,
                      fontFamily: 'Poppins, sans-serif',
                    }}>
                      {stageDeals.length}
                    </span>
                  </div>
                  <button
                    onClick={() => { setAddStage(stage); setShowAdd(true) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A6352', padding: 2, display: 'flex' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Stage value */}
                <div style={{
                  fontSize: 15, fontWeight: 700, color: '#33533D',
                  fontFamily: 'Poppins, sans-serif', marginBottom: 10, paddingLeft: 2,
                  minHeight: 22,
                }}>
                  {stageValue > 0 ? fmtCurrency(stageValue) : ''}
                </div>

                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: 80,
                        background: snapshot.isDraggingOver ? '#E8F5E9' : 'transparent',
                        borderRadius: 8, transition: 'background 0.15s',
                        display: 'flex', flexDirection: 'column', gap: 8, padding: 2,
                      }}
                    >
                      {stageDeals.length === 0 && (
                        <div style={{
                          border: `1.5px dashed ${borderColor}`, borderRadius: 8,
                          padding: '20px 12px', textAlign: 'center',
                          fontSize: 11, color: '#4A6352', fontFamily: 'Poppins, sans-serif',
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
                                padding: '12px 14px',
                                borderLeft: `3px solid ${borderColor}`,
                                boxShadow: snapshot.isDragging
                                  ? '0 8px 24px rgba(13,31,18,0.18)'
                                  : '0 1px 4px rgba(13,31,18,0.06)',
                                cursor: 'pointer',
                              }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1F12', fontFamily: 'Poppins, sans-serif', marginBottom: 6 }}>
                                  {deal.title}
                                </div>
                                {deal.value_eur > 0 && (
                                  <div style={{
                                    display: 'inline-block', background: '#E8F5E9', color: '#33533D',
                                    border: '1px solid #ADCCB7', borderRadius: 9999, padding: '1px 8px',
                                    fontSize: 11, fontWeight: 700, fontFamily: 'Poppins, sans-serif', marginBottom: 4,
                                  }}>
                                    {fmtCurrency(deal.value_eur)}
                                  </div>
                                )}
                                {deal.close_date && (
                                  <div style={{ fontSize: 10, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>
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
