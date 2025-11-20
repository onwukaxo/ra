import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'
import ProfileTab from './ProfileTab'
import OrdersTab from './OrdersTab'
import AddressTab from './AddressTab'
import SupportTab from './SupportTab'
import PaymentTab from './PaymentTab'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('profile')
  const [me, setMe] = useState(user || null)
  const [orders, setOrders] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true })
    }
  }, [loading, user, navigate])

  const refresh = async () => {
    setRefreshing(true)
    try {
      const [meRes, ordersRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/orders/my')
      ])
      setMe(meRes.data?.data || null)
      setOrders(Array.isArray(ordersRes.data?.data) ? ordersRes.data.data : [])
    } catch {}
    setRefreshing(false)
  }

  useEffect(() => { if (!loading && user) { refresh() } }, [loading, user])

  if (loading) return <p className="text-sm text-slate-600">Loading dashboard...</p>
  if (!user) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <aside className="md:col-span-1">
        <div className="bg-white border border-slate-100 rounded-xl p-3 space-y-2">
          <button className={`w-full text-left px-3 py-2 rounded ${active==='profile'?'bg-slate-100':''}`} onClick={()=>setActive('profile')}>Profile</button>
          <button className={`w-full text-left px-3 py-2 rounded ${active==='orders'?'bg-slate-100':''}`} onClick={()=>setActive('orders')}>Orders</button>
          <button className={`w-full text-left px-3 py-2 rounded ${active==='address'?'bg-slate-100':''}`} onClick={()=>setActive('address')}>Address</button>
          <button className={`w-full text-left px-3 py-2 rounded ${active==='support'?'bg-slate-100':''}`} onClick={()=>setActive('support')}>Support</button>
          <button className={`w-full text-left px-3 py-2 rounded ${active==='payment'?'bg-slate-100':''}`} onClick={()=>setActive('payment')}>Payment</button>
          <button className="w-full text-left px-3 py-2 rounded border mt-2" onClick={refresh} disabled={refreshing}>{refreshing? 'Refreshing...' : 'Refresh'}</button>
        </div>
      </aside>
      <section className="md:col-span-3">
        {active === 'profile' && <ProfileTab me={me} onUpdated={refresh} />}
        {active === 'orders' && <OrdersTab orders={orders} />}
        {active === 'address' && <AddressTab me={me} onUpdated={refresh} />}
        {active === 'support' && <SupportTab />}
        {active === 'payment' && <PaymentTab orders={orders} />}
      </section>
    </div>
  )
}