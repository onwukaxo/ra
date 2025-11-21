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
    promoMessage: { type: String, default: '' },
    promoStart: { type: Date },
    promoEnd: { type: Date },
    eventMessage: { type: String, default: '' },
    eventDate: { type: Date },
    eventStart: { type: Date },
    eventEnd: { type: Date },
    visitorAlertEnabled: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.model('Settings', settingsSchema)