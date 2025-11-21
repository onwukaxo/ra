import { Router } from 'express'
import { overview } from '../controllers/adminController.js'
import { getAdminSettings, upsertAdminSettings } from '../controllers/settingsController.js'
import { listMenu, createMenuItem, updateMenuItem, deleteMenuItem, hardDeleteMenuItem } from '../controllers/menuController.js'
import { adminListOrders, getOrderById, updateOrderStatus, confirmPayment } from '../controllers/orderController.js'
import { listUsers, getUser, updateUserAdminSafe } from '../controllers/userController.js'
import { listPosts, getPost, createPost, updatePost, deletePost } from '../controllers/communityController.js'
import { protect, requireAdmin } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/overview', protect, requireAdmin, overview)
router.get('/analytics/overview', protect, requireAdmin, overview)

// Menu management (CRUD)
router.get('/menu', protect, requireAdmin, listMenu)
router.post('/menu', protect, requireAdmin, createMenuItem)
router.patch('/menu/:id', protect, requireAdmin, updateMenuItem)
router.delete('/menu/:id', protect, requireAdmin, deleteMenuItem)
router.delete('/menu/:id/hard', protect, requireAdmin, hardDeleteMenuItem)

// Orders management
router.get('/orders', protect, requireAdmin, adminListOrders)
router.get('/orders/:id', protect, requireAdmin, getOrderById)
router.patch('/orders/:id', protect, requireAdmin, async (req, res, next) => {
  try {
    if (req.body.paymentStatus === 'paid') {
      return confirmPayment(req, res, next)
    }
    return updateOrderStatus(req, res, next)
  } catch (err) {
    next(err)
  }
})
router.patch('/orders/:id/status', protect, requireAdmin, updateOrderStatus)
router.patch('/orders/:id/payment', protect, requireAdmin, confirmPayment)

// Users management
router.get('/users', protect, requireAdmin, listUsers)
router.get('/users/:id', protect, requireAdmin, getUser)
router.patch('/users/:id', protect, requireAdmin, updateUserAdminSafe)

// Community / posts management
router.get('/community', protect, requireAdmin, listPosts)
router.get('/community/:id', protect, requireAdmin, getPost)
router.post('/community', protect, requireAdmin, createPost)
router.put('/community/:id', protect, requireAdmin, updatePost)
router.delete('/community/:id', protect, requireAdmin, deletePost)

// Alias as /posts for admin spec
router.get('/posts', protect, requireAdmin, listPosts)
router.get('/posts/:id', protect, requireAdmin, getPost)
router.post('/posts', protect, requireAdmin, createPost)
router.put('/posts/:id', protect, requireAdmin, updatePost)
router.delete('/posts/:id', protect, requireAdmin, deletePost)

// Settings
router.get('/settings', protect, requireAdmin, getAdminSettings)
router.put('/settings', protect, requireAdmin, upsertAdminSettings)

export default router