import type { Types } from 'mongoose'

export interface AuthUserPayload {
  _id: Types.ObjectId | string
  name?: string
  email?: string
  phone?: string
  role: 'ADMIN' | 'USER'
  isVerified?: boolean
  phoneVerified?: boolean
  emailVerified?: boolean
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUserPayload
  }
}