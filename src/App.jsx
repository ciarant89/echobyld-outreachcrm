import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import ContactDetail from './pages/ContactDetail'
import Pipeline from './pages/Pipeline'
import Meetings from './pages/Meetings'
import Investors from './pages/Investors'
import InvestorDetail from './pages/InvestorDetail'
import Import from './pages/Import'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/"                element={<Dashboard />}      />
            <Route path="/contacts"        element={<Contacts />}       />
            <Route path="/contacts/:id"    element={<ContactDetail />}  />
            <Route path="/pipeline"        element={<Pipeline />}       />
            <Route path="/meetings"        element={<Meetings />}       />
            <Route path="/investors"       element={<Investors />}      />
            <Route path="/investors/:id"   element={<InvestorDetail />} />
            <Route path="/import"          element={<Import />}         />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
