import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api'

export default function CommunityPostPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get(`/community/${id}`)
      .then(res => setPost(res.data.data))
      .catch(() => setError('Failed to load post.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-sm text-slate-500">Loading...</p>
  if (error) return <p className="text-sm text-red-500">{error}</p>
  if (!post) return <p className="text-sm text-slate-500">Post not found.</p>

  return (
    <article className="space-y-3">
      <div className="text-xs text-slate-500 flex justify-between">
        <span className="uppercase tracking-wide text-primary-600">{post.tag}</span>
        <span>{new Date(post.publishedAt || post.createdAt).toLocaleString()}</span>
      </div>
      <h1 className="text-2xl font-semibold text-slate-900">{post.title}</h1>
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} className="w-full max-h-80 object-cover rounded-xl" />
      )}
      <p className="text-sm text-slate-700 whitespace-pre-line">{post.content}</p>
    </article>
  )
}