import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
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
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
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
  )
}
