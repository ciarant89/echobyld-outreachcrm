import { useState, useEffect } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

let toastFn = null

export const toast = {
  success: (msg) => toastFn?.('success', msg),
  error:   (msg) => toastFn?.('error', msg),
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    toastFn = (type, msg) => {
      const id = Date.now()
      setToasts(p => [...p, { id, type, msg }])
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
    }
    return () => { toastFn = null }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      bottom: 80,
      right: 20,
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'success' ? '#33533D' : '#7F0000',
          color: '#fff',
          borderRadius: 8,
          padding: '10px 16px',
          fontSize: 13,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          fontFamily: 'Poppins, sans-serif',
          animation: 'slideIn 0.2s ease',
        }}>
          {t.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {t.msg}
        </div>
      ))}
    </div>
  )
}
