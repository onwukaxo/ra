import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }: any) {
  // Read auth state and current location for redirects
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    // While auth is loading, render a lightweight placeholder
    return <div className="text-center py-10 text-sm text-slate-500">Loading...</div>
  }

  if (!user) {
    // Not authenticated: send to login, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN' && user.role !== 'owner') {
    // Authenticated but lacks required role: redirect home
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // Authorized: render nested route content
  return children as any
}
