import { useEffect, useState } from 'react'
import api from '../../api/api'

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data.data || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Kitchen dashboard</h1>
      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="bg-white border rounded-xl p-3 text-sm">
            <div className="font-medium">Order #{o._id.slice(-6)}</div>
            <div className="text-slate-600">{o.items?.map((i:any)=>i.menuItem?.name).join(', ')}</div>
            <div className="text-slate-600">Status: {o.status}</div>
          </div>
        ))}
        {!loading && orders.length===0 && (
          <div className="text-sm text-slate-500">No active orders</div>
        )}
      </div>
    </div>
  )
}