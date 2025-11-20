import { Router } from 'express'
import { overview } from '../controllers/adminController.js'
import { protect, requireAdmin } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/overview', protect, requireAdmin, overview)

export default router