import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Must be set before signIn so the session gets written to the right store.
    localStorage.setItem('echobyld_remember', remember ? 'true' : 'false')

    const { error } = await signIn(email, password)
    setLoading(false)

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Incorrect email or password.'
        : error.message)
      return
    }

    navigate(from, { replace: true })
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      fontFamily: 'Poppins, sans-serif',
      padding: 20,
    }}>
      <Card style={{ width: '100%', maxWidth: 380, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', background: '#33533D',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 18, margin: '0 auto 12px',
            border: '1.5px solid #60866C',
          }}>
            E
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#0D1F12', margin: 0 }}>
            EchoByld CRM
          </h1>
          <p style={{ fontSize: 13, color: '#4A6352', marginTop: 4 }}>
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            placeholder="you@echobyld.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            required
            placeholder="••••••••"
          />

          <label style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 13, color: '#4A6352', cursor: 'pointer', userSelect: 'none',
          }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              style={{ width: 15, height: 15, accentColor: '#33533D' }}
            />
            Stay logged in
          </label>

          {error && (
            <div style={{
              background: '#FFEBEE', border: '1px solid #EF9A9A', color: '#7F0000',
              fontSize: 12, padding: '8px 11px', borderRadius: 7,
            }}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            style={{ justifyContent: 'center', marginTop: 6 }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
