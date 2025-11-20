import { useEffect, useState } from 'react'
import api from '../../api/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/overview')
      .then(res => setStats(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-sm text-slate-500">Loading...</p>

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Admin dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="bg-white border border-slate-100 rounded-xl p-3">
          <div className="text-xs text-slate-500">Users</div>
          <div className="text-lg font-semibold">{stats.usersCount}</div>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-3">
          <div className="text-xs text-slate-500">Orders</div>
          <div className="text-lg font-semibold">{stats.ordersCount}</div>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-3">
          <div className="text-xs text-slate-500">Menu items</div>
          <div className="text-lg font-semibold">{stats.menuCount}</div>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-3">
          <div className="text-xs text-slate-500">Community posts</div>
          <div className="text-lg font-semibold">{stats.postsCount}</div>
        </div>
      </div>
    </div>
  )
}