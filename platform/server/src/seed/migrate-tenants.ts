import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import Tenant from '../models/Tenant.js'
import User from '../models/User.js'
import MenuItem from '../models/MenuItem.js'
import Order from '../models/Order.js'
import CommunityPost from '../models/CommunityPost.js'
import Settings from '../models/Settings.js'

async function run() {
  await connectDB()

  const slug = 'rations-food'
  const name = 'Rations Food'

  let tenant = await Tenant.findOne({ slug })
  if (!tenant) {
    tenant = await Tenant.create({ name, slug })
    console.log(`Created tenant: ${name} (${tenant._id})`)
  } else {
    console.log(`Using existing tenant: ${name} (${tenant._id})`)
  }

  const tid = tenant._id

  const userResult = await User.updateMany({ $or: [{ tenantId: { $exists: false } }, { tenantId: null }] }, { $set: { tenantId: tid } })
  console.log(`Users updated: ${userResult.modifiedCount}`)

  const menuResult = await MenuItem.updateMany({ $or: [{ tenantId: { $exists: false } }, { tenantId: null }] }, { $set: { tenantId: tid } })
  console.log(`Menu items updated: ${menuResult.modifiedCount}`)

  const orderResult = await Order.updateMany({ $or: [{ tenantId: { $exists: false } }, { tenantId: null }] }, { $set: { tenantId: tid } })
  console.log(`Orders updated: ${orderResult.modifiedCount}`)

  const postResult = await CommunityPost.updateMany({ $or: [{ tenantId: { $exists: false } }, { tenantId: null }] }, { $set: { tenantId: tid } })
  console.log(`Community posts updated: ${postResult.modifiedCount}`)

  const settings = await Settings.findOne()
  if (settings && (!settings.tenantId || (settings as any).tenantId === null)) {
    settings.tenantId = tid as any
    await settings.save()
    console.log('Settings updated with tenantId')
  } else if (!settings) {
    await Settings.create({ tenantId: tid })
    console.log('Created settings document for tenant')
  } else {
    console.log('Settings already associated with a tenant')
  }

  await mongoose.connection.close()
}

run().catch(async (err) => {
  console.error(err)
  try { await mongoose.connection.close() } catch {}
  process.exit(1)
})