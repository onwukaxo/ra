import { Request, Response, NextFunction } from 'express'
import User from '../models/User.js'
import Order from '../models/Order.js'
import MenuItem from '../models/MenuItem.js'
import CommunityPost from '../models/CommunityPost.js'

export async function overview(req: Request, res: Response, _next?: NextFunction) {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const base: any = req.user?.role === 'SUPERADMIN' ? {} : { tenantId: req.user?.tenantId }

  const [usersCount, ordersCount, menuCount, postsCount, ordersToday, paidOrders, activeMenuCount, latestOrders, topItems] = await Promise.all([
    User.countDocuments(base),
    Order.countDocuments(base),
    MenuItem.countDocuments({ ...base, archived: { $ne: true } }),
    CommunityPost.countDocuments({ ...base, deleted: { $ne: true } }),
    Order.countDocuments({ ...base, createdAt: { $gte: startOfDay } }),
    Order.find({ ...base, paymentStatus: 'paid' }).select('totalAmount'),
    MenuItem.countDocuments({ ...base, isAvailable: true }),
    Order.find(base).populate('user', 'name phone').sort({ createdAt: -1 }).limit(5).lean(),
    Order.aggregate([
      { $unwind: '$items' },
      { $match: base },
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
