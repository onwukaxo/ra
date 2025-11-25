import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMenu from './pages/admin/AdminMenu'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCommunity from './pages/admin/AdminCommunity'
import AdminUsers from './pages/admin/AdminUsers'
import AdminSettings from './pages/admin/AdminSettings'
import AdminOrderDetail from './pages/admin/AdminOrderDetail'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/dashboard/Dashboard'
import ManagerDashboard from './pages/dashboard/ManagerDashboard'
import CashierDashboard from './pages/dashboard/CashierDashboard'
import KitchenDashboard from './pages/dashboard/KitchenDashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import PlatformSignup from './pages/auth/PlatformSignup'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup/owner" element={<PlatformSignup />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route path="/dashboard" element={
        <AdminLayout>
          <ProtectedRoute allowed={["owner","admin","manager","cashier","kitchen","staff","user"]}>
            <Dashboard />
          </ProtectedRoute>
        </AdminLayout>
      } />
      <Route path="/dashboard/admin" element={
        <AdminLayout>
          <ProtectedRoute allowed={["owner","admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        </AdminLayout>
      } />
      <Route path="/dashboard/manager" element={
        <AdminLayout>
          <ProtectedRoute allowed={["owner","admin","manager"]}>
            <ManagerDashboard />
          </ProtectedRoute>
        </AdminLayout>
      } />
      <Route path="/dashboard/cashier" element={
        <AdminLayout>
          <ProtectedRoute allowed={["owner","admin","manager","cashier"]}>
            <CashierDashboard />
          </ProtectedRoute>
        </AdminLayout>
      } />
      <Route path="/dashboard/kitchen" element={
        <AdminLayout>
          <ProtectedRoute allowed={["owner","admin","manager","kitchen"]}>
            <KitchenDashboard />
          </ProtectedRoute>
        </AdminLayout>
      } />

      <Route path="/admin" element={
        <AdminLayout>
          <ProtectedRoute allowed={["owner","admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        </AdminLayout>
      } />
      <Route path="/admin/menu" element={
        <AdminLayout>
          <ProtectedRoute allowed={["owner","admin","manager"]}>
            <AdminMenu />
          </ProtectedRoute>
        </AdminLayout>
      } />
      <Route path="/admin/orders" element={
        <AdminLayout>
          <ProtectedRoute allowed={["owner","admin","manager","cashier"]}>
            <AdminOrders />
          </ProtectedRoute>
        </AdminLayout>
      } />
      <Route path="/admin/community" element={
        <AdminLayout>
          <ProtectedRoute allowed={["owner","admin","manager"]}>
            <AdminCommunity />
          </ProtectedRoute>
        </AdminLayout>
      } />
      <Route path="/admin/users" element={
        <AdminLayout>
          <ProtectedRoute allowed={["owner","admin","manager"]}>
            <AdminUsers />
          </ProtectedRoute>
        </AdminLayout>
      } />
      <Route path="/admin/settings" element={
        <AdminLayout>
          <ProtectedRoute allowed={["owner"]}>
            <AdminSettings />
          </ProtectedRoute>
        </AdminLayout>
      } />
      <Route path="/admin/orders/:id" element={
        <AdminLayout>
          <ProtectedRoute allowed={["owner","admin","manager","cashier"]}>
            <AdminOrderDetail />
          </ProtectedRoute>
        </AdminLayout>
      } />

      <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
    </Routes>
  )
}

export default App
