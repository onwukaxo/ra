import { useEffect, useState } from 'react'
import api from '../../api/api'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get('/orders/all')
      .then(res => setOrders(res.data.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status })
    load()
  }

  return (
    <div className="space-y-4 text-sm">
      <h1 className="text-xl font-semibold">Manage orders</h1>
      {loading && <p className="text-slate-500">Loading...</p>}
      <div className="space-y-3">
        {orders.map(order => (
          <div key={order._id} className="bg-white border border-slate-100 rounded-xl p-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">Order #{order._id.slice(-6)}</div>
                <div className="text-xs text-slate-500">
                  {order.user?.name} • {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
              <select
                className="text-xs border border-slate-300 rounded-lg px-2 py-1"
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
              >
                <option value="PENDING">PENDING</option>
                <option value="PREPARING">PREPARING</option>
                <option value="READY">READY</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
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
    </div>
  )
}