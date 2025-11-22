import { Router } from 'express'
import { createPost, deletePost, getPost, listPosts, updatePost } from '../controllers/communityController.js'
import { protect, requireAdmin } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', listPosts)
router.get('/:id', getPost)
router.post('/', protect, requireAdmin, createPost)
router.put('/:id', protect, requireAdmin, updatePost)
router.delete('/:id', protect, requireAdmin, deletePost)

export default router