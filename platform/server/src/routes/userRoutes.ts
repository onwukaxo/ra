import { Router } from 'express'
import { listUsers, updateMe } from '../controllers/userController.js'
import { requireAuth, requirePermission } from '../middleware/roles.js'

const router = Router()

router.get('/', requireAuth, requirePermission('VIEW_USERS'), listUsers)
router.patch('/me', requireAuth, updateMe)

export default router
