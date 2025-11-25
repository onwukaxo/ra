import { Request, Response, NextFunction } from 'express'
import MenuItem from '../models/MenuItem.js'
import Tenant from '../models/Tenant.js'

export async function listMenu(req: Request, res: Response, _next?: NextFunction) {
  const isAdmin = req.user?.role === 'ADMIN' || req.user?.role === 'SUPERADMIN'
  let tenantId = req.user?.tenantId as any
  if (!tenantId) {
    const slug = (String(req.query.tenant || req.headers['x-tenant'] || process.env.DEFAULT_TENANT_SLUG || 'rations-food')).toLowerCase()
    const t = await Tenant.findOne({ slug }).select('_id')
    tenantId = t?._id
  }
  const base: any = tenantId ? { tenantId } : {}
  const query: any = isAdmin ? base : { ...base, archived: { $ne: true } }
  const items = await MenuItem.find(query).sort({ createdAt: -1 })
  res.json({ success: true, data: items })
}

export async function getMenuItem(req: Request, res: Response) {
  let tenantId = req.user?.tenantId as any
  if (!tenantId) {
    const slug = (String(req.query.tenant || req.headers['x-tenant'] || process.env.DEFAULT_TENANT_SLUG || 'rations-food')).toLowerCase()
    const t = await Tenant.findOne({ slug }).select('_id')
    tenantId = t?._id
  }
  const item = tenantId ? await MenuItem.findOne({ _id: req.params.id, tenantId }) : await MenuItem.findById(req.params.id)
  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' })
  }
  res.json({ success: true, data: item })
}

export async function createMenuItem(req: Request, res: Response) {
  const { name, description, price, category, imageUrl, isAvailable } = req.body
  if (!name || price == null) {
    return res.status(400).json({ success: false, message: 'Name and price are required' })
  }
  const item = await MenuItem.create({
    tenantId: req.user?.tenantId,
    name,
    description: description || '',
    price,
    category: category || 'General',
    imageUrl: imageUrl || '',
    isAvailable: isAvailable !== undefined ? isAvailable : true,
  })
  res.status(201).json({ success: true, data: item })
}

export async function updateMenuItem(req: Request, res: Response) {
  const item = await MenuItem.findOne({ _id: req.params.id, tenantId: req.user?.tenantId })
  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' })
  }

  const fields = ['name', 'description', 'price', 'category', 'imageUrl', 'isAvailable']
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      item[field] = req.body[field]
    }
  })

  await item.save()
  res.json({ success: true, data: item })
}

export async function deleteMenuItem(req: Request, res: Response) {
  const item = await MenuItem.findOne({ _id: req.params.id, tenantId: req.user?.tenantId })
  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' })
  }
  item.archived = true
  await item.save()
  res.json({ success: true, message: 'Menu item archived' })
}

export async function hardDeleteMenuItem(req: Request, res: Response) {
  const item = await MenuItem.findOne({ _id: req.params.id, tenantId: req.user?.tenantId })
  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' })
  }
  await MenuItem.deleteOne({ _id: item._id })
  res.json({ success: true, message: 'Menu item deleted permanently' })
}
