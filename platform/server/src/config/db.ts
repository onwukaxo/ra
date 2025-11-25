import mongoose from 'mongoose'

const connectDB = async () => {
  // Read connection string from environment; fail early if missing
  const uri = process.env.MONGO_URI
  if (!uri) {
    throw new Error('MONGO_URI is not set in environment')
  }
  // Establish connection with optional dbName override
  await mongoose.connect(uri, {
    dbName: process.env.MONGO_DB_NAME || 'rations_food',
  })
  console.log('MongoDB connected')
}

export default connectDB
