import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'
import { SITE } from '../config/site'

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
          <article key={post._id} className="bg-white border border-slate-100 rounded-xl p-3">
            <div className="text-xs text-primary-600 mb-1">{post.tag}</div>
            <h3 className="font-semibold text-slate-800">{post.title}</h3>
            <p className="text-xs text-slate-600 line-clamp-3 mt-1">{post.content}</p>
          </article>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-20">
      {/* Ambient brand blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#FDCD2F]/20 blur-3xl -z-10" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#0C1E22]/10 blur-3xl -z-10" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        {/* Eyebrow */}
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

        {/* Socials section */}
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

      <div className="space-y-3">
        {posts.map(post => (
          <Link key={post._id} to={`/community/${post._id}`}>
            <article className="bg-white border border-slate-100 rounded-xl p-4 text-sm hover:bg-slate-50">
              <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                <span className="uppercase tracking-wide text-slate-700">{post.tag}</span>
                <span>{new Date(post.publishedAt || post.createdAt).toLocaleString()}</span>
              </div>
              <h3 className="font-semibold text-slate-800">{post.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2 mt-1">{post.content}</p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}