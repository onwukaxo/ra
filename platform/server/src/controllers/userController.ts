import { Request, Response, NextFunction } from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

export async function listUsers(req: Request, res: Response, _next?: NextFunction) {
  const { role, status, q, page = 1, limit = 20 } = req.query
  const query: any = req.user?.role === 'SUPERADMIN' ? {} : { tenantId: req.user?.tenantId }
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

export async function updateMe(req: Request, res: Response) {
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

  const update: any = { name, phone }
  if (addressLine) {
    update.addressLine = addressLine
  }

  await User.updateOne({ _id: req.user._id }, { $set: update }, { strict: false })
  const updated = await User.findById(req.user._id).select('-password')
  res.json({ success: true, data: updated })
}

export async function getUser(req: Request, res: Response) {
  const user = await User.findById(req.params.id).select('-password')
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' })
  }
  res.json({ success: true, data: user })
}

export async function updateUserAdminSafe(req: Request, res: Response) {
  const user = await User.findById(req.params.id)
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' })
  }

  if (String((user as any).tenantId || '') !== String(req.user?.tenantId || '')) {
    return res.status(403).json({ success: false, message: 'Cross-tenant update not allowed' })
  }

  const safeFields = ['name', 'phone', 'email', 'addressLine', 'role', 'status', 'adminNote', 'isBlocked']
  safeFields.forEach((f) => {
    if (req.body[f] !== undefined) {
      user[f] = req.body[f]
    }
  })

  const allowedRoles = ['USER','ADMIN','SUPERADMIN','owner','manager','cashier','kitchen','staff']
  if (req.body.role !== undefined && !allowedRoles.includes(String(req.body.role))) {
    return res.status(400).json({ success: false, message: 'Invalid role' })
  }
  if (String(user._id) === String(req.user?._id) && req.body.role && ['owner','ADMIN'].includes(String(user.role)) && !['owner','ADMIN'].includes(String(req.body.role))) {
    const ownersOrAdmins = await User.countDocuments({ tenantId: req.user?.tenantId, role: { $in: ['owner','ADMIN'] } })
    if (ownersOrAdmins <= 1) {
      return res.status(400).json({ success: false, message: 'Cannot demote the only owner/admin' })
    }
  }

  await user.save()
  const updated = await User.findById(user._id).select('-password')
  res.json({ success: true, data: updated })
}

export async function changeUserRole(req: Request, res: Response) {
  const target = await User.findById(req.params.id)
  if (!target) {
    return res.status(404).json({ success: false, message: 'User not found' })
  }
  if (String((target as any).tenantId || '') !== String(req.user?.tenantId || '')) {
    return res.status(403).json({ success: false, message: 'Cross-tenant update not allowed' })
  }
  const role = String(req.body.role || '')
  const allowedRoles = ['USER','ADMIN','SUPERADMIN','owner','manager','cashier','kitchen','staff']
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' })
  }
  if (String(target._id) === String(req.user?._id) && ['owner','ADMIN'].includes(String(target.role)) && !['owner','ADMIN'].includes(role)) {
    const ownersOrAdmins = await User.countDocuments({ tenantId: req.user?.tenantId, role: { $in: ['owner','ADMIN'] } })
    if (ownersOrAdmins <= 1) {
      return res.status(400).json({ success: false, message: 'Cannot demote the only owner/admin' })
    }
  }
  target.role = role as any
  await target.save()
  const updated = await User.findById(target._id).select('-password')
  res.json({ success: true, data: updated })
}

export async function createUser(req: Request, res: Response, _next?: NextFunction) {
  const name = String(req.body.name || '').trim()
  const email = String(req.body.email || '').trim().toLowerCase()
  const role = String(req.body.role || '').trim()

  if (!name || !email || !role) {
    return res.status(400).json({ success: false, message: 'Name, email and role are required' })
  }
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailValid) {
    return res.status(400).json({ success: false, message: 'Enter a valid email' })
  }
  const exists = await User.findOne({ email, tenantId: req.user?.tenantId })
  if (exists) {
    return res.status(400).json({ success: false, message: 'Email already exists' })
  }

  const allowedRoles = ['USER','ADMIN','SUPERADMIN','owner','manager','cashier','kitchen','staff']
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' })
  }

  const actor = String(req.user?.role || '')
  const actorIsOwner = actor === 'owner'
  const actorIsAdmin = actor === 'ADMIN' || actor === 'SUPERADMIN'

  if (['owner','ADMIN'].includes(role)) {
    if (!actorIsOwner) {
      return res.status(403).json({ success: false, message: 'Only owner can create owner/admin accounts' })
    }
  } else if (['manager','cashier','kitchen','staff','USER'].includes(role)) {
    if (!actorIsOwner && !actorIsAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }
  }

  const tempPassword = cryptoPassword()
  const hashed = await bcrypt.hash(tempPassword, 10)
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role as any,
    tenantId: req.user?.tenantId as any,
    isVerified: false,
  })

  const safe = await User.findById(user._id).select('-password')
  return res.status(201).json({ success: true, data: safe })
}

function cryptoPassword() {
  const rand = Math.random().toString(36).slice(2, 8)
  return `Temp@${rand}`
}
