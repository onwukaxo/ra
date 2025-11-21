import { useEffect, useState } from 'react'
import api from '../../api/api'
import FormInput from '../../components/FormInput'
import Button from '../../components/Button'
import AdminLayout from '../../components/admin/AdminLayout'

export default function AdminMenu() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    isAvailable: true,
  })

  const [filter, setFilter] = useState({ category: 'all', availability: 'all' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', price: '', category: '', imageUrl: '', description: '', isAvailable: true, popularity: 0 })
  const [notice, setNotice] = useState('')

  const load = () => {
    setLoading(true)
    api.get('/admin/menu')
      .then(res => setItems(res.data.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    await api.post('/admin/menu', {
      ...form,
      price: Number(form.price),
    })
    setForm({
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      isAvailable: true,
    })
    load()
  }

  const toggleAvailability = async (item) => {
    await api.patch(`/admin/menu/${item._id}`, { isAvailable: !item.isAvailable })
    setNotice('Availability updated')
    load()
  }

  const archiveItem = async (item) => {
    if (!confirm(`Remove ${item.name} from website?`)) return
    await api.delete(`/admin/menu/${item._id}`)
    setNotice('Item removed from website (archived)')
    load()
  }

  const deleteItemHard = async (item) => {
    if (!confirm(`Delete ${item.name} permanently? This cannot be undone.`)) return
    await api.delete(`/admin/menu/${item._id}/hard`)
    setNotice('Item deleted permanently')
    load()
  }

  const filtered = items.filter(i => {
    const catOk = filter.category === 'all' || String(i.category||'').toLowerCase() === filter.category
    const availOk = filter.availability === 'all' || (filter.availability === 'available' ? i.isAvailable : !i.isAvailable)
    return catOk && availOk
  })

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold">Manage menu</h1>
      {notice && <p className="text-xs text-green-600 mt-1">{notice}</p>}
      <div className="mt-2 flex gap-2 text-xs">
        <select value={filter.category} onChange={(e)=>setFilter(f=>({...f, category: e.target.value}))} className="border rounded px-2 py-1">
          <option value="all">All categories</option>
          {[...new Set(items.map(i=>String(i.category||'').toLowerCase()))].filter(Boolean).map(c=>(
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={filter.availability} onChange={(e)=>setFilter(f=>({...f, availability: e.target.value}))} className="border rounded px-2 py-1">
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>
      <form onSubmit={handleCreate} className="bg-white border border-slate-100 rounded-xl p-4 grid md:grid-cols-2 gap-3">
        <FormInput label="Name" name="name" value={form.name} onChange={handleChange} required />
        <FormInput label="Category" name="category" value={form.category} onChange={handleChange} required />
        <FormInput label="Price (₦)" name="price" type="number" value={form.price} onChange={handleChange} required />
        <FormInput label="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
        <FormInput label="Popularity" name="popularity" type="number" value={form.popularity||''} onChange={handleChange} />
        <label className="flex items-center gap-2 text-xs mt-1">
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
          />
          Available
        </label>
        <label className="md:col-span-2 text-sm mb-2">
          <span className="block mb-1 text-slate-700">Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows="2"
          />
        </label>
        <Button type="submit" className="md:col-span-2 w-full">Add menu item</Button>
      </form>

      <div>
        <h2 className="font-semibold mb-2">Existing items</h2>
        {loading && <p className="text-slate-500">Loading...</p>}
        <ul className="space-y-2">
          {filtered.map(item => (
            <li key={item._id} className="flex justify-between items-center bg-white border border-slate-100 rounded-xl px-3 py-2">
              {editingId === item._id ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const payload = {
                      name: editForm.name.trim(),
                      price: Number(editForm.price || 0),
                      category: editForm.category.trim(),
                      imageUrl: editForm.imageUrl.trim(),
                      description: editForm.description.trim(),
                      isAvailable: !!editForm.isAvailable,
                      popularity: Number(editForm.popularity || 0),
                    }
                    if (!payload.name || payload.price <= 0 || !payload.category) return
                    await api.patch(`/admin/menu/${item._id}`, payload)
                    setEditingId(null)
                    load()
                  }}
                  className="flex-1 grid md:grid-cols-2 gap-2 text-xs"
                >
                  <FormInput label="Name" value={editForm.name} onChange={(e)=>setEditForm(f=>({...f, name: e.target.value}))} />
                  <FormInput label="Category" value={editForm.category} onChange={(e)=>setEditForm(f=>({...f, category: e.target.value}))} />
                  <FormInput label="Price" type="number" value={editForm.price} onChange={(e)=>setEditForm(f=>({...f, price: e.target.value}))} />
                  <FormInput label="Image URL" value={editForm.imageUrl} onChange={(e)=>setEditForm(f=>({...f, imageUrl: e.target.value}))} />
                  <FormInput label="Popularity" type="number" value={editForm.popularity} onChange={(e)=>setEditForm(f=>({...f, popularity: e.target.value}))} />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={editForm.isAvailable} onChange={(e)=>setEditForm(f=>({...f, isAvailable: e.target.checked}))} />
                    <span>Available</span>
                  </label>
                  <label className="md:col-span-2 text-sm">
                    <span className="block mb-1 text-slate-700">Description</span>
                    <textarea value={editForm.description} onChange={(e)=>setEditForm(f=>({...f, description: e.target.value}))} className="w-full border rounded px-2 py-1" rows="2" />
                  </label>
                  <div className="md:col-span-2 flex gap-2">
                    <Button type="submit">Save</Button>
                    <Button type="button" onClick={()=>setEditingId(null)}>Cancel</Button>
                  </div>
                </form>
              ) : (
                <>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.category} • ₦{item.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(item._id)
                        setEditForm({
                          name: item.name || '',
                          price: item.price || 0,
                          category: item.category || '',
                          imageUrl: item.imageUrl || '',
                          description: item.description || '',
                          isAvailable: !!item.isAvailable,
                          popularity: item.popularity || 0,
                        })
                      }}
                      className="text-xs px-3 py-1 rounded-full border border-slate-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleAvailability(item)}
                      className="text-xs px-3 py-1 rounded-full border border-slate-300"
                    >
                      {item.isAvailable ? 'Set unavailable' : 'Set available'}
                    </button>
                    <button
                      onClick={() => archiveItem(item)}
                      className="text-xs px-3 py-1 rounded-full border border-slate-300"
                    >
                      Remove from Website
                    </button>
                    <button
                      onClick={() => deleteItemHard(item)}
                      className="text-xs px-3 py-1 rounded-full border border-slate-300 text-red-600"
                    >
                      Delete Permanently
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  )
}