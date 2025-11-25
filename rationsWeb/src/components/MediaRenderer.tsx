import { useEffect, useMemo } from 'react'

export default function MediaRenderer({ url, title = '', variant = 'list', imageFallback = '' }) {
  const parsed = useMemo(() => {
    const u = String(url || '').trim()
    if (!u) return { type: 'none', url: '' }
    try {
      const obj = new URL(u)
      const host = obj.hostname.toLowerCase()
      const path = obj.pathname.toLowerCase()
      const ext = path.split('.').pop()
      if (host.includes('youtu.be')) {
        const id = obj.pathname.replace('/', '')
        return { type: 'youtube', id }
      }
      if (host.includes('youtube.com')) {
        const id = obj.searchParams.get('v')
        return { type: 'youtube', id }
      }
      if (host.includes('instagram.com')) {
        return { type: 'instagram', url: u }
      }
      if (host.includes('twitter.com') || host.includes('x.com')) {
        return { type: 'x', url: u }
      }
      if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        return { type: 'image', url: u }
      }
      if (['mp4', 'webm', 'ogg', 'm4v'].includes(ext)) {
        return { type: 'video', url: u }
      }
      return { type: 'link', url: u }
    } catch {
      return { type: 'link', url: u }
    }
  }, [url])

  useEffect(() => {
    if (parsed.type === 'instagram') {
      const src = 'https://www.instagram.com/embed.js'
      const exists = Array.from(document.getElementsByTagName('script')).some(s => s.src === src)
      if (!exists) {
        const s = document.createElement('script')
        s.async = true
        s.src = src
        document.body.appendChild(s)
      }
    }
  }, [parsed.type])

  const ratioClass = variant === 'detail' ? 'rounded-xl' : 'rounded-b-xl'
  const wrapPad = variant === 'detail' ? '56.25%' : '56.25%'
  const imageClasses = variant === 'detail' ? 'w-full h-auto rounded-xl object-cover' : 'absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]'
  const cardPadClasses = variant === 'detail' ? '' : 'w-full'

  if (parsed.type === 'none') {
    if (imageFallback) {
      return (
        <div className={`relative overflow-hidden ${ratioClass}`}>
          <div className={cardPadClasses} style={{ paddingTop: '75%' }}>
            <img src={imageFallback} alt={title} className={imageClasses} />
          </div>
        </div>
      )
    }
    return null
  }

  if (parsed.type === 'youtube' && parsed.id) {
    const src = `https://www.youtube.com/embed/${parsed.id}`
    return (
      <div className={`relative w-full overflow-hidden ${ratioClass}`} style={{ paddingTop: wrapPad }}>
        <iframe
          title={title || 'YouTube video'}
          src={src}
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }

  if (parsed.type === 'instagram') {
    return (
      <div className={variant === 'detail' ? 'mx-auto max-w-2xl' : ''}>
        <blockquote className="instagram-media" data-instgrm-permalink={parsed.url} data-instgrm-version="14" style={{ background: '#fff', border: 0, margin: 0, padding: 0 }} />
      </div>
    )
  }

  if (parsed.type === 'image') {
    if (variant === 'detail') {
      return <img src={parsed.url} alt={title} className="w-full rounded-xl object-cover" />
    }
    return (
      <div className={`relative overflow-hidden ${ratioClass}`}>
        <div className={cardPadClasses} style={{ paddingTop: '75%' }}>
          <img src={parsed.url} alt={title} className={imageClasses} />
        </div>
      </div>
    )
  }

  if (parsed.type === 'video') {
    if (variant === 'detail') {
      return (
        <video controls className="w-full rounded-xl max-h-[480px] object-cover">
          <source src={parsed.url} />
        </video>
      )
    }
    return (
      <div className={`relative w-full overflow-hidden ${ratioClass}`} style={{ paddingTop: '56.25%' }}>
        <video
          controls
          className="absolute top-0 left-0 w-full h-full object-cover"
          onClick={(e) => e.stopPropagation?.()}
          onMouseDown={(e) => e.stopPropagation?.()}
        >
          <source src={parsed.url} />
        </video>
      </div>
    )
  }

  if (parsed.type === 'x') {
    return (
      <div className="px-4 pb-4">
        <a
          href={parsed.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 border rounded-lg text-sm hover:shadow"
          onClick={(e) => e.stopPropagation?.()}
          onMouseDown={(e) => e.stopPropagation?.()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.901 2H21.7l-6.08 6.956L22.5 22h-6.89l-4.356-5.71L6.3 22H3.5l6.49-7.423L1.5 2h6.89l3.987 5.228L18.9 2zm-1.206 18h2.024L9.304 4H7.28l10.415 16z" />
          </svg>
          <span>View post on X</span>
        </a>
      </div>
    )
  }

  if (parsed.type === 'link') {
    return (
      <div className="px-4 pb-4">
        <div className="p-3 border rounded-lg flex items-center justify-between">
          <div className="text-xs text-slate-700">Open link</div>
          <a
            href={parsed.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-full border text-xs"
            onClick={(e) => e.stopPropagation?.()}
            onMouseDown={(e) => e.stopPropagation?.()}
          >
            Visit
          </a>
        </div>
      </div>
    )
  }

  if (imageFallback) {
    return (
      <div className={`relative overflow-hidden ${ratioClass}`}>
        <div className={cardPadClasses} style={{ paddingTop: '75%' }}>
          <img src={imageFallback} alt={title} className={imageClasses} />
        </div>
      </div>
    )
  }
  return null
}