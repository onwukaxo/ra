import User from '../models/User.js'
import Order from '../models/Order.js'
import MenuItem from '../models/MenuItem.js'
import CommunityPost from '../models/CommunityPost.js'

export async function overview(req, res) {
  const [usersCount, ordersCount, menuCount, postsCount] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    MenuItem.countDocuments(),
    CommunityPost.countDocuments(),
  ])
  res.json({
    success: true,
    data: { usersCount, ordersCount, menuCount, postsCount },
  })
}