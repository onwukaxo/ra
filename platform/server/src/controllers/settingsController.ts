import { Request, Response, NextFunction } from 'express'
import Settings from '../models/Settings.js'
import Tenant from '../models/Tenant.js'

function defaults() {
  return {
    contacts: {
      email: 'rations.ng@gmail.com',
      phone: '+2349122058888',
      whatsapp: 'https://wa.me/2349122058888',
      location: 'Rations, Plot 123, Railway junction, Idu Industrial District, Abuja 900001, Federal Capital Territory',
    },
    bank: {
      name: 'Rations Bank',
      accountName: 'Rations Food Ltd',
      accountNumber: '1234567890',
    },
    socials: [
      { name: 'TikTok', url: 'https://www.tiktok.com/@rations.food' },
      { name: 'Instagram', url: 'https://instagram.com/rations.food' },
      { name: 'Facebook', url: 'https://facebook.com/rations.food' },
      { name: 'YouTube', url: 'https://youtube.com/@rationsfood' },
      { name: 'X', url: 'https://x.com/rationsfood' },
      { name: 'WhatsApp', url: 'https://wa.me/2349122058888' },
    ],
    promoMessage: '',
    promoStart: null,
    promoEnd: null,
    eventMessage: '',
    eventDate: null,
    eventStart: null,
    eventEnd: null,
    visitorAlertEnabled: false,
  }
}

export async function getAdminSettings(req: Request, res: Response, _next?: NextFunction) {
  const tenantId = req.user?.tenantId as any
  let doc = await Settings.findOne({ tenantId })
  if (!doc) {
    doc = await Settings.create({ ...defaults(), tenantId })
  }
  res.json({ success: true, data: doc })
}

export async function upsertAdminSettings(req: Request, res: Response) {
  const payload = req.body || {}
  const phone = String(payload?.contacts?.phone || '')
  const acc = String(payload?.bank?.accountNumber || '')
  const phoneOk = /^\+234\d{10}$/.test(phone) || /^\d{11}$/.test(phone) || phone === ''
  const accOk = /^\d{10}$/.test(acc) || acc === ''
  if (!phoneOk) {
    return res.status(400).json({ success: false, message: 'Invalid phone format' })
  }
  if (!accOk) {
    return res.status(400).json({ success: false, message: 'Invalid account number format' })
  }
  const tenantId = req.user?.tenantId as any
  let doc = await Settings.findOne({ tenantId })
  if (!doc) {
    doc = await Settings.create({ ...defaults(), tenantId })
  }
  doc.set({ ...payload, tenantId })
  await doc.save()
  res.json({ success: true, data: doc })
}

export async function getPublicSettings(req: Request, res: Response) {
  const slug = (String(req.query.tenant || req.headers['x-tenant'] || process.env.DEFAULT_TENANT_SLUG || 'rations-food')).toLowerCase()
  const t = await Tenant.findOne({ slug }).select('_id')
  const tenantId = t?._id
  let doc: any = await Settings.findOne(tenantId ? { tenantId } : {}).lean()
  if (!doc) {
    doc = defaults() as any
  }
  res.json({ success: true, data: doc })
}
