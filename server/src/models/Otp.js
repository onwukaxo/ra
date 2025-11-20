import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    code: { type: String, required: true },          // <- use "code"
    expiresAt: { type: Date, required: true, expires: 300 },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Otp', otpSchema)
