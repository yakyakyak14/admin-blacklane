import { Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { AdminNavbar } from './components/AdminNavbar'
import Dashboard from './pages/Dashboard'
import Drivers from './pages/Drivers'
import Trips from './pages/Trips'
import Payouts from './pages/Payouts'
import Support from './pages/Support'
import Settings from './pages/Settings'
import Login from './pages/Login'

export default function App() {
  return (
    <div className="min-h-screen w-full flex bg-neutral-50">
      <aside className="hidden md:flex w-64 border-r bg-white">
        <Sidebar />
      </aside>
      <div className="flex-1 min-w-0">
        <AdminNavbar />
        <div className="p-6">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/payouts" element={<Payouts />} />
            <Route path="/support" element={<Support />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
