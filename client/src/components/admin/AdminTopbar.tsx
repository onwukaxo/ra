import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminTopbar({ onToggleSidebar }: any) {
  const { user, logout } = useAuth()
  return (
    <header className="h-12 border-b bg-white flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <button className="md:hidden px-2 py-1 rounded border" onClick={onToggleSidebar}>Menu</button>
        <div className="text-sm text-slate-600">Welcome, {user?.name || 'Admin'}</div>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/" className="text-sm underline">Go to site</Link>
        <button onClick={logout} className="text-xs px-3 py-1 rounded-full border">Logout</button>
      </div>
    </header>
  )
}