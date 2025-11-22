import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import User from '../models/User.js'
import Otp from '../models/Otp.js'
import { generateToken } from '../utils/generateToken.js'
import { sendEmailOtp, sendSmsOtp, sendWhatsAppOtp } from '../services/notify.js'

export async function register(req: Request, res: Response, _next?: NextFunction) {
  const name = String(req.body.name || '').trim()
  const email = String(req.body.email || '').trim().toLowerCase()
  const phone = String(req.body.phone || '').trim()
  const password = String(req.body.password || '')

  if (!name || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Name, phone and password are required',
    })
  }

  if (email) {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!emailValid) {
      return res.status(400).json({ success: false, message: 'Enter a valid email' })
    }
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }
  }

  if (phone) {
    const phoneValid = /^\+234\d{10}$/.test(phone) || /^\d{11}$/.test(phone)
    if (!phoneValid) {
      return res.status(400).json({ success: false, message: 'Enter a valid phone number' })
    }
    const existingPhone = await User.findOne({ phone })
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'Phone already registered' })
    }
  }

  const hashed = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email: email || undefined,
    phone: phone || undefined,
    password: hashed,
    isVerified: false,
  })

  await Otp.deleteMany({ user: user._id })

  const code = String(Math.floor(100000 + Math.random() * 900000))
  await Otp.create({
    user: user._id,
    code: crypto.createHash('sha256').update(code).digest('hex'),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    attempts: 0,
  })

  let channel = 'email'
  try {
    if (phone) {
      channel = 'sms'
      await sendSmsOtp(phone, code)
    } else {
      await sendEmailOtp(email, code)
    }
  } catch {}

  return res.status(201).json({
    success: true,
    message: 'Verification code sent',
    data: { userId: user._id, channel },
  })
}

export async function login(req: Request, res: Response, _next?: NextFunction) {
  const identifier = String(req.body.identifier || '').trim()
  const password = String(req.body.password || '')

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: 'Identifier and password are required',
    })
  }

  const looksEmail = /@/.test(identifier) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
  let user

  if (looksEmail) {
    user = await User.findOne({ email: identifier.toLowerCase() })
  } else {
    const phoneValid = /^\+234\d{10}$/.test(identifier) || /^\d{11}$/.test(identifier)
    if (!phoneValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
    user = await User.findOne({ phone: identifier })
  }

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' })
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' })
  }

  const token = generateToken(user._id, user.role)
  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    phoneVerified: user.phoneVerified,
    emailVerified: user.emailVerified,
  }

  return res.json({
    success: true,
    message: 'Logged in',
    data: { user: safeUser, token },
  })
}

export async function me(req: Request, res: Response) {
  return res.json({
    success: true,
    data: req.user,
  })
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const user = await User.findOne({ email })

    if (user) {
      const token = crypto.randomBytes(32).toString('hex')
      const hashed = crypto.createHash('sha256').update(token).digest('hex')

      user.passwordResetToken = hashed
      user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000)
      await user.save()

      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
      const resetLink = `${clientUrl}/reset-password/${token}`
    }

    return res.status(200).json({
      success: true,
      message: 'If an account exists, a reset link has been sent.',
    })
  } catch {
    return res.status(200).json({
      success: true,
      message: 'If an account exists, a reset link has been sent.',
    })
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const token = String(req.params.token || '')
    const hashed = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: new Date() },
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token.',
      })
    }

    const password = String(req.body.password || '')
    if (password.length < 8 || !/\d/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and include a number.',
      })
    }

    user.password = await bcrypt.hash(password, 10)
    user.passwordResetToken = null
    user.passwordResetExpires = null
    await user.save()

    const jwtToken = generateToken(user._id, user.role)
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      emailVerified: user.emailVerified,
    }

    return res.json({
      success: true,
      message: 'Password reset successful',
      data: { user: safeUser, token: jwtToken },
    })
  } catch {
    return res.status(400).json({
      success: false,
      message: 'Unable to reset password.',
    })
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const currentPassword = String(req.body.currentPassword || '')
    const newPassword = String(req.body.newPassword || '')

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' })
    }

    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters and include a number.' })
    }

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    const token = generateToken(user._id, user.role)
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      emailVerified: user.emailVerified,
    }

    return res.json({ success: true, message: 'Password changed', data: { user: safeUser, token } })
  } catch {
    return res.status(400).json({ success: false, message: 'Unable to change password' })
  }
}

