import { useEffect, useState } from 'react'
import api from '../../api/api'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ status: 'all', paymentStatus: 'all', orderType: 'all', search: '', from: '', to: '' })

  const load = () => {
    setLoading(true)
    const params: any = {}
    if (filter.status !== 'all') params.status = filter.status
    if (filter.paymentStatus !== 'all') params.paymentStatus = filter.paymentStatus
    if (filter.orderType !== 'all') params.orderType = filter.orderType
    if (filter.from) params.from = filter.from
    if (filter.to) params.to = filter.to
    api.get('/admin/orders', { params })
      .then(res => setOrders(res.data.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const updateOrder = async (id: string, payload: any) => {
    await api.patch(`/admin/orders/${id}`, payload)
    load()
  }

  return (
    <>
      <h1 className="text-xl font-semibold">Manage orders</h1>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <select value={filter.status} onChange={(e)=>setFilter(f=>({...f, status: e.target.value}))} className="border rounded px-2 py-1">
          <option value="all">All status</option>
          {['PENDING','PREPARING','READY','COMPLETED','CANCELLED'].map(s=> (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={filter.paymentStatus} onChange={(e)=>setFilter(f=>({...f, paymentStatus: e.target.value}))} className="border rounded px-2 py-1">
          <option value="all">All payments</option>
          {['pending','paid'].map(s=> (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={filter.orderType} onChange={(e)=>setFilter(f=>({...f, orderType: e.target.value}))} className="border rounded px-2 py-1">
          <option value="all">All types</option>
          {['pickup','delivery'].map(s=> (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          placeholder="Search name / phone / #id"
          value={filter.search}
          onChange={(e)=>setFilter(f=>({...f, search: e.target.value}))}
          className="border rounded px-2 py-1"
        />
        <input
          type="date"
          value={filter.from}
          onChange={(e)=>setFilter(f=>({...f, from: e.target.value}))}
          className="border rounded px-2 py-1"
        />
        <input
          type="date"
          value={filter.to}
          onChange={(e)=>setFilter(f=>({...f, to: e.target.value}))}
          className="border rounded px-2 py-1"
        />
      </div>

      <div className="space-y-3 mt-3">
        {loading && <p className="text-slate-500">Loading...</p>}
        {orders
          .filter(o => {
            const q = filter.search.trim().toLowerCase()
            if (!q) return true
            const idMatch = o._id?.toLowerCase().includes(q)
            const nameMatch = (o.user?.name||'').toLowerCase().includes(q)
            const phoneMatch = (o.user?.phone||o.customer?.phone||'').toLowerCase().includes(q)
            return idMatch || nameMatch || phoneMatch
          })
          .map(order => (
          <div key={order._id} className="bg-white border border-slate-100 rounded-xl p-3 text-sm">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">Order #{order._id.slice(-6)}</div>
                <div className="text-xs text-slate-500">
                  {order.user?.name} • {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className={`text-xs rounded-lg px-2 py-1 border ${
                    order.status === 'PENDING' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                    order.status === 'PREPARING' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                    order.status === 'READY' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                    order.status === 'COMPLETED' ? 'bg-green-50 border-green-200 text-green-700' :
                    order.status === 'CANCELLED' ? 'bg-red-50 border-red-200 text-red-700' : 'border-slate-300'
                  }`}
                  value={order.status}
                  onChange={(e) => updateOrder(order._id, { status: e.target.value })}
                >
                  {['PENDING','PREPARING','READY','COMPLETED','CANCELLED'].map(s=> (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {order.paymentStatus !== 'paid' && (
                  <button onClick={()=>updateOrder(order._id, { paymentStatus: 'paid' })} className="text-xs px-3 py-1 rounded-full border">Mark paid</button>
                )}
              </div>
            </div>
            <ul className="mt-2 text-xs text-slate-700 list-disc list-inside">
              {order.items.map(i => (
                <li key={i._id}>
                  {i.quantity} x {i.menuItem?.name || 'Item'} – ₦{i.priceAtOrderTime}
                  {i.sauce && <> • Sauce: {i.sauce}</>}
                </li>
              ))}
            </ul>
            <div className="mt-1 text-right text-xs font-semibold">
              Total: ₦{order.totalAmount}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
