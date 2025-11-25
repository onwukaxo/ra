import type { Types } from 'mongoose'

export interface AuthUserPayload {
  _id: Types.ObjectId | string
  name?: string
  email?: string
  phone?: string
  role: 'ADMIN' | 'USER' | 'SUPERADMIN' | 'owner' | 'manager' | 'cashier' | 'kitchen' | 'staff'
  isVerified?: boolean
  phoneVerified?: boolean
  emailVerified?: boolean
  tenantId?: Types.ObjectId | string
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUserPayload
  }
}
