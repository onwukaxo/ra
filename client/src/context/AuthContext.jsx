import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
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

  const applyAuthResponse = (data) => {
    if (!data?.token || !data?.user) return
    localStorage.setItem('token', data.token)
    setUser(data.user)
  }

  const login = async (identifier, password) => {
    const res = await api.post('/auth/login', { identifier, password })
    applyAuthResponse(res.data.data)
    return res.data.data.user
  }

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload)
    return res.data.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  const updateMe = async (payload) => {
    const res = await api.patch('/users/me', payload)
    setUser(res.data.data)
    return res.data.data
  }

  const sendOtp = async ({ phone, password, name, intent = 'login' }) => {
    await api.post('/auth/send-otp', { phone, password, name, intent })
    return true
  }

  const verifyOtp = async ({ phone, otp, email }) => {
    const res = await api.post('/auth/verify-otp', { phone, otp, email })
    applyAuthResponse(res.data.data)
    return res.data.data.user
  }

  const completeOtpVerification = (data) => {
    applyAuthResponse(data)
  }

  const value = { user, loading, login, register, logout, updateMe, sendOtp, verifyOtp, completeOtpVerification }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}