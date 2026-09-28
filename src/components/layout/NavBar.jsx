import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import EchoByldLogo from '../ui/EchoByldLogo'

const NAV_LINKS = [
  { to: '/',          label: 'Dashboard', icon: '⊞' },
  { to: '/contacts',  label: 'Contacts',  icon: '👤' },
  { to: '/pipeline',  label: 'Pipeline',  icon: '◈'  },
  { to: '/meetings',  label: 'Meetings',  icon: '📅' },
  { to: '/investors', label: 'Investors', icon: '💼' },
]

export default function NavBar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    if (!window.confirm('Sign out?')) return
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {/* Desktop top nav */}
      <nav style={{
        background: '#000',
        height: 52,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid #1a2b1f',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 40 }}>
          <EchoByldLogo />
        </div>

        <div style={{ display: 'flex', gap: 2, flex: 1 }}>
          {NAV_LINKS.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              style={({ isActive }) => ({
                color: isActive ? '#fff' : '#ADCCB7',
                fontWeight: isActive ? 700 : 500,
                fontSize: 13,
                padding: '0 14px',
                height: 52,
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid #60866C' : '2px solid transparent',
                fontFamily: 'Poppins, sans-serif',
                transition: 'color 0.15s',
              })}
            >
              {n.label}
            </NavLink>
          ))}
        </div>

        <button
          onClick={handleSignOut}
          title="Sign out"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#33533D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: '#fff',
            fontFamily: 'Poppins, sans-serif',
            border: '1.5px solid #60866C',
            cursor: 'pointer',
          }}
        >
          C
        </button>
      </nav>

      {/* Mobile bottom nav */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderTop: '1px solid #D4E0D8',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)',
        display: 'none',
      }} className="mobile-bottom-nav">
        {NAV_LINKS.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === '/'}
            style={({ isActive }) => ({
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '8px 0',
              textDecoration: 'none',
              color: isActive ? '#33533D' : '#4A6352',
              fontWeight: isActive ? 700 : 500,
              fontSize: 10,
              fontFamily: 'Poppins, sans-serif',
            })}
          >
            <span style={{ fontSize: 18 }}>{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .mobile-bottom-nav { display: flex !important; }
          nav { display: none !important; }
        }
      `}</style>
    </>
  )
}
