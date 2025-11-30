import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function RequireAdmin({ children }: { children: JSX.Element }) {
  const { loading, user, isAdmin } = useAuth()
  const location = useLocation()
  if (loading) return <div className="p-6">Loading...</div>
  if (!user || !isAdmin) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}
