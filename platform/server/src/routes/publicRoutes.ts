import { Router } from 'express'
import Tenant from '../models/Tenant.js'
import MenuItem from '../models/MenuItem.js'
import Order from '../models/Order.js'
import { getPublicSettings } from '../controllers/settingsController.js'

const router = Router()

router.get('/:tenantSlug/menu', async (req, res) => {
  const slug = String(req.params.tenantSlug || '').toLowerCase()
  const tenant = await Tenant.findOne({ slug }).select('_id')
  if (!tenant) {
    return res.status(404).json({ success: false, message: 'Tenant not found' })
  }
  const items = await MenuItem.find({ tenantId: tenant._id, archived: { $ne: true } }).sort({ createdAt: -1 })
  res.json({ success: true, data: items })
})

router.post('/:tenantSlug/orders', async (req, res) => {
  const slug = String(req.params.tenantSlug || '').toLowerCase()
  const tenant = await Tenant.findOne({ slug }).select('_id')
  if (!tenant) {
    return res.status(404).json({ success: false, message: 'Tenant not found' })
  }
  const { items, orderType, customer, pickup, delivery, notes, paymentMethod } = req.body
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Order items are required' })
  }
  const totalAmount = items.reduce((sum, i) => sum + Number(i.priceAtOrderTime || 0) * Number(i.quantity || 1), 0)
  const order = await Order.create({
    tenantId: tenant._id,
    user: customer?.userId,
    items,
    orderType: orderType === 'delivery' ? 'delivery' : 'pickup',
    customer,
    pickup,
    delivery,
    notes,
    subtotal: totalAmount,
    paymentMethod: paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'whatsapp',
    paymentStatus: 'pending',
    totalAmount,
  })
  await order.populate('items.menuItem')
  res.status(201).json({ success: true, data: order })
})

router.get('/settings', getPublicSettings)

export default router
