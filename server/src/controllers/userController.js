import User from '../models/User.js'

export async function listUsers(req, res) {
  const { role, status, q, page = 1, limit = 20 } = req.query
  const query = {}
  if (role) query.role = role
  if (status) query.status = status
  if (q) {
    query.$or = [
      { name: new RegExp(q, 'i') },
      { email: new RegExp(q, 'i') },
      { phone: new RegExp(q, 'i') },
    ]
  }
  const skip = (Number(page) - 1) * Number(limit)
  const users = await User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
  res.json({ success: true, data: users })
}

export async function updateMe(req, res) {
  const name = String(req.body.name || '').trim()
  const phone = String(req.body.phone || '').trim()
  const addressLine = String(req.body.addressLine || '').trim()


  if (!name || name.length < 2) {
    return res.status(400).json({ success: false, message: 'Name is required' })
  }
  const phoneValid = /^\+234\d{10}$/.test(phone) || /^\d{11}$/.test(phone)
  if (!phoneValid) {
    return res.status(400).json({ success: false, message: 'Enter a valid phone number' })
  }

  if (addressLine) {
    if (!addressLine) {
      return res.status(400).json({ success: false, message: 'Address line is required' })
    }
  }

  const update = { name, phone }
  if (addressLine) {
    update.addressLine = addressLine
  }

  await User.updateOne({ _id: req.user._id }, { $set: update }, { strict: false })
  const updated = await User.findById(req.user._id).select('-password')
  res.json({ success: true, data: updated })
}

export async function getUser(req, res) {
  const user = await User.findById(req.params.id).select('-password')
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' })
  }
  res.json({ success: true, data: user })
}

export async function updateUserAdminSafe(req, res) {
  const user = await User.findById(req.params.id)
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' })
  }

  const safeFields = ['name', 'phone', 'email', 'addressLine', 'role', 'status', 'adminNote', 'isBlocked']
  safeFields.forEach((f) => {
    if (req.body[f] !== undefined) {
      user[f] = req.body[f]
    }
  })

  if (user.role === 'ADMIN' && req.body.role && req.body.role !== 'ADMIN') {
    const adminCount = await User.countDocuments({ role: 'ADMIN' })
    if (adminCount <= 1) {
      return res.status(400).json({ success: false, message: 'Cannot remove the last admin' })
    }
  }

  await user.save()
  const updated = await User.findById(user._id).select('-password')
  res.json({ success: true, data: updated })
}