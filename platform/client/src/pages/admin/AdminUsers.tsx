import { useEffect, useState } from 'react'
import api from '../../api/api'
import { useAuth } from '../../context/AuthContext'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [savingId, setSavingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', role: '' })
  const [notice, setNotice] = useState('')
  const { user: currentUser } = useAuth()

  const load = () => {
    setLoading(true)
    api.get('/admin/users')
      .then(res => setUsers(res.data.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const roles = ['USER','ADMIN','SUPERADMIN','owner','manager','cashier','kitchen','staff']
  const allowedRoles = (() => {
    const r = String(currentUser?.role || '')
    if (r === 'owner') return ['owner','ADMIN','SUPERADMIN','manager','cashier','kitchen','staff','USER']
    if (r === 'ADMIN' || r === 'SUPERADMIN') return ['manager','cashier','kitchen','staff','USER']
    return []
  })()
  const changeRole = async (id: string, role: string) => {
    setSavingId(id)
    try {
      await api.patch(`/admin/users/${id}/role`, { role })
      load()
    } finally {
      setSavingId(null)
    }
  }

  const handleCreate = async (e: any) => {
    e.preventDefault()
    setNotice('')
    try {
      const payload = { name: form.name.trim(), email: form.email.trim(), role: form.role }
      await api.post('/admin/users', payload)
      setForm({ name: '', email: '', role: '' })
      setNotice('User invited')
      load()
    } catch (err) {
      setNotice(err.response?.data?.message || 'Unable to create user')
    }
  }

  return (
    <>
      <h1 className="text-xl font-semibold">Users</h1>
      {notice && <p className="text-xs text-green-600 mt-1">{notice}</p>}
      {(currentUser?.role==='owner' || currentUser?.role==='ADMIN' || currentUser?.role==='SUPERADMIN') && (
        <form onSubmit={handleCreate} className="bg-white border border-slate-100 rounded-xl p-3 grid md:grid-cols-4 gap-2 mt-2 text-sm">
          <input value={form.name} onChange={(e)=>setForm(f=>({ ...f, name: e.target.value }))} placeholder="Full name" className="border rounded px-2 py-1" required />
          <input value={form.email} onChange={(e)=>setForm(f=>({ ...f, email: e.target.value }))} placeholder="Email" className="border rounded px-2 py-1" required />
          <select value={form.role} onChange={(e)=>setForm(f=>({ ...f, role: e.target.value }))} className="border rounded px-2 py-1" required>
            <option value="">Select role</option>
            {allowedRoles.map(r => (<option key={r} value={r}>{r}</option>))}
          </select>
          <button type="submit" className="rounded px-3 py-1 border">Add User</button>
        </form>
      )}
      {loading && <p className="text-slate-500">Loading...</p>}
      <table className="w-full text-xs bg-white border border-slate-100 rounded-xl overflow-hidden mt-2">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left px-3 py-2">Name</th>
            <th className="text-left px-3 py-2">Email</th>
            <th className="text-left px-3 py-2">Phone</th>
            <th className="text-left px-3 py-2">Role</th>
            <th className="text-left px-3 py-2">Status</th>
            <th className="text-left px-3 py-2">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} className="border-t border-slate-100">
              <td className="px-3 py-2">{u.name}</td>
              <td className="px-3 py-2">{u.email}</td>
              <td className="px-3 py-2">{u.phone}</td>
              <td className="px-3 py-2">
                <select
                  value={u.role}
                  onChange={(e)=>changeRole(u._id, e.target.value)}
                  className="border rounded px-2 py-1"
                  disabled={savingId===u._id}
                >
                  {roles.filter(r => allowedRoles.includes(r) || r===u.role).map(r => (<option key={r} value={r}>{r}</option>))}
                </select>
              </td>
              <td className="px-3 py-2">{u.status || 'active'}</td>
              <td className="px-3 py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
