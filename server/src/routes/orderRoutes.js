import { Router } from 'express'
import { createOrder, getAllOrders, getMyOrders, updateOrderStatus, confirmPayment } from '../controllers/orderController.js'
import { protect, requireAdmin } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/', protect, createOrder)
router.get('/', protect, getMyOrders)
router.get('/my', protect, getMyOrders)
router.get('/all', protect, requireAdmin, getAllOrders)
router.patch('/:id/status', protect, requireAdmin, updateOrderStatus)
router.patch('/:id/confirm-payment', protect, requireAdmin, confirmPayment)

export default router