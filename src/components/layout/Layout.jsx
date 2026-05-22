import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import ToastContainer from '../ui/Toast'
import QuickLogFAB from '../features/QuickLogFAB'

export default function Layout() {
  return (
    <>
      <NavBar />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 0 80px' }}>
        <Outlet />
      </main>
      <QuickLogFAB />
      <ToastContainer />
    </>
  )
}
