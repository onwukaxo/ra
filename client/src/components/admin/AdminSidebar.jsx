import { NavLink } from 'react-router-dom'

export default function AdminSidebar({ onLinkClick }) {
  const link = (to, label) => (
    <NavLink
      to={to}
      onClick={onLinkClick}
      className={({ isActive }) =>
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
          {link('/admin/menu', 'Menu')}
          {link('/admin/orders', 'Orders')}
          {link('/admin/users', 'Users')}
          {link('/admin/community', 'Community')}
          {link('/admin/settings', 'Settings')}
        </nav>
      </div>
    </aside>
  )
}