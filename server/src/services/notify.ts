import nodemailer from 'nodemailer'

export async function sendEmailOtp(email: string, code: string): Promise<void> {
  const user = process.env.SMTP_EMAIL || ''
  const pass = process.env.SMTP_PASS || ''
  if (!email || !user || !pass) return
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  })
  const from = process.env.SMTP_EMAIL || 'no-reply@localhost'
  const subject = 'Your Verification Code'
  const text = `Your verification code is ${code}`
  await transporter.sendMail({ from, to: email, subject, text })
}

export async function sendSmsOtp(phone: string, code: string): Promise<void> {
  const apiKey = process.env.TERMII_API_KEY || ''
  const sender = process.env.TERMII_SENDER || ''
  if (!phone || !apiKey || !sender) return
  const body = {
    to: phone,
    from: sender,
    sms: `Your verification code is ${code}`,
    type: 'plain',
    channel: 'generic',
    api_key: apiKey,
  }
  try {
    await fetch('https://api.ng.termii.com/api/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {}
}

export async function sendWhatsAppOtp(phone: string, code: string): Promise<boolean> {
  const apiKey = process.env.TERMII_API_KEY || ''
  const sender = process.env.TERMII_SENDER || ''
  if (!phone || !apiKey || !sender) return false
  const payload = {
    to: phone,
    from: sender,
    sms: `Your verification code is ${code}`,
    type: 'plain',
    channel: 'whatsapp',
    api_key: apiKey,
  }
  try {
    const res = await fetch('https://api.ng.termii.com/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.ok
  } catch {
    return false
  }
}