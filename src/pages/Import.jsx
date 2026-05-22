import { useState, useRef, useEffect } from 'react'
import { Upload, Check, AlertCircle, ChevronRight } from 'lucide-react'
import Papa from 'papaparse'
import Button from '../components/ui/Button'
import { useCreateContact } from '../hooks/useContacts'
import { toast } from '../components/ui/Toast'

const CRM_FIELDS = [
  { value: '',               label: '— Skip this column —' },
  { value: 'full_name',      label: 'Full name *' },
  { value: 'email',          label: 'Email' },
  { value: 'phone',          label: 'Phone' },
  { value: 'company',        label: 'Company' },
  { value: 'role',           label: 'Role / title' },
  { value: 'country',        label: 'Country' },
  { value: 'source',         label: 'Source' },
  { value: 'status',         label: 'Status' },
  { value: 'interest_level', label: 'Interest level' },
  { value: 'segment',        label: 'Segment' },
  { value: 'owner',          label: 'Owner' },
  { value: 'notes',          label: 'Notes' },
  { value: 'next_followup',  label: 'Next follow-up (YYYY-MM-DD)' },
  { value: 'linkedin_url',   label: 'LinkedIn URL' },
]

function autoMap(header) {
  const h = header.toLowerCase().trim()
  if (h.includes('name') && !h.includes('company') && !h.includes('contact')) return 'full_name'
  if (h === 'full name' || h === 'full_name') return 'full_name'
  if (h.includes('email')) return 'email'
  if (h.includes('phone') || h.includes('mobile') || h.includes('tel')) return 'phone'
  if (h.includes('company') || h.includes('organisation') || h.includes('organization')) return 'company'
  if (h.includes('role') || h.includes('title') || h.includes('position') || h.includes('job')) return 'role'
  if (h.includes('country') || h.includes('location') || h.includes('region')) return 'country'
  if (h.includes('source') || h.includes('lead source')) return 'source'
  if (h.includes('status')) return 'status'
  if (h.includes('interest')) return 'interest_level'
  if (h.includes('segment') || h.includes('category')) return 'segment'
  if (h.includes('owner') || h.includes('assigned')) return 'owner'
  if (h.includes('note')) return 'notes'
  if (h.includes('follow') || h.includes('followup') || h.includes('next')) return 'next_followup'
  if (h.includes('linkedin')) return 'linkedin_url'
  return ''
}

