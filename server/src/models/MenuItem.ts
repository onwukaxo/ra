import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    category: { type: String, default: 'General' },
    imageUrl: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    popularity: { type: Number, default: 0 },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.model('MenuItem', menuItemSchema)