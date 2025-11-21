import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
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
import { useEffect } from 'react'
import { SITE } from './config/site'

function App() {
  useEffect(() => {
    api.get('/public/settings')
      .then(res => {
        const s = res.data?.data || {}
        if (s.contacts) SITE.contacts = { ...SITE.contacts, ...s.contacts }
        if (s.bank) SITE.bank = { ...SITE.bank, ...s.bank }
        if (Array.isArray(s.socials)) {
          const map = new Map(s.socials.map((x) => [x.name, x.url]))
          SITE.socials = (SITE.socials || []).map((entry) => ({
            ...entry,
            url: map.get(entry.name) ?? entry.url,
          }))
        }
      })
      .catch(() => {})
  }, [])
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
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