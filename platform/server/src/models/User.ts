import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, lowercase: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', index: true },
    phone: { type: String },
    addressLine: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN', 'SUPERADMIN', 'owner', 'manager', 'cashier', 'kitchen', 'staff'], default: 'USER' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    adminNote: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    otpCode: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
  },
  { timestamps: true },
)

userSchema.index({ phone: 1 }, { unique: true, sparse: true })

export default mongoose.model('User', userSchema)
