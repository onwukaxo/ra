import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema(
  {
    contacts: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      location: { type: String, default: '' },
    },
    bank: {
      name: { type: String, default: '' },
      accountName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
    },
    socials: [{ name: String, url: String }],
  },
  { timestamps: true },
)

export default mongoose.model('Settings', settingsSchema)