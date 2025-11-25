import nodemailer from 'nodemailer'

export async function sendEmailOtp(email: string, code: string) {
  if (!email) return false
  const user = process.env.SMTP_EMAIL || ''
  const pass = process.env.SMTP_PASS || ''
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || 465)
  if (!user || !pass) return false
  try {
    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } })
    await transporter.verify()
    const from = process.env.SMTP_FROM || user
    await transporter.sendMail({ from, to: email, subject: 'Your verification code', text: `Your verification code is ${code}` })
    return true
  } catch {
    return false
  }
}

export async function sendSmsOtp(phone: string, code: string) {
  if (!phone) return false
  const apiKey = process.env.TERMII_API_KEY || ''
  const sender = process.env.TERMII_SENDER || ''
  if (!apiKey || !sender) return false
  try {
    const url = 'https://api.ng.termii.com/api/sms/send'
    const payload = {
      to: phone,
      from: sender,
      sms: `Your verification code is ${code}`,
      type: 'plain',
      channel: 'generic',
      api_key: apiKey,
    }
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) return false
    return true
  } catch {
    return false
  }
}

export async function sendWhatsAppOtp(phone: string, code: string) {
  if (!phone) return false
  const apiKey = process.env.TERMII_API_KEY || ''
  const sender = process.env.TERMII_SENDER || ''
  if (!apiKey || !sender) return false
  try {
    const url = 'https://api.ng.termii.com/api/sms/send'
    const payload = {
      to: phone,
      from: sender,
      sms: `Your verification code is ${code}`,
      type: 'plain',
      channel: 'whatsapp',
      api_key: apiKey,
    }
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) return false
    return true
  } catch {
    return false
  }
}
