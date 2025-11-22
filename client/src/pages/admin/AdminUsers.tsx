import { useEffect, useState } from 'react'
import api from '../../api/api'
import AdminLayout from '../../components/admin/AdminLayout'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get('/admin/users')
      .then(res => setUsers(res.data.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold">Users</h1>
      {loading && <p className="text-slate-500">Loading...</p>}
      <table className="w-full text-xs bg-white border border-slate-100 rounded-xl overflow-hidden mt-2">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left px-3 py-2">Name</th>
            <th className="text-left px-3 py-2">Email</th>
            <th className="text-left px-3 py-2">Phone</th>
            <th className="text-left px-3 py-2">Role</th>
            <th className="text-left px-3 py-2">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} className="border-t border-slate-100">
              <td className="px-3 py-2">{u.name}</td>
              <td className="px-3 py-2">{u.email}</td>
              <td className="px-3 py-2">{u.phone}</td>
              <td className="px-3 py-2">{u.role}</td>
              <td className="px-3 py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  )
}
