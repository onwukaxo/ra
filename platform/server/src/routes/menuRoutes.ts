import { Router } from 'express'
import { createMenuItem, deleteMenuItem, getMenuItem, listMenu, updateMenuItem } from '../controllers/menuController.js'
import { requireAuth, requirePermission } from '../middleware/roles.js'

const router = Router()

router.get('/', listMenu)
router.get('/:id', getMenuItem)
router.post('/', requireAuth, requirePermission('MANAGE_MENU'), createMenuItem)
router.put('/:id', requireAuth, requirePermission('MANAGE_MENU'), updateMenuItem)
router.delete('/:id', requireAuth, requirePermission('MANAGE_MENU'), deleteMenuItem)

export default router
