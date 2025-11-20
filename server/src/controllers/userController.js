import User from '../models/User.js'

export async function listUsers(req, res) {
  const users = await User.find().select('-password').sort({ createdAt: -1 })
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