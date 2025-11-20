import jwt from 'jsonwebtoken'

export function generateToken(userId, role) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET not set')
  }
  return jwt.sign({ sub: userId, role }, secret, { expiresIn: '7d' })
}