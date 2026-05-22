import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ title, onClose, children, width = 540 }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#fff',
        borderRadius: 12,
        width: '100%',
        maxWidth: width,
        maxHeight: '92vh',
        overflow: 'auto',
        boxShadow: '0 24px 64px rgba(13,31,18,0.22)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #D4E0D8',
          position: 'sticky',
          top: 0,
          background: '#fff',
          zIndex: 1,
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#0D1F12', fontFamily: 'Poppins, sans-serif' }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A6352', padding: 4, display: 'flex' }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  )
}
