import { useEffect, useState } from 'react'
import api from '../../api/api'
import AdminLayout from '../../components/admin/AdminLayout'
import StatCard from '../../components/admin/StatCard'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/overview')
      .then(res => setStats(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold mb-4">Overview</h1>
      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <StatCard title="Users" value={stats.usersCount} />
            <StatCard title="Orders" value={stats.ordersCount} />
            <StatCard title="Active menu" value={stats.activeMenuCount} />
            <StatCard title="Posts" value={stats.postsCount} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-4">
            <StatCard title="Orders today" value={stats.todayOrdersCount} />
            <StatCard title="Revenue" value={`₦${Number(stats.totalRevenue||0).toLocaleString()}`} />
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Recent orders</h2>
            <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-3 py-2">Customer</th>
                    <th className="text-left px-3 py-2">Type</th>
                    <th className="text-left px-3 py-2">Total</th>
                    <th className="text-left px-3 py-2">Payment</th>
                    <th className="text-left px-3 py-2">Created</th>
                    <th className="text-left px-3 py-2">View</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.latestOrders.map(o => (
                    <tr key={o._id} className="border-t border-slate-100">
                      <td className="px-3 py-2">{o.user?.name || '—'}</td>
                      <td className="px-3 py-2">{o.orderType}</td>
                      <td className="px-3 py-2">₦{Number(o.totalAmount||0).toLocaleString()}</td>
                      <td className="px-3 py-2">{o.paymentStatus}</td>
                      <td className="px-3 py-2">{new Date(o.createdAt).toLocaleString()}</td>
                      <td className="px-3 py-2">
                        <a href={`/admin/orders/${o._id}`} className="underline">View</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}