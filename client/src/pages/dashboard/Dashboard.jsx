import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import api from '../../api/api'
import ProfileTab from './ProfileTab'
import OrdersTab from './OrdersTab'
import SupportTab from './SupportTab'
import SecurityTab from './SecurityTab'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [active, setActive] = useState('profile')
  const [me, setMe] = useState(user || null)
  const [orders, setOrders] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login', { replace: true })
      } else if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true })
      }
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

  useEffect(() => {
    const p = location.pathname || '/dashboard'
    if (p.endsWith('/orders')) setActive('orders')
    else if (p.endsWith('/security')) setActive('security')
    else setActive('profile')
  }, [location.pathname])

  if (loading) return <p className="text-sm text-slate-600">Loading dashboard...</p>
  if (!user) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Mobile card navigation */}
      <div className="md:hidden space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <Link to="/dashboard/profile" className="block rounded-xl border border-slate-200 bg-white p-4">
            <div className="font-semibold">Manage Profile</div>
            <div className="text-sm text-slate-600">Update your details</div>
          </Link>
          <Link to="/dashboard/orders" className="block rounded-xl border border-slate-200 bg-white p-4">
            <div className="font-semibold">My Orders</div>
            <div className="text-sm text-slate-600">View your order history</div>
          </Link>
          <Link to="/dashboard/security" className="block rounded-xl border border-slate-200 bg-white p-4">
            <div className="font-semibold">Security</div>
            <div className="text-sm text-slate-600">Change your password</div>
          </Link>
        </div>
      </div>
      <aside className="hidden md:block md:col-span-1">
        <div className="bg-white border border-slate-100 rounded-xl p-3 space-y-2">
          <button className={`w-full text-left px-3 py-2 rounded ${active==='profile'?'bg-slate-100':''}`} onClick={()=>navigate('/dashboard/profile')}>Profile</button>
          <button className={`w-full text-left px-3 py-2 rounded ${active==='orders'?'bg-slate-100':''}`} onClick={()=>navigate('/dashboard/orders')}>Orders</button>
          <button className={`w-full text-left px-3 py-2 rounded ${active==='security'?'bg-slate-100':''}`} onClick={()=>navigate('/dashboard/security')}>Security</button>
          <button className={`w-full text-left px-3 py-2 rounded ${active==='support'?'bg-slate-100':''}`} onClick={()=>setActive('support')}>Support</button>
        </div>
      </aside>
      <section className="md:col-span-3">
        {active === 'profile' && <ProfileTab me={me} onUpdated={refresh} />}
        {active === 'orders' && <OrdersTab orders={orders} />}
        {active === 'security' && <SecurityTab />}
        {active === 'support' && <SupportTab />}
      </section>
    </div>
  )
}