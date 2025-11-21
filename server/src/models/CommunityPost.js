import mongoose from 'mongoose'

const communityPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    tag: { type: String, default: 'Update' },
    publishedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Extended fields for admin management
    slug: { type: String },
    excerpt: { type: String },
    coverImageUrl: { type: String },
    tags: [{ type: String }],
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.model('CommunityPost', communityPostSchema)