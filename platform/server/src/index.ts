import dotenv from 'dotenv'
dotenv.config()
import app from './app.js'
import mongoose from 'mongoose'
import connectDB from './config/db.js'

const PORT = process.env.PORT || 6000

async function start() {
  // Initialize database before accepting requests
  await connectDB()
  try {
    const coll = mongoose.connection.collection('users')
    const idx = await coll.indexes()
    const hasPhone = idx.find((i: any) => i.name === 'phone_1')
    if (hasPhone && !hasPhone.sparse) {
      await coll.dropIndex('phone_1').catch(() => {})
      await coll.createIndex({ phone: 1 }, { unique: true, sparse: true })
    }
  } catch {}
  // Start HTTP server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start().catch((err) => {
  // Fail fast if bootstrapping errors occur
  console.error('Failed to start server', err)
  process.exit(1)
})
