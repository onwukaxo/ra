import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtOrderTime: { type: Number, required: true },
    sauce: { type: String, enum: ['Buffalo', 'Barbecue'], required: false },
  },
  { _id: true },
)

const orderSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    orderType: { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
    customer: {
      name: { type: String },
      phone: { type: String },
    },
    pickup: {
      location: { type: String },
      time: { type: String },
    },
    delivery: {
      addressLine: { type: String },
      instructions: { type: String },
    },
    notes: { type: String },
    subtotal: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ['whatsapp', 'bank_transfer'], default: 'whatsapp' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    status: {
      type: String,
      enum: ['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true },
)

export default mongoose.model('Order', orderSchema)