export default function Import() {
  useEffect(() => {
    document.title = 'Import — EchoByld CRM'
    return () => { document.title = 'EchoByld CRM' }
  }, [])

  const fileRef = useRef(null)
  const { mutate: createContact } = useCreateContact()

  const [step, setStep]         = useState(1)
  const [rows, setRows]         = useState([])
  const [headers, setHeaders]   = useState([])
  const [mapping, setMapping]   = useState({})
  const [results, setResults]   = useState({ ok: 0, skipped: 0, errors: [] })
  const [dragging, setDragging] = useState(false)
  const [importing, setImporting] = useState(false)

  const parseFile = (file) => {
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data, meta }) => {
        if (!data.length) { toast.error('File appears to be empty'); return }
        const hdrs = meta.fields || []
        setHeaders(hdrs)
        setRows(data)
        const initial = {}
        hdrs.forEach(h => { initial[h] = autoMap(h) })
        setMapping(initial)
        setStep(2)
      },
      error: () => toast.error('Could not parse file — make sure it is a CSV'),
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    parseFile(e.dataTransfer.files[0])
  }

  const handleFileInput = (e) => parseFile(e.target.files[0])

  const handleImport = () => {
    setImporting(true)
    let ok = 0
    let skipped = 0
    const errors = []

    const mapped = rows.map((row, i) => {
      const contact = { owner: 'Ciaran', status: 'New lead' }
      Object.entries(mapping).forEach(([csvCol, crmField]) => {
        if (crmField && row[csvCol] !== undefined) {
          contact[crmField] = String(row[csvCol]).trim()
        }
      })
      return { contact, rowIndex: i + 2 }
    })

    mapped.forEach(({ contact, rowIndex }) => {
      if (!contact.full_name) {
        skipped++
        return
      }
      try {
        createContact(contact)
        ok++
      } catch {
        errors.push(`Row ${rowIndex}: failed to import "${contact.full_name}"`)
      }
    })

    setResults({ ok, skipped, errors })
    setStep(3)
    setImporting(false)
  }

  const reset = () => {
    setStep(1)
    setRows([])
    setHeaders([])
    setMapping({})
    setResults({ ok: 0, skipped: 0, errors: [] })
    if (fileRef.current) fileRef.current.value = ''
  }

  const mappedCount = Object.values(mapping).filter(Boolean).length
  const hasNameColumn = Object.values(mapping).includes('full_name')

  return (
    <div style={{ padding: '24px 24px', maxWidth: 720 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0D1F12', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
          Import contacts
        </h1>
        <div style={{ fontSize: 13, color: '#4A6352', marginTop: 2, fontFamily: 'Poppins, sans-serif' }}>
          Upload a CSV file to bulk-add contacts to your CRM.
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
        {[['1', 'Upload'], ['2', 'Map columns'], ['3', 'Done']].map(([num, label], idx) => (
          <div key={num} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: step > idx + 1 ? '#33533D' : step === idx + 1 ? '#33533D' : '#D4E0D8',
              color: step >= idx + 1 ? '#fff' : '#4A6352',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, fontFamily: 'Poppins, sans-serif',
              flexShrink: 0,
            }}>
              {step > idx + 1 ? <Check size={13} /> : num}
            </div>
            <span style={{
              fontSize: 12, fontWeight: step === idx + 1 ? 700 : 400,
              color: step === idx + 1 ? '#0D1F12' : '#4A6352',
              fontFamily: 'Poppins, sans-serif',
            }}>
              {label}
            </span>
            {idx < 2 && <ChevronRight size={14} color="#D4E0D8" />}
          </div>
        ))}
      </div>

      {/* STEP 1: Upload */}
      {step === 1 && (
        <div>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? '#33533D' : '#D4E0D8'}`,
              borderRadius: 12,
              padding: '52px 40px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragging ? '#F0F7F2' : '#F4F7F5',
              transition: 'all 0.15s',
            }}
          >
            <Upload size={32} color={dragging ? '#33533D' : '#4A6352'} style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0D1F12', fontFamily: 'Poppins, sans-serif', marginBottom: 6 }}>
              Drop your CSV here, or click to browse
            </div>
            <div style={{ fontSize: 12, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>
              First row must be column headers. UTF-8 encoding recommended.
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
          <div style={{ marginTop: 16, padding: '12px 14px', background: '#F4F7F5', borderRadius: 8, border: '1px solid #D4E0D8' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#4A6352', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Poppins, sans-serif', marginBottom: 6 }}>
              Expected columns (any order)
            </div>
            <div style={{ fontSize: 12, color: '#4A6352', fontFamily: 'Poppins, sans-serif', lineHeight: 1.7 }}>
              Full name, Email, Phone, Company, Role, Country, Source, Status, Notes, Next follow-up, LinkedIn URL
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Map columns */}
      {step === 2 && (
        <div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: '#4A6352', fontFamily: 'Poppins, sans-serif', marginBottom: 12 }}>
              {rows.length} rows detected. Map each CSV column to a CRM field, then click Import.
              Columns mapped to "Skip" will be ignored.
            </div>

            {/* Preview */}
            <div style={{
              overflowX: 'auto', marginBottom: 16,
              border: '1px solid #D4E0D8', borderRadius: 8, background: '#fff',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: 'Poppins, sans-serif' }}>
                <thead>
                  <tr style={{ background: '#F4F7F5', borderBottom: '1px solid #D4E0D8' }}>
                    {headers.map(h => (
                      <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: '#4A6352', fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 3).map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #D4E0D8' }}>
                      {headers.map(h => (
                        <td key={h} style={{ padding: '6px 10px', color: '#0D1F12', whiteSpace: 'nowrap', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {row[h] || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mapping selects */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {headers.map(h => (
                <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 180, fontSize: 12, fontWeight: 600, color: '#0D1F12',
                    fontFamily: 'Poppins, sans-serif', flexShrink: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </div>
                  <div style={{ fontSize: 12, color: '#D4E0D8', flexShrink: 0 }}>→</div>
                  <select
                    value={mapping[h] || ''}
                    onChange={e => setMapping(m => ({ ...m, [h]: e.target.value }))}
                    style={{
                      flex: 1, border: '1px solid #D4E0D8', borderRadius: 7,
                      padding: '7px 10px', fontSize: 12, fontFamily: 'Poppins, sans-serif',
                      color: '#0D1F12', outline: 'none', background: '#fff', cursor: 'pointer',
                    }}
                  >
                    {CRM_FIELDS.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {!hasNameColumn && (
            <div style={{
              display: 'flex', gap: 8, alignItems: 'center',
              background: '#FFEBEE', border: '1px solid #EF9A9A',
              borderRadius: 8, padding: '10px 14px', marginBottom: 14,
            }}>
              <AlertCircle size={14} color="#A32D2D" />
              <span style={{ fontSize: 12, color: '#A32D2D', fontFamily: 'Poppins, sans-serif' }}>
                Map at least one column to "Full name" to import contacts.
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Button onClick={handleImport} disabled={!hasNameColumn || importing}>
              {importing ? 'Importing…' : `Import ${rows.length} contacts`}
            </Button>
            <Button variant="ghost" onClick={reset}>Back</Button>
          </div>
          <div style={{ fontSize: 11, color: '#4A6352', fontFamily: 'Poppins, sans-serif', marginTop: 8 }}>
            {mappedCount} of {headers.length} columns mapped
          </div>
        </div>
      )}

      {/* STEP 3: Results */}
      {step === 3 && (
        <div>
          <div style={{
            background: results.ok > 0 ? '#F0F7F2' : '#FFF3F3',
            border: `1px solid ${results.ok > 0 ? '#ADCCB7' : '#EF9A9A'}`,
            borderRadius: 10, padding: '20px 24px', marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: results.ok > 0 ? '#33533D' : '#A32D2D',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Check size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0D1F12', fontFamily: 'Poppins, sans-serif' }}>
                  Import complete
                </div>
                <div style={{ fontSize: 13, color: '#4A6352', fontFamily: 'Poppins, sans-serif' }}>
                  {results.ok} imported · {results.skipped} skipped (no name)
                </div>
              </div>
            </div>
          </div>

          {results.errors.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#A32D2D', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Poppins, sans-serif', marginBottom: 8 }}>
                Errors ({results.errors.length})
              </div>
              {results.errors.map((e, i) => (
                <div key={i} style={{ fontSize: 12, color: '#A32D2D', fontFamily: 'Poppins, sans-serif', padding: '3px 0' }}>
                  {e}
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => window.location.href = '/contacts'}>View contacts</Button>
            <Button variant="ghost" onClick={reset}>Import another file</Button>
          </div>
        </div>
      )}
    </div>
  )
}
