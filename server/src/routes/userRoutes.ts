import { Router } from 'express'
import { listUsers, updateMe } from '../controllers/userController.js'
import { protect, requireAdmin } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', protect, requireAdmin, listUsers)
router.patch('/me', protect, updateMe)

export default router