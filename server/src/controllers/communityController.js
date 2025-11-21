import CommunityPost from '../models/CommunityPost.js'

function classifyMedia(urlString) {
  try {
    const u = new URL(urlString)
    if (!(u.protocol === 'http:' || u.protocol === 'https:')) return null
    const host = u.hostname.toLowerCase()
    const path = u.pathname.toLowerCase()
    if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube'
    if (/(\.mp4|\.webm|\.ogg)$/.test(path)) return 'video'
    if (/(\.mp3|\.wav|\.ogg)$/.test(path)) return 'audio'
    if (/(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/.test(path)) return 'image'
    return 'link'
  } catch {
    return null
  }
}

export async function listPosts(req, res) {
  const isAdmin = req.user?.role === 'ADMIN'
  const { status, page = 1, limit = 20 } = req.query
  const query = { deleted: { $ne: true } }
  if (!isAdmin) {
    if (status) {
      query.status = status
    } else {
      query.$or = [
        { status: 'published' },
        { status: { $exists: false } },
      ]
    }
  } else if (status) {
    query.status = status
  }
  const skip = (Number(page) - 1) * Number(limit)
  const posts = await CommunityPost.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
  res.json({ success: true, data: posts })
}

export async function getPost(req, res) {
  const post = await CommunityPost.findById(req.params.id)
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' })
  }
  res.json({ success: true, data: post })
}

export async function createPost(req, res) {
  const { title, content, imageUrl, tag, slug, excerpt, coverImageUrl, tags, status, mediaUrl, mediaTitle, externalLinkUrl, externalLinkTitle, authorAvatarUrl, alertEnabled, alertStart, alertEnd } = req.body
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required' })
  }
  let safeMediaUrl = ''
  let mediaType = ''
  if (mediaUrl) {
    const type = classifyMedia(String(mediaUrl))
    if (!type) {
      return res.status(400).json({ success: false, message: 'Invalid media URL' })
    }
    safeMediaUrl = String(mediaUrl)
    mediaType = type
  }
  let safeExternalLink = ''
  if (externalLinkUrl) {
    try {
      const u = new URL(String(externalLinkUrl))
      if (!(u.protocol === 'http:' || u.protocol === 'https:')) throw new Error('bad')
      safeExternalLink = String(externalLinkUrl)
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid external link URL' })
    }
  }
  let safeAvatarUrl = ''
  if (authorAvatarUrl) {
    try {
      const u = new URL(String(authorAvatarUrl))
      if (!(u.protocol === 'http:' || u.protocol === 'https:')) throw new Error('bad')
      safeAvatarUrl = String(authorAvatarUrl)
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid avatar URL' })
    }
  }
  const post = await CommunityPost.create({
    title,
    content,
    imageUrl: imageUrl || '',
    tag: tag || 'Update',
    publishedAt: status === 'published' ? new Date() : undefined,
    createdBy: req.user?._id,
    slug,
    excerpt,
    coverImageUrl,
    tags,
    status: status === 'draft' ? 'draft' : 'published',
    mediaUrl: safeMediaUrl,
    mediaType,
    mediaTitle: mediaTitle || '',
    externalLinkUrl: safeExternalLink,
    externalLinkTitle: externalLinkTitle || '',
    authorAvatarUrl: safeAvatarUrl,
    alertEnabled: Boolean(alertEnabled),
    alertStart: alertStart ? new Date(alertStart) : undefined,
    alertEnd: alertEnd ? new Date(alertEnd) : undefined,
  })
  res.status(201).json({ success: true, data: post })
}

export async function updatePost(req, res) {
  const post = await CommunityPost.findById(req.params.id)
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' })
  }
  const fields = ['title', 'content', 'imageUrl', 'tag', 'slug', 'excerpt', 'coverImageUrl', 'tags', 'status', 'mediaTitle', 'externalLinkTitle']
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      post[field] = req.body[field]
    }
  })
  if (req.body.alertEnabled !== undefined) {
    post.alertEnabled = Boolean(req.body.alertEnabled)
  }
  if (req.body.alertStart !== undefined) {
    const raw = req.body.alertStart
    post.alertStart = raw ? new Date(raw) : undefined
  }
  if (req.body.alertEnd !== undefined) {
    const raw = req.body.alertEnd
    post.alertEnd = raw ? new Date(raw) : undefined
  }
  if (req.body.mediaUrl !== undefined) {
    const raw = String(req.body.mediaUrl || '')
    if (raw) {
      const type = classifyMedia(raw)
      if (!type) {
        return res.status(400).json({ success: false, message: 'Invalid media URL' })
      }
      post.mediaUrl = raw
      post.mediaType = type
    } else {
      post.mediaUrl = ''
      post.mediaType = ''
    }
  }
  if (req.body.externalLinkUrl !== undefined) {
    const raw = String(req.body.externalLinkUrl || '')
    if (raw) {
      try {
        const u = new URL(raw)
        if (!(u.protocol === 'http:' || u.protocol === 'https:')) throw new Error('bad')
        post.externalLinkUrl = raw
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid external link URL' })
      }
    } else {
      post.externalLinkUrl = ''
    }
  }
  if (req.body.authorAvatarUrl !== undefined) {
    const raw = String(req.body.authorAvatarUrl || '')
    if (raw) {
      try {
        const u = new URL(raw)
        if (!(u.protocol === 'http:' || u.protocol === 'https:')) throw new Error('bad')
        post.authorAvatarUrl = raw
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid avatar URL' })
      }
    } else {
      post.authorAvatarUrl = ''
    }
  }
  if (req.body.status === 'published' && !post.publishedAt) {
    post.publishedAt = new Date()
  }
  await post.save()
  res.json({ success: true, data: post })
}

export async function deletePost(req, res) {
  const post = await CommunityPost.findById(req.params.id)
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' })
  }
  post.deleted = true
  await post.save()
  res.json({ success: true, message: 'Post archived' })
}