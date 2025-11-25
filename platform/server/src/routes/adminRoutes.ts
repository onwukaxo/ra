import { Router } from 'express'
import { overview } from '../controllers/adminController.js'
import { getAdminSettings, upsertAdminSettings } from '../controllers/settingsController.js'
import { listMenu, createMenuItem, updateMenuItem, deleteMenuItem, hardDeleteMenuItem } from '../controllers/menuController.js'
import { adminListOrders, getOrderById, updateOrderStatus, confirmPayment } from '../controllers/orderController.js'
import { listUsers, getUser, updateUserAdminSafe, changeUserRole, createUser } from '../controllers/userController.js'
import { listPosts, getPost, createPost, updatePost, deletePost } from '../controllers/communityController.js'
import { requireAuth, requirePermission, requireRole } from '../middleware/roles.js'

const router = Router()

router.get('/overview', requireAuth, requirePermission('VIEW_REPORTS'), overview)

router.get('/menu', requireAuth, requirePermission('MANAGE_MENU'), listMenu)
router.post('/menu', requireAuth, requirePermission('MANAGE_MENU'), createMenuItem)
router.patch('/menu/:id', requireAuth, requirePermission('MANAGE_MENU'), updateMenuItem)
router.delete('/menu/:id', requireAuth, requirePermission('MANAGE_MENU'), deleteMenuItem)
router.delete('/menu/:id/hard', requireAuth, requirePermission('MANAGE_MENU'), hardDeleteMenuItem)

router.get('/orders', requireAuth, requirePermission('MANAGE_ORDERS'), adminListOrders)
router.get('/orders/:id', requireAuth, requirePermission('MANAGE_ORDERS'), getOrderById)
router.patch('/orders/:id', requireAuth, requirePermission('MANAGE_ORDERS'), async (req, res, next) => {
  try {
    if (req.body.paymentStatus === 'paid') {
      return confirmPayment(req, res, next)
    }
    return updateOrderStatus(req, res, next)
  } catch (err) {
    next(err)
  }
})

router.get('/users', requireAuth, requirePermission('VIEW_USERS'), listUsers)
router.post('/users', requireAuth, requirePermission('MANAGE_USERS'), createUser)
router.get('/users/:id', requireAuth, requirePermission('VIEW_USERS'), getUser)
router.patch('/users/:id', requireAuth, requirePermission('MANAGE_USERS'), updateUserAdminSafe)
router.patch('/users/:id/role', requireAuth, requirePermission('MANAGE_USERS'), changeUserRole)

router.get('/community', requireAuth, requirePermission('VIEW_REPORTS'), listPosts)
router.get('/community/:id', requireAuth, requirePermission('VIEW_REPORTS'), getPost)
router.post('/community', requireAuth, requirePermission('VIEW_REPORTS'), createPost)
router.put('/community/:id', requireAuth, requirePermission('VIEW_REPORTS'), updatePost)
router.delete('/community/:id', requireAuth, requirePermission('VIEW_REPORTS'), deletePost)


router.get('/settings', requireAuth, requirePermission('TENANT_SETTINGS'), getAdminSettings)
router.put('/settings', requireAuth, requirePermission('TENANT_SETTINGS'), upsertAdminSettings)

export default router
