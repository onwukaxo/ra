import CommunityPost from '../models/CommunityPost.js'

export async function listPosts(req, res) {
  const posts = await CommunityPost.find().sort({ createdAt: -1 })
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
  const { title, content, imageUrl, tag } = req.body
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required' })
  }
  const post = await CommunityPost.create({
    title,
    content,
    imageUrl: imageUrl || '',
    tag: tag || 'Update',
    publishedAt: new Date(),
    createdBy: req.user?._id,
  })
  res.status(201).json({ success: true, data: post })
}

export async function updatePost(req, res) {
  const post = await CommunityPost.findById(req.params.id)
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' })
  }
  const fields = ['title', 'content', 'imageUrl', 'tag']
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      post[field] = req.body[field]
    }
  })
  await post.save()
  res.json({ success: true, data: post })
}

export async function deletePost(req, res) {
  const post = await CommunityPost.findById(req.params.id)
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' })
  }
  await post.deleteOne()
  res.json({ success: true, message: 'Post deleted' })
}