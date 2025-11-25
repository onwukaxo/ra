import type { Request, Response, NextFunction } from 'express'
import { protect } from './authMiddleware.js'
import { PERMISSIONS, ROLE } from '../auth/permissions.js'

// Compose existing auth guard
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  return protect(req, res, next)
}

// Check if current user role is allowed
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const current = String(req.user?.role || '').toLowerCase()
    const allowed = roles.map((r) => String(r).toLowerCase())
    if (!current || !allowed.includes(current) && !(current === 'admin' && allowed.includes(ROLE.ADMIN))) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }
    next()
  }
}

// Check permission by key using map
export function requirePermission(key: keyof typeof PERMISSIONS) {
  return (req: Request, res: Response, next: NextFunction) => {
    const current = String(req.user?.role || '').toLowerCase()
    const allowed = (PERMISSIONS[key] || []).map((r) => r.toLowerCase())
    // Treat ADMIN/SUPERADMIN as admin
    const normalized = current === 'ADMIN' || current === 'SUPERADMIN' ? 'admin' : current
    if (!normalized || !allowed.includes(normalized)) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    next()
  }
}

