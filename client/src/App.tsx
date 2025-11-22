import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import Dashboard from './pages/dashboard/Dashboard'
import Contact from './pages/Contact'
import Orders from './pages/Orders'
import Community from './pages/Community'
import CommunityPostPage from './pages/CommunityPostPage'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMenu from './pages/admin/AdminMenu'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCommunity from './pages/admin/AdminCommunity'
import AdminUsers from './pages/admin/AdminUsers'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Payment from './pages/Payment'
import AdminSettings from './pages/admin/AdminSettings'
import AdminOrderDetail from './pages/admin/AdminOrderDetail'
import api from './api/api'
import { useEffect, useState } from 'react'
import { SITE } from './config/site'

function App() {
  const [visitorAlertPost, setVisitorAlertPost] = useState(null)
  const [hideVisitorAlert, setHideVisitorAlert] = useState(false)
  useEffect(() => {
    api.get('/public/settings')
      .then(res => {
        const s = res.data?.data || {}
        if (s.contacts) SITE.contacts = { ...SITE.contacts, ...s.contacts }
        if (s.bank) SITE.bank = { ...SITE.bank, ...s.bank }
        if (Array.isArray(s.socials)) {
          const map = new Map(s.socials.map((x: any) => [x.name, x.url]))
          SITE.socials = (SITE.socials || []).map((entry) => ({
            ...entry,
            url: String(map.get(entry.name) ?? entry.url),
          }))
        }
        SITE.promoMessage = s.promoMessage || SITE.promoMessage
        SITE.promoStart = s.promoStart || SITE.promoStart
        SITE.promoEnd = s.promoEnd || SITE.promoEnd
        SITE.eventMessage = s.eventMessage || SITE.eventMessage
        SITE.eventDate = s.eventDate || SITE.eventDate
        SITE.eventStart = s.eventStart || SITE.eventStart
        SITE.eventEnd = s.eventEnd || SITE.eventEnd
        try {
          const once = sessionStorage.getItem('hideVisitorAlert') === '1'
          setHideVisitorAlert(once)
        } catch {}
        if (!hideVisitorAlert) {
          api.get('/community')
            .then(r => {
              const list = Array.isArray(r.data?.data) ? r.data.data : []
              const nowTs = Date.now()
              const isTagMatch = (t) => {
                const x = String(t || '').toLowerCase()
                return x === 'promo' || x === 'promos' || x === 'event' || x === 'events' || x === 'announcement' || x === 'anouncement'
              }
              const inWindow = (p) => {
                const start = p.alertStart ? new Date(p.alertStart).getTime() : null
                const end = p.alertEnd ? new Date(p.alertEnd).getTime() : null
                if (start && end) return nowTs >= start && nowTs <= end
                if (start && !end) return nowTs >= start
                if (!start && end) return nowTs <= end
                return true
              }
              const candidate = list.find(p => Boolean(p.alertEnabled) && isTagMatch(p.tag) && inWindow(p))
              if (candidate) setVisitorAlertPost(candidate)
            })
            .catch(() => {})
        }
      })
      .catch(() => {})
  }, [])
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {visitorAlertPost && !hideVisitorAlert && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-4">
              <div className="text-xs uppercase tracking-wide text-[#0C1E22]/70">{visitorAlertPost.tag}</div>
              <div className="text-lg font-bold text-[#0C1E22] mt-1">{visitorAlertPost.title}</div>
              <div className="text-sm text-slate-700 mt-2">{visitorAlertPost.content}</div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <a href={`/community/${visitorAlertPost._id}`} className="px-4 py-2 rounded-full bg-[#0C1E22] text-white text-sm">View</a>
                <button className="px-4 py-2 rounded-full border text-sm" onClick={() => { setHideVisitorAlert(true); try { sessionStorage.setItem('hideVisitorAlert', '1') } catch {} }}>Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/profile" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/orders" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/security" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/payment" element={<Payment />} />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/community" element={<Community />} />
          <Route path="/community/:id" element={<CommunityPostPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/menu" element={
            <AdminRoute>
              <AdminMenu />
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          } />
          <Route path="/admin/community" element={
            <AdminRoute>
              <AdminCommunity />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
          <Route path="/admin/settings" element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          } />
          <Route path="/admin/orders/:id" element={
            <AdminRoute>
              <AdminOrderDetail />
            </AdminRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App