function hashCode(code) {
  return crypto.createHash('sha256').update(String(code)).digest('hex')
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export async function sendOtp(req: Request, res: Response) {
  const phone = String(req.body.phone || '').trim()
  const password = String(req.body.password || '')
  const name = String(req.body.name || 'User').trim() || 'User'
  const intent = String(req.body.intent || 'register')

  const phoneValid = /^\+234\d{10}$/.test(phone) || /^\d{11}$/.test(phone)
  if (!phoneValid || !password) {
    return res.status(400).json({ success: false, message: 'Phone and password are required' })
  }

  let user = await User.findOne({ phone })
  if (!user) {
    if (intent !== 'register') {
      return res.status(404).json({ success: false, message: 'Account not found' })
    }
    const hashed = await bcrypt.hash(password, 10)
    user = await User.create({ name, phone, password: hashed, phoneVerified: false })
  } else {
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
  }

  const code = generateOtp()
  user.otpCode = hashCode(code)
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000)
  await user.save()

  const sent = await sendWhatsAppOtp(phone, code)
  if (!sent) {
    await sendSmsOtp(phone, code)
  }

  return res.json({ success: true, message: 'OTP sent' })
}

export async function resendOtp(req: Request, res: Response) {
  try {
    const userId = String(req.body.userId || '').trim()
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Invalid request' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found' })
    }

    const code = String(Math.floor(100000 + Math.random() * 900000))
    await Otp.deleteMany({ user: user._id })
    await Otp.create({
      user: user._id,
      code: crypto.createHash('sha256').update(code).digest('hex'),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
    })

    let sent = false
    try {
      if (user.phone) {
        sent = await sendWhatsAppOtp(user.phone, code)
        if (!sent) {
          await sendSmsOtp(user.phone, code)
        }
      } else if (user.email) {
        await sendEmailOtp(user.email, code)
        sent = true
      }
    } catch {}

    return res.json({ success: true, message: 'Verification code resent' })
  } catch {
    return res.status(400).json({ success: false, message: 'Unable to resend code' })
  }
}

export async function verifyOtp(req: Request, res: Response) {
  const userId = String(req.body.userId || '').trim()
  const code = String(req.body.code || '').trim()

  if (!userId || !code) {
    return res.status(400).json({ success: false, message: 'Invalid code' })
  }

  const record = await Otp.findOne({ user: userId })
  if (!record) {
    return res.status(400).json({ success: false, message: 'Invalid code' })
  }

  if (record.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: record._id })
    return res.status(400).json({ success: false, message: 'Invalid code' })
  }

  if (record.attempts >= 3) {
    await Otp.deleteOne({ _id: record._id })
    return res.status(429).json({ success: false, message: 'Invalid code' })
  }

  const hashed = crypto.createHash('sha256').update(code).digest('hex')

  if (record.code !== hashed) {
    record.attempts += 1
    await record.save()
    return res.status(400).json({ success: false, message: 'Invalid code' })
  }

  await Otp.deleteOne({ _id: record._id })

  const user = await User.findById(userId)
  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid code' })
  }

  user.isVerified = true
  if (user.email) user.emailVerified = true
  if (user.phone) user.phoneVerified = true
  await user.save()

  const token = generateToken(user._id, user.role)
  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isVerified: user.isVerified,
    phoneVerified: user.phoneVerified,
    emailVerified: user.emailVerified,
  }

  return res.json({ success: true, message: 'Verification successful', data: { user: safeUser, token } })
}

export async function verifyEmail(req: Request, res: Response) {
  const email = String(req.body.email || '').trim().toLowerCase()
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' })
  }

  const user = await User.findById(req.user._id)
  if (!user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  if (user.email !== email) {
    return res.status(400).json({ success: false, message: 'Email does not match' })
  }

  user.emailVerified = true
  await user.save()

  return res.json({
    success: true,
    message: 'Email verified',
    data: { emailVerified: true },
  })
}