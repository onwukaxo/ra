import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import { hasRole } from '../auth/roles'

export default function ProtectedRoute({ children, allowed }: any) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="text-center py-10 text-sm text-slate-500">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (Array.isArray(allowed) && allowed.length > 0) {
    if (!hasRole(user, allowed)) {
      return <Navigate to="/dashboard" state={{ from: location }} replace />
    }
  }

  return children as any
}
