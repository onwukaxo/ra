import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function CommunityPostPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: '', tag: '', imageUrl: '', content: '', mediaUrl: '', mediaTitle: '' })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    api.get(`/community/${id}`)
      .then(res => setPost(res.data.data))
      .catch(() => setError('Failed to load post.'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title || '',
        tag: post.tag || '',
        imageUrl: post.imageUrl || '',
        content: post.content || '',
        mediaUrl: post.mediaUrl || '',
        mediaTitle: post.mediaTitle || '',
      })
    }
  }, [post])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const save = async () => {
    setFormError('')
    if (!form.title.trim() || !form.content.trim()) {
      setFormError('Title and content are required')
      return
    }
    if (form.mediaUrl) {
      try {
        const u = new URL(form.mediaUrl)
        if (!(u.protocol === 'http:' || u.protocol === 'https:')) throw new Error('bad')
      } catch {
        setFormError('Enter a valid media URL (http/https)')
        return
      }
    }
    setSaving(true)
    try {
      await api.put(`/admin/community/${post._id}`, {
        title: form.title,
        tag: form.tag,
        imageUrl: form.imageUrl,
        content: form.content,
        mediaUrl: form.mediaUrl,
        mediaTitle: form.mediaTitle,
      })
      const updated = await api.get(`/community/${id}`)
      setPost(updated.data.data)
      setEditing(false)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Unable to update post')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading...</p>
  if (error) return <p className="text-sm text-red-500">{error}</p>
  if (!post) return <p className="text-sm text-slate-500">Post not found.</p>

  return (
    <article className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="text-sm font-semibold text-[#0C1E22]">{post.createdBy?.name || 'Rations Community'}</div>
          <div className="text-xs text-slate-500">{(() => {
            const d = post.publishedAt || post.createdAt
            const now = Date.now()
            const ts = new Date(d).getTime()
            const diff = Math.max(0, Math.floor((now - ts) / 1000))
            if (diff < 60) return 'just now'
            if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
            if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`
            const days = Math.floor(diff / 86400)
            if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`
            const months = Math.floor(days / 30)
            if (months < 12) return `${months} mo ago`
            const years = Math.floor(months / 12)
            return `${years} yr${years > 1 ? 's' : ''} ago`
          })()}</div>
        </div>
        <div className="text-[10px] uppercase tracking-wide text-slate-500">{post.tag}</div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#0C1E22]">{post.title}</h1>
      <MediaRenderer url={post.mediaUrl} title={post.mediaTitle || post.title} variant="detail" imageFallback={post.imageUrl} />
      {post.mediaUrl && post.mediaTitle && <div className="text-xs text-slate-500 mt-1">{post.mediaTitle}</div>}
      {post.externalLinkUrl && (
        <div className="mt-2 p-3 border rounded-lg">
          <a
            href={post.externalLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`External link: ${post.externalLinkTitle || post.externalLinkUrl}`}
            className="inline-flex items-center gap-2 text-xs"
          >
            <span className="px-3 py-1 rounded-full bg-[#0C1E22] text-white">Open link</span>
            <span className="text-slate-700">{post.externalLinkTitle || post.externalLinkUrl}</span>
          </a>
        </div>
      )}
      <div className="text-base leading-relaxed text-slate-800 whitespace-pre-line">{post.content}</div>

      {user && user.role === 'ADMIN' && (
        <div className="mt-6 ">
          <div className="flex items-center justify-between">
            {!editing ? (
              <button className="text-xs px-3 py-1 rounded-full border" onClick={()=>setEditing(true)}>Edit</button>
            ) : (
              <button className="text-xs px-3 py-1 rounded-full border" onClick={()=>setEditing(false)}>Close</button>
            )}
          </div>
          {editing && (
            <div className="space-y-2">
              <label className="text-sm">
                <span className="block mb-1 text-slate-700">Title</span>
                <input name="title" value={form.title} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </label>
              <label className="text-sm">
                <span className="block mb-1 text-slate-700">Tag</span>
                <input name="tag" value={form.tag} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </label>
              <label className="text-sm">
                <span className="block mb-1 text-slate-700">Image URL</span>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </label>
              <label className="text-sm">
                <span className="block mb-1 text-slate-700">Media URL (optional)</span>
                <input name="mediaUrl" value={form.mediaUrl} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="https://..." />
                <span className="block mt-1 text-xs text-slate-500">Paste a YouTube link, audio, video, or image URL to embed media with this post.</span>
              </label>
              <label className="text-sm">
                <span className="block mb-1 text-slate-700">Media title/caption (optional)</span>
                <input name="mediaTitle" value={form.mediaTitle} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </label>
              <label className="text-sm">
                <span className="block mb-1 text-slate-700">Content</span>
                <textarea name="content" value={form.content} onChange={handleChange} rows="4" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
              </label>
              {formError && <div className="text-xs text-red-600">{formError}</div>}
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 rounded-full bg-ration-dark text-ration-yellow text-sm" onClick={save} disabled={saving}>{saving?'Saving...':'Update'}</button>
                <button className="px-3 py-2 rounded-full border border-slate-300 text-sm" onClick={()=>setEditing(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  )
}
import MediaRenderer from '../components/MediaRenderer'