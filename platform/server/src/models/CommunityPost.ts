import mongoose from 'mongoose'

const communityPostSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    tag: { type: String, default: 'Update' },
    publishedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    slug: { type: String },
    excerpt: { type: String },
    coverImageUrl: { type: String },
    tags: [{ type: String }],
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    deleted: { type: Boolean, default: false },
    mediaUrl: { type: String, default: '' },
    mediaType: { type: String, default: '' },
    mediaTitle: { type: String, default: '' },
    externalLinkUrl: { type: String, default: '' },
    externalLinkTitle: { type: String, default: '' },
    authorAvatarUrl: { type: String, default: '' },
    alertEnabled: { type: Boolean, default: false },
    alertStart: { type: Date },
    alertEnd: { type: Date },
  },
  { timestamps: true },
)

export default mongoose.model('CommunityPost', communityPostSchema)
