import { useEffect, useState } from 'react'
import api from '../../api/api'
import FormInput from '../../components/FormInput'
import Button from '../../components/Button'
import AdminLayout from '../../components/admin/AdminLayout'

export default function AdminCommunity() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    content: '',
    tag: '',
    imageUrl: '',
  })

  const load = () => {
    setLoading(true)
    api.get('/admin/community')
      .then(res => setPosts(res.data.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    await api.post('/admin/community', form)
    setForm({ title: '', content: '', tag: '', imageUrl: '' })
    load()
  }

  const handleDelete = async (id) => {
    await api.delete(`/admin/community/${id}`)
    load()
  }

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold">Manage community posts</h1>
      <form onSubmit={handleCreate} className="bg-white border border-slate-100 rounded-xl p-4 space-y-3">
        <FormInput label="Title" name="title" value={form.title} onChange={handleChange} required />
        <FormInput label="Tag" name="tag" value={form.tag} onChange={handleChange} />
        <FormInput label="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
        <label className="text-sm">
          <span className="block mb-1 text-slate-700">Content</span>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows="3"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </label>
        <Button type="submit" className="w-full">Publish</Button>
      </form>

      <div>
        <h2 className="font-semibold mb-2">Existing posts</h2>
        {loading && <p className="text-slate-500">Loading...</p>}
        <div className="space-y-2">
          {posts.map(post => (
            <div key={post._id} className="bg-white border border-slate-100 rounded-xl p-3 flex justify-between items-start">
              <div>
                <div className="text-xs text-primary-600 uppercase">{post.tag}</div>
                <div className="font-semibold">{post.title}</div>
                <div className="text-xs text-slate-500 line-clamp-2 mt-1">{post.content}</div>
              </div>
              <button
                onClick={() => handleDelete(post._id)}
                className="text-xs text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}