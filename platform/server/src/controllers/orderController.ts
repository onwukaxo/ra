import { Request, Response, NextFunction } from 'express'
import Order from '../models/Order.js'
import MenuItem from '../models/MenuItem.js'

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { items, orderType, customer, pickup, delivery, notes, paymentMethod } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are required' })
    }

    const menuItems = await MenuItem.find({ _id: { $in: items.map(i => i.menuItem) } })

    const orderItems = items.map((item) => {
      const menuItem = menuItems.find(m => m._id.toString() === item.menuItem)
      if (!menuItem) {
        throw new Error('Menu item not found in order')
      }

      const isWings = String(menuItem.category || '').toLowerCase() === 'wings'

      return {
        menuItem: menuItem._id,
        quantity: item.quantity,
        priceAtOrderTime: menuItem.price,
        sauce: isWings && item.sauce ? item.sauce : undefined,
      }
    })

    const subtotal = orderItems.reduce((sum, i) => sum + i.priceAtOrderTime * i.quantity, 0)
    const type = (orderType === 'delivery' ? 'delivery' : 'pickup')
    const totalAmount = subtotal

    const order = await Order.create({
      tenantId: req.user?.tenantId,
      user: req.user._id,
      items: orderItems,
      orderType: type,
      customer: {
        name: customer?.name || req.user?.name || '',
        phone: customer?.phone || '',
      },
      pickup: type === 'pickup' ? {
        location: pickup?.location || '',
        time: pickup?.time || '',
      } : undefined,
      delivery: type === 'delivery' ? {
        addressLine: delivery?.addressLine || '',
        instructions: delivery?.deliveryInstructions || '',
      } : undefined,
      notes: notes || '',
      subtotal,
      paymentMethod: paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'whatsapp',
      paymentStatus: 'pending',
      totalAmount,
    })

    await order.populate('items.menuItem')
    await order.populate('user', 'name email')

    return res.status(201).json({ success: true, data: order })
  } catch (err) {
    next(err)
  }
}

export async function getMyOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const orders = await Order.find({ user: req.user._id, tenantId: req.user?.tenantId })
      .populate('items.menuItem')
      .sort({ createdAt: -1 })

    res.json({ success: true, data: orders })
  } catch (err) {
    next(err)
  }
}

export async function getAllOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const base: any = req.user?.role === 'SUPERADMIN' ? {} : { tenantId: req.user?.tenantId }
    const orders = await Order.find(base)
      .populate('items.menuItem')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })

    res.json({ success: true, data: orders })
  } catch (err) {
    next(err)
  }
}

export async function confirmPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await Order.findOne({ _id: req.params.id, tenantId: req.user?.tenantId })
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }
    order.paymentStatus = 'paid'
    await order.save()
    res.json({ success: true, data: order })
  } catch (err) {
    next(err)
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body
    const order = await Order.findOne({ _id: req.params.id, tenantId: req.user?.tenantId })
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    order.status = status || order.status
    await order.save()
    res.json({ success: true, data: order })
  } catch (err) {
    next(err)
  }
}

export async function getOrderById(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await Order.findOne({ _id: req.params.id, tenantId: req.user?.tenantId })
      .populate('items.menuItem')
      .populate('user', 'name email phone')
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }
    res.json({ success: true, data: order })
  } catch (err) {
    next(err)
  }
}

export async function adminListOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, paymentStatus, orderType, from, to, page = 1, limit = 20 } = req.query
    const query: any = req.user?.role === 'SUPERADMIN' ? {} : { tenantId: req.user?.tenantId }
    if (status) query.status = status
    if (paymentStatus) query.paymentStatus = paymentStatus
    if (orderType) query.orderType = orderType
    if (from || to) {
      query.createdAt = {}
      if (from) query.createdAt.$gte = new Date(from)
      if (to) query.createdAt.$lte = new Date(to)
    }

    const skip = (Number(page) - 1) * Number(limit)
    const orders = await Order.find(query)
      .populate('items.menuItem')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean()

    res.json({ success: true, data: orders })
  } catch (err) {
    next(err)
  }
}
