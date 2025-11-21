import CommunityPost from '../models/CommunityPost.js'

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
  const { title, content, imageUrl, tag, slug, excerpt, coverImageUrl, tags, status } = req.body
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required' })
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
  })
  res.status(201).json({ success: true, data: post })
}

export async function updatePost(req, res) {
  const post = await CommunityPost.findById(req.params.id)
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' })
  }
  const fields = ['title', 'content', 'imageUrl', 'tag', 'slug', 'excerpt', 'coverImageUrl', 'tags', 'status']
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      post[field] = req.body[field]
    }
  })
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