import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { hasPermission, ROLE } from '../../auth/roles'

export default function AdminSidebar({ onLinkClick }: any) {
  const { user } = useAuth()
  const link = (to, label) => (
    <NavLink
      to={to}
      onClick={onLinkClick}
      className={({ isActive }: any) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive ? 'bg-slate-200 text-slate-900' : 'text-slate-700 hover:bg-slate-100'
        }`}
    >
      {label}
    </NavLink>
  )

  return (
    <aside className="w-64 shrink-0 border-r bg-white">
      <div className="p-4">
        <div className="text-lg font-bold mb-3">Admin</div>
        <nav className="space-y-1">
          {link('/admin', 'Overview')}
          {hasPermission(user, 'MANAGE_MENU') && link('/admin/menu', 'Menu')}
          {hasPermission(user, 'MANAGE_ORDERS') && link('/admin/orders', 'Orders')}
          {hasPermission(user, 'MANAGE_USERS') && link('/admin/users', 'Users')}
          {hasPermission(user, 'VIEW_REPORTS') && link('/admin/community', 'Community')}
          {hasPermission(user, 'TENANT_SETTINGS') && link('/admin/settings', 'Settings')}
        </nav>
      </div>
    </aside>
  )
}
