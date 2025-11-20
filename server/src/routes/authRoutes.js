import { Router } from 'express'
import { login, me, register, forgotPassword, resetPassword, sendOtp, verifyOtp, verifyEmail, resendOtp } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

const attempts = new Map()
const limitWindowMs = 5 * 60 * 1000
const limitCount = 5
const rateLimit = (keyFn) => (req, res, next) => {
  const key = keyFn(req)
  const now = Date.now()
  const list = attempts.get(key) || []
  const recent = list.filter((t) => now - t < limitWindowMs)
  if (recent.length >= limitCount) {
    return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' })
  }
  recent.push(now)
  attempts.set(key, recent)
  next()
}

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, me)
router.post('/forgot-password', rateLimit((req)=>req.ip), forgotPassword)
router.put('/reset-password/:token', resetPassword)

router.post('/send-otp', rateLimit((req)=>String(req.body.phone||req.ip)), sendOtp)
router.post('/verify-otp', verifyOtp)
router.post('/resend-otp', rateLimit((req)=>String(req.body.userId||req.ip)), resendOtp)
router.post('/email/verify', protect, verifyEmail)

export default router