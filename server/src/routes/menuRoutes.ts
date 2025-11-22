import { Router } from 'express'
import { createMenuItem, deleteMenuItem, getMenuItem, listMenu, updateMenuItem } from '../controllers/menuController.js'
import { protect, requireAdmin } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', listMenu)
router.get('/:id', getMenuItem)
router.post('/', protect, requireAdmin, createMenuItem)
router.put('/:id', protect, requireAdmin, updateMenuItem)
router.delete('/:id', protect, requireAdmin, deleteMenuItem)

export default router