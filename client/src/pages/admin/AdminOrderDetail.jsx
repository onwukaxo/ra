import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api/api'
import AdminLayout from '../../components/admin/AdminLayout'

export default function AdminOrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get(`/admin/orders/${id}`)
      .then(res => setOrder(res.data.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const updateOrder = async (payload) => {
    await api.patch(`/admin/orders/${id}`, payload)
    load()
  }

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold">Order detail</h1>
      {loading && <p className="text-slate-500 text-sm">Loading...</p>}
      {order && (
        <div className="space-y-3 mt-2 text-sm">
          <div className="bg-white border border-slate-100 rounded-xl p-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">Order #{order._id.slice(-6)}</div>
                <div className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="text-xs border rounded px-2 py-1"
                  value={order.status}
                  onChange={(e)=>updateOrder({ status: e.target.value })}
                >
                  {['PENDING','PREPARING','READY','COMPLETED','CANCELLED'].map(s=> (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {order.paymentStatus !== 'paid' && (
                  <button onClick={()=>updateOrder({ paymentStatus: 'paid' })} className="text-xs px-3 py-1 rounded-full border">Mark paid</button>
                )}
              </div>
            </div>
            <div className="mt-2">Customer: {order.user?.name} • {order.user?.phone}</div>
            <div>Type: {order.orderType}</div>
            <div>Payment: {order.paymentStatus}</div>
            <div>Total: ₦{Number(order.totalAmount||0).toLocaleString()}</div>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-3">
            <div className="font-semibold mb-2">Items</div>
            <ul className="text-xs list-disc list-inside">
              {order.items.map(i => (
                <li key={i._id}>
                  {i.quantity} x {i.menuItem?.name || 'Item'} – ₦{Number(i.priceAtOrderTime||0).toLocaleString()}
                  {i.sauce && <> • Sauce: {i.sauce}</>}
                </li>
              ))}
            </ul>
          </div>

          {order.orderType === 'delivery' && (
            <div className="bg-white border border-slate-100 rounded-xl p-3">
              <div className="font-semibold mb-2">Delivery info</div>
              <div>Name: {order.deliveryInfo?.name}</div>
              <div>Phone: {order.deliveryInfo?.phone}</div>
              <div>Address: {order.deliveryInfo?.addressLine}</div>
              <div>Area: {order.deliveryInfo?.area}</div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}