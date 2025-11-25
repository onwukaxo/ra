import { useEffect, useState } from 'react'
import api from '../../api/api'
import { useAuth } from '../../context/AuthContext'

export default function ManagerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/overview')
      .then(res => setStats(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Manager dashboard</h1>
      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-white border rounded-xl p-3">
            <div className="text-xs uppercase text-slate-500">Orders today</div>
            <div className="text-lg font-semibold">{stats.todayOrdersCount}</div>
          </div>
          <div className="bg-white border rounded-xl p-3">
            <div className="text-xs uppercase text-slate-500">Active menu</div>
            <div className="text-lg font-semibold">{stats.activeMenuCount}</div>
          </div>
          <div className="bg-white border rounded-xl p-3">
            <div className="text-xs uppercase text-slate-500">Revenue</div>
            <div className="text-lg font-semibold">₦{Number(stats.totalRevenue||0).toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  )
}