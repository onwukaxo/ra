import { Request, Response, NextFunction } from 'express'
import User from '../models/User.js'
import Order from '../models/Order.js'
import MenuItem from '../models/MenuItem.js'
import CommunityPost from '../models/CommunityPost.js'

export async function overview(req: Request, res: Response, _next?: NextFunction) {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const [usersCount, ordersCount, menuCount, postsCount, ordersToday, paidOrders, activeMenuCount, latestOrders, topItems] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    MenuItem.countDocuments({ archived: { $ne: true } }),
    CommunityPost.countDocuments({ deleted: { $ne: true } }),
    Order.countDocuments({ createdAt: { $gte: startOfDay } }),
    Order.find({ paymentStatus: 'paid' }).select('totalAmount'),
    MenuItem.countDocuments({ isAvailable: true }),
    Order.find().populate('user', 'name phone').sort({ createdAt: -1 }).limit(5).lean(),
    Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.menuItem', count: { $sum: '$items.quantity' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
  ])

  const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)

  res.json({
    success: true,
    data: {
      usersCount,
      ordersCount,
      menuCount,
      postsCount,
      todayOrdersCount: ordersToday,
      totalRevenue,
      activeMenuCount,
      latestOrders,
      topItems,
    },
  })
}