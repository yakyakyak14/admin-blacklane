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
import Cars from './pages/Cars'
import Users from './pages/Users'
import RequireAdmin from './auth/RequireAdmin'
import RealtimeProvider from './realtime/RealtimeProvider'

export default function App() {
  return (
    <RealtimeProvider>
      <div className="min-h-screen w-full flex bg-neutral-50">
        <aside className="hidden md:flex w-64 border-r bg-white">
          <Sidebar />
        </aside>
        <div className="flex-1 min-w-0">
          <AdminNavbar />
          <div className="p-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
              <Route path="/drivers" element={<RequireAdmin><Drivers /></RequireAdmin>} />
              <Route path="/cars" element={<RequireAdmin><Cars /></RequireAdmin>} />
              <Route path="/users" element={<RequireAdmin><Users /></RequireAdmin>} />
              <Route path="/trips" element={<RequireAdmin><Trips /></RequireAdmin>} />
              <Route path="/payouts" element={<RequireAdmin><Payouts /></RequireAdmin>} />
              <Route path="/support" element={<RequireAdmin><Support /></RequireAdmin>} />
              <Route path="/settings" element={<RequireAdmin><Settings /></RequireAdmin>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </RealtimeProvider>
  )
}
