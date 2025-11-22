import mongoose from 'mongoose'

const connectDB = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    throw new Error('MONGO_URI is not set in environment')
  }
  await mongoose.connect(uri, {
    dbName: process.env.MONGO_DB_NAME || 'rations_food',
  })
  console.log('MongoDB connected')
}

export default connectDB