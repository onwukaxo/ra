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
            {/* Desktop table */}
            <div className="hidden md:block bg-white border border-slate-100 rounded-xl overflow-hidden">
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
            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {stats.latestOrders.map(o => (
                <div key={o._id} className="bg-white border border-slate-100 rounded-xl p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{o.user?.name || '—'}</div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full border ${
                        String(o.paymentStatus||'pending').toLowerCase()==='paid' ? 'bg-green-50 text-green-700 border-green-200' :
                        String(o.paymentStatus||'pending').toLowerCase()==='failed' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}
                    >
                      {(o.paymentStatus||'pending').toUpperCase()}
                    </div>
                  </div>
                  <div className="mt-1 text-slate-700">
                    <div>Type: {String(o.orderType||'').toUpperCase()}</div>
                    <div>Total: ₦{Number(o.totalAmount||0).toLocaleString()}</div>
                    <div className="text-slate-600">{new Date(o.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="mt-2">
                    <a href={`/admin/orders/${o._id}`} className="text-xs underline">View order</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
