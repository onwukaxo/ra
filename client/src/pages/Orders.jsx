import { useEffect, useState } from 'react'
import api from '../api/api'
import OrderCard from '../components/OrderCard'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data.data))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">My orders</h1>
      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="text-sm text-slate-500">You have no orders yet.</p>
      )}
      <div className="space-y-3">
        {orders.map(order => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  )
}