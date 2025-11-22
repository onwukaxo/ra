import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'
import { SITE } from '../config/site'
import MediaRenderer from '../components/MediaRenderer'

export default function Community({ embed = false }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/community')
      .then(res => setPosts(res.data.data))
      .catch(() => setError('Failed to load community posts.'))
      .finally(() => setLoading(false))
  }, [])

  if (embed) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        {posts.slice(0, 3).map(post => (
          <Link
            key={post._id}
            to={`/community/${post._id}`}
            aria-label={`Open post: ${post.title}`}
            className="group"
          >
            <article className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDCD2F]/60">
              <div className="text-xs text-primary-600 mb-1">{post.tag}</div>
              <h3 className="font-semibold text-slate-800">{post.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-3 mt-1">{post.content}</p>
            </article>
          </Link>
        ))}
      </div>
    )
  }

  const formatRelativeTime = (d) => {
    try {
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
    } catch {
      return ''
    }
  }

  const getInitials = (text) => {
    const base = String(text || 'Rations Community').trim()
    const parts = base.split(/\s+/)
    const a = (parts[0] || '').charAt(0)
    const b = (parts[1] || '').charAt(0)
    return (a + b).toUpperCase() || 'RC'
  }

  const youtubeIdFromUrl = (url) => {
    try {
      const u = new URL(String(url))
      if (u.hostname.includes('youtu.be')) {
        return u.pathname.replace('/', '') || null
      }
      if (u.hostname.includes('youtube.com')) {
        return u.searchParams.get('v') || null
      }
      return null
    } catch {
      return null
    }
  }

  return (
    <div className="space-y-6">
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#FDCD2F]/20 blur-3xl -z-10" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#0C1E22]/10 blur-3xl -z-10" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-1 text-xs font-medium text-[#0C1E22]/70">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#FDCD2F]" />
          Our People • Our Stories
        </span>

        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-[#0C1E22] tracking-tight">
          Join the <span className="text-[#FDCD2F]">Rations</span> Community
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-700">
          Rations isn’t just about food, it’s about people. From shared meals to
          online conversations, our community is where stories are told and moments
          are shared.
        </p>

        <div className="mt-12 flex justify-center">
          <div className="grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {SITE.socials.filter(s => !!s.url).map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="group relative flex items-center justify-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDCD2F]/60"
                  style={{ color: '#0C1E22' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = social.hoverColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#0C1E22')}
                >
                  <Icon size={28} className="transition-transform group-hover:scale-110" />
                  <span className="sr-only">{social.name}</span>
                  <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-[#FDCD2F]/0 to-[#FDCD2F]/0 opacity-0 transition group-hover:opacity-100 group-hover:from-[#FDCD2F]/10" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>

      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => {
          const mediaType = String(post.mediaType || '').toLowerCase()
          const hasMedia = Boolean(post.mediaUrl)
          const initials = getInitials(post.createdBy?.name || 'Rations Community')
          const author = post.createdBy?.name || 'Rations Community'
          const when = formatRelativeTime(post.publishedAt || post.createdAt)
          const ytId = mediaType === 'youtube' ? youtubeIdFromUrl(post.mediaUrl) : null
          return (
            <Link
              key={post._id}
              to={`/community/${post._id}`}
              aria-label={`Open post: ${post.title}`}
              className="group"
            >
              <article className="bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDCD2F]/60">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-[#0C1E22]">{author}</div>
                      <div className="text-xs text-slate-500">{when}</div>
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-500">{post.tag}</div>
                  </div>

                  <div className="text-sm text-slate-700 leading-relaxed max-w-[70ch]">
                    <h3 className="text-base sm:text-lg font-bold text-[#0C1E22]">{post.title}</h3>
                    <p className="mt-1 text-slate-600 line-clamp-3 break-words">{post.content || post.excerpt}</p>
                  </div>
                </div>

                <MediaRenderer url={post.mediaUrl} title={post.mediaTitle || post.title} variant="list" imageFallback={post.imageUrl} />
                {post.mediaUrl && post.mediaTitle && (
                  <div className="px-4 py-2 text-xs text-slate-500">{post.mediaTitle}</div>
                )}
              </article>
            </Link>
          )
        })}
      </div>
    </div>
  )
}