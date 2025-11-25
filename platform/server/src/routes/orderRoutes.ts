import { Router } from 'express'
import { createOrder, getMyOrders } from '../controllers/orderController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', protect, getMyOrders)
router.post('/', protect, createOrder)

export default router
