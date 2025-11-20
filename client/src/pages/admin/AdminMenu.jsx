import { useEffect, useState } from 'react'
import api from '../../api/api'
import FormInput from '../../components/FormInput'
import Button from '../../components/Button'

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

  const load = () => {
    setLoading(true)
    api.get('/menu')
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
    await api.post('/menu', {
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
    await api.put(`/menu/${item._id}`, { ...item, isAvailable: !item.isAvailable })
    load()
  }

  return (
    <div className="space-y-4 text-sm">
      <h1 className="text-xl font-semibold">Manage menu</h1>
      <form onSubmit={handleCreate} className="bg-white border border-slate-100 rounded-xl p-4 grid md:grid-cols-2 gap-3">
        <FormInput label="Name" name="name" value={form.name} onChange={handleChange} required />
        <FormInput label="Category" name="category" value={form.category} onChange={handleChange} required />
        <FormInput label="Price (₦)" name="price" type="number" value={form.price} onChange={handleChange} required />
        <FormInput label="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
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
          {items.map(item => (
            <li key={item._id} className="flex justify-between items-center bg-white border border-slate-100 rounded-xl px-3 py-2">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-slate-500">{item.category} • ₦{item.price}</div>
              </div>
              <button
                onClick={() => toggleAvailability(item)}
                className="text-xs px-3 py-1 rounded-full border border-slate-300"
              >
                {item.isAvailable ? 'Set unavailable' : 'Set available'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}