import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'
import type { AuthUser, AuthResponse } from '../types'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (identifier: string, password: string) => Promise<AuthUser>
  register: (payload: Record<string, unknown>) => Promise<any>
  logout: () => void
  updateMe: (payload: Partial<AuthUser> & Record<string, unknown>) => Promise<AuthUser>
  sendOtp: (payload: { phone: string; password: string; name?: string; intent?: 'login' | 'register' }) => Promise<boolean>
  verifyOtp: (payload: { phone: string; otp: string; email?: string }) => Promise<AuthUser>
  completeOtpVerification: (data: AuthResponse) => void
  changePassword: (payload: { currentPassword: string; newPassword: string }) => Promise<boolean>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    api.get('/auth/me')
      .then(res => {
        setUser(res.data.data)
      })
      .catch(() => {
        localStorage.removeItem('token')
      })
      .finally(() => setLoading(false))
  }, [])

  const applyAuthResponse = (data: AuthResponse) => {
    if (!data?.token || !data?.user) return
    localStorage.setItem('token', data.token)
    setUser(data.user)
  }

  const login = async (identifier: string, password: string) => {
    const res = await api.post('/auth/login', { identifier, password })
    applyAuthResponse(res.data.data)
    return res.data.data.user
  }

  const register = async (payload: Record<string, unknown>) => {
    const res = await api.post('/auth/register', payload)
    return res.data.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  const updateMe = async (payload: Partial<AuthUser> & Record<string, unknown>) => {
    const res = await api.patch('/users/me', payload)
    setUser(res.data.data)
    return res.data.data
  }

  const sendOtp = async ({ phone, password, name, intent = 'login' }: { phone: string; password: string; name?: string; intent?: 'login' | 'register' }) => {
    await api.post('/auth/send-otp', { phone, password, name, intent })
    return true
  }

  const verifyOtp = async ({ phone, otp, email }: { phone: string; otp: string; email?: string }) => {
    const res = await api.post('/auth/verify-otp', { phone, otp, email })
    applyAuthResponse(res.data.data)
    return res.data.data.user
  }

  const completeOtpVerification = (data: AuthResponse) => {
    applyAuthResponse(data)
  }

  const changePassword = async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
    const res = await api.put('/auth/change-password', { currentPassword, newPassword })
    applyAuthResponse(res.data.data)
    return true
  }

  const value: AuthContextValue = { user, loading, login, register, logout, updateMe, sendOtp, verifyOtp, completeOtpVerification, changePassword }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}