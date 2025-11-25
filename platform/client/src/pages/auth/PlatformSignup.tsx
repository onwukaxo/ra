import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/api'
import { useAuth } from '../../context/AuthContext'
import FormInput from '../../components/FormInput'
import Button from '../../components/Button'

export default function PlatformSignup() {
  const { setAuthState } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ ownerName: '', ownerEmail: '', password: '', confirm: '', restaurantName: '', restaurantSlug: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (form.password !== form.confirm) {
        setError('Passwords do not match')
        return
      }
      const payload = {
        ownerName: form.ownerName.trim(),
        ownerEmail: form.ownerEmail.trim(),
        password: form.password,
        restaurantName: form.restaurantName.trim(),
        restaurantSlug: form.restaurantSlug.trim() || undefined,
      }
      const res = await api.post('/platform/signup', payload)
      const data = res.data?.data
      if (!data?.token || !data?.user) throw new Error('Bad response')
      setAuthState({ token: data.token, user: data.user })
      const role = String(data.user.role)
      if (role === 'owner' || role === 'ADMIN' || role === 'SUPERADMIN') navigate('/admin', { replace: true })
      else if (role === 'manager') navigate('/dashboard/manager', { replace: true })
      else if (role === 'cashier') navigate('/dashboard/cashier', { replace: true })
      else if (role === 'kitchen') navigate('/dashboard/kitchen', { replace: true })
      else navigate('/dashboard', { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Create your restaurant</h1>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-2">
        <FormInput label="Owner name" name="ownerName" value={form.ownerName} onChange={onChange} required />
        <FormInput label="Owner email" name="ownerEmail" value={form.ownerEmail} onChange={onChange} required />
        <FormInput label="Password" type="password" name="password" value={form.password} onChange={onChange} required />
        <FormInput label="Confirm password" type="password" name="confirm" value={form.confirm} onChange={onChange} required />
        <FormInput label="Restaurant name" name="restaurantName" value={form.restaurantName} onChange={onChange} required />
        <FormInput label="Slug (optional)" name="restaurantSlug" value={form.restaurantSlug} onChange={onChange} />
        <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create restaurant'}</Button>
      </form>
    </div>
  )
}

