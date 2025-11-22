import jwt from 'jsonwebtoken'
import type { Types } from 'mongoose'

export function generateToken(userId: string | Types.ObjectId, role: string): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET not set')
  }
  return jwt.sign({ sub: userId, role }, secret, { expiresIn: '7d' })
}