import mongoose, { Schema, Types, Document, model } from 'mongoose'

export interface TenantDocument extends Document {
  name: string
  slug: string
  logoUrl?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  contact?: { phone?: string; email?: string; address?: string; country?: string; city?: string }
  settings?: { enablePickup?: boolean; enableDelivery?: boolean; currency?: string; timezone?: string }
  createdBy?: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const tenantSchema = new Schema<TenantDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    logoUrl: { type: String },
    primaryColor: { type: String },
    secondaryColor: { type: String },
    accentColor: { type: String },
    contact: {
      phone: { type: String },
      email: { type: String },
      address: { type: String },
      country: { type: String },
      city: { type: String },
    },
    settings: {
      enablePickup: { type: Boolean, default: true },
      enableDelivery: { type: Boolean, default: true },
      currency: { type: String, default: 'NGN' },
      timezone: { type: String, default: 'Africa/Lagos' },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

tenantSchema.index({ createdAt: -1 })

export default model<TenantDocument>('Tenant', tenantSchema)
