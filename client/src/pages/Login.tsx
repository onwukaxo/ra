import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'

export default function Login() {
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const isFormValid = form.identifier.trim().length > 0 && form.password.length > 0

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.identifier, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative w-full">
          <label className="block text-sm mb-1 text-slate-700">Email or Phone</label>
          <input
            name="identifier"
            type="text"
            value={form.identifier}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-ration-yellow focus:outline-none"
            placeholder="Enter email or phone"
            required
          />
        </div>

        <div className="relative w-full">
          <label className="block text-sm mb-1 text-slate-700">Password</label>
          <input
            name="password"
            type={passwordVisible ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-ration-yellow focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100"
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
          >
            {passwordVisible ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.003.147-1.972.422-2.882m3.066-3.066A9.958 9.958 0 0112 1c5.523 0 10 4.477 10 10 0 1.003-.147 1.972-.422 2.882M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18M10.12 6.88A9.956 9.956 0 0112 6c5.523 0 10 4.477 10 10-.264.902-.644 1.758-1.126 2.552M6.88 10.12A9.96 9.96 0 002 12c.264.902.644 1.758 1.126 2.552M9.88 9.88A3 3 0 1114.12 14.12"/></svg>
            )}
          </button>
          {error && (
            <p className="mt-1 text-xs text-red-500">{error}</p>
          )}
          <div className="mt-2">
            <Link to="/forgot-password" className="text-xs text-slate-600 hover:underline">Forgot Password?</Link>
          </div>
        </div>

        <Button className="w-full" type="submit" disabled={loading || !isFormValid}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex-1 h-px bg-slate-200" />
          <span>or</span>
          <span className="flex-1 h-px bg-slate-200" />
        </div>
        <p className="text-xs text-slate-600">
          Don&apos;t have an account? <Link to="/register" className="text-primary-600 font-medium">Create Account</Link>
        </p>
      </form>
    </div>
  )
}