import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function protect(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.substring(7) : null

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any
    const user = await User.findById(decoded.sub).select('-password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' })
    }
    req.user = { ...user.toObject(), tenantId: (user as any).tenantId }
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' })
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'SUPERADMIN')) {
    return res.status(403).json({ success: false, message: 'Admin access only' })
  }
  next()
}

export function requireRole(...allowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role
    if (!role || !allowed.includes(role)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }
    next()
  }
}